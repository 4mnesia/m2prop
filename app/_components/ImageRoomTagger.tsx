"use client";

import { useMemo, useState } from "react";
import { AMBIENTES_ORDENADOS, EMOJIS_AMBIENTE, ETIQUETAS_AMBIENTE, clasificarLote } from "../_lib/roomDetector";
import type { TipoAmbiente } from "../_lib/types";
import { IconSparkles } from "./Icon";
import { useToast } from "./ToastProvider";

type Props = {
  imagenes: string[];
  ambientes: TipoAmbiente[];
  onChange: (ambientes: TipoAmbiente[]) => void;
};

type EstadoDeteccion = {
  procesando: boolean;
  paso: number;
  total: number;
  resultados: { tipo: TipoAmbiente; confianza: number }[];
};

const ESTADO_INICIAL: EstadoDeteccion = { procesando: false, paso: 0, total: 0, resultados: [] };

export default function ImageRoomTagger({ imagenes, ambientes, onChange }: Props) {
  const { exito, info } = useToast();
  const [deteccion, setDeteccion] = useState<EstadoDeteccion>(ESTADO_INICIAL);

  const arreglo: TipoAmbiente[] = useMemo(() => {
    const copia: TipoAmbiente[] = [];
    for (let i = 0; i < imagenes.length; i++) copia.push(ambientes[i] ?? "sin_etiqueta");
    return copia;
  }, [ambientes, imagenes.length]);

  const cambiarUna = (idx: number, tipo: TipoAmbiente) => {
    const nueva = [...arreglo];
    nueva[idx] = tipo;
    onChange(nueva);
  };

  const limpiar = () => {
    onChange(imagenes.map(() => "sin_etiqueta"));
    info("Etiquetas removidas", "Podés volver a detectar cuando quieras");
  };

  const detectarConIA = async () => {
    if (imagenes.length === 0) return;
    const resultados = clasificarLote(imagenes);
    setDeteccion({ procesando: true, paso: 0, total: imagenes.length, resultados: [] });
    const nueva: TipoAmbiente[] = [...arreglo];
    for (let i = 0; i < imagenes.length; i++) {
      await new Promise((r) => setTimeout(r, 320 + Math.random() * 260));
      nueva[i] = resultados[i].tipo;
      onChange([...nueva]);
      setDeteccion((prev) => ({ ...prev, paso: i + 1, resultados: resultados.slice(0, i + 1) }));
    }
    setTimeout(() => setDeteccion(ESTADO_INICIAL), 1400);
    const confianzaProm = resultados.reduce((a, r) => a + r.confianza, 0) / Math.max(1, resultados.length);
    exito("Detección completa", `${imagenes.length} ambientes clasificados · ${(confianzaProm * 100).toFixed(0)}% confianza media`);
  };

  if (imagenes.length === 0) return null;

  const etiquetadas = arreglo.filter((t) => t !== "sin_etiqueta").length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--m2-line)] pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">Etiquetado de ambientes</p>
          <p className="text-[11px] text-[var(--m2-muted)]">
            {etiquetadas}/{imagenes.length} etiquetadas · elegí manual o dejá que la IA detecte
          </p>
        </div>
        <div className="flex items-center gap-2">
          {etiquetadas > 0 && (
            <button
              type="button"
              onClick={limpiar}
              disabled={deteccion.procesando}
              className="text-[11px] font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors disabled:opacity-40"
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={detectarConIA}
            disabled={deteccion.procesando}
            className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] text-[var(--m2-bg)] text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-sm hover:bg-[var(--m2-muted)] transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            <IconSparkles size={12} />
            {deteccion.procesando ? `Analizando ${deteccion.paso}/${deteccion.total}…` : "Detectar con IA"}
          </button>
        </div>
      </div>

      {deteccion.procesando && (
        <div className="h-1 w-full bg-[var(--m2-line)] rounded-sm overflow-hidden">
          <div
            className="h-full bg-[var(--m2-ink)] transition-all duration-300"
            style={{ width: `${(deteccion.paso / Math.max(1, deteccion.total)) * 100}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {imagenes.map((url, i) => {
          const tipo = arreglo[i];
          const analizando = deteccion.procesando && i >= deteccion.paso && i < deteccion.total;
          const yaHecha = deteccion.procesando && i < deteccion.paso;
          return (
            <div key={`${url}-${i}`} className="relative">
              <div className="relative w-full aspect-square overflow-hidden rounded-sm border border-[var(--m2-line)]">
                <img src={url} alt="" className={`w-full h-full object-cover transition-all ${analizando ? "opacity-40 blur-[1px]" : ""}`} />
                {analizando && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="animate-pulse text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                      <IconSparkles size={12} />
                      IA
                    </div>
                  </div>
                )}
                {yaHecha && tipo !== "sin_etiqueta" && (
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm animate-fade-in">
                    ✓
                  </span>
                )}
                {tipo !== "sin_etiqueta" && !analizando && (
                  <span className="absolute bottom-1 left-1 bg-[var(--m2-ink)]/90 text-[var(--m2-bg)] text-[10px] font-semibold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                    <span>{EMOJIS_AMBIENTE[tipo]}</span>
                    <span>{ETIQUETAS_AMBIENTE[tipo]}</span>
                  </span>
                )}
              </div>
              <select
                value={tipo}
                onChange={(e) => cambiarUna(i, e.target.value as TipoAmbiente)}
                disabled={deteccion.procesando}
                className="mt-1.5 w-full text-[11px] bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm px-1.5 py-1 text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-ink)] disabled:opacity-50"
              >
                <option value="sin_etiqueta">Sin etiquetar</option>
                {AMBIENTES_ORDENADOS.map((t) => (
                  <option key={t} value={t}>
                    {ETIQUETAS_AMBIENTE[t]}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
