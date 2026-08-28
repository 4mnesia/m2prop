"use client";

import { useCallback, useEffect, useState } from "react";
import { EMOJIS_AMBIENTE, ETIQUETAS_AMBIENTE } from "../_lib/roomDetector";
import type { Propiedad, Usuario } from "../_lib/types";
import { IconArrowLeft, IconArrowRight, IconExpand, IconPin } from "./Icon";

type Props = {
  propiedad: Propiedad;
  agente: Usuario;
};

export default function PresentMode({ propiedad, agente }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const total = propiedad.imagenes.length;

  const cerrar = useCallback(() => setAbierto(false), []);
  const siguiente = useCallback(() => setI((n) => (n + 1) % Math.max(1, total)), [total]);
  const anterior = useCallback(() => setI((n) => (n - 1 + Math.max(1, total)) % Math.max(1, total)), [total]);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); siguiente(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); anterior(); }
      else if (e.key.toLowerCase() === "p") setAuto((a) => !a);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto, cerrar, siguiente, anterior]);

  useEffect(() => {
    if (!abierto || !auto || total <= 1) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % total), 4200);
    return () => window.clearInterval(id);
  }, [abierto, auto, total]);

  useEffect(() => {
    if (!abierto) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [abierto]);

  if (total === 0) return null;

  const tipo = propiedad.ambientesImagenes?.[i];
  const img = propiedad.imagenes[i];

  return (
    <>
      <button
        type="button"
        onClick={() => { setI(0); setAbierto(true); }}
        className="no-print inline-flex items-center justify-center gap-2 w-full border border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)] font-semibold text-xs py-3 rounded-sm transition-colors duration-300 tracking-wider"
      >
        <IconExpand size={14} />
        Modo presentar
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[100] bg-black animate-fade-in">
          {propiedad.imagenes.map((src, idx) => (
            <img
              key={src + idx}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                idx === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-x-0 top-0 p-5 sm:p-8 flex items-start justify-between text-white bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
            <div className="pointer-events-auto max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-semibold">
                {propiedad.operacion} · {propiedad.tipo} · Ref {propiedad.id}
              </p>
              <h2 className="font-serif font-bold text-2xl sm:text-4xl mt-1 leading-tight">{propiedad.titulo}</h2>
              <p className="inline-flex items-center gap-1.5 text-sm text-white/70 mt-1">
                <IconPin size={13} /> {propiedad.ubicacion}
              </p>
            </div>
            <div className="pointer-events-auto text-right">
              <p className="font-serif font-bold text-xl sm:text-3xl">{propiedad.precio}</p>
              <p className="text-[11px] uppercase tracking-widest text-white/60 mt-1">{agente.nombre}</p>
            </div>
          </div>

          {tipo && tipo !== "sin_etiqueta" && (
            <div className="absolute top-24 sm:top-28 left-5 sm:left-8 bg-white/95 text-black text-xs font-semibold px-3 py-1.5 rounded-sm flex items-center gap-1.5 tracking-wider animate-fade-up">
              <span>{EMOJIS_AMBIENTE[tipo]}</span>
              <span className="uppercase">{ETIQUETAS_AMBIENTE[tipo]}</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex items-center justify-between text-white bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                type="button"
                onClick={anterior}
                aria-label="Anterior"
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-colors"
              >
                <IconArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={siguiente}
                aria-label="Siguiente"
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-colors"
              >
                <IconArrowRight size={18} />
              </button>
              <span className="tabular-nums text-sm text-white/80 ml-1">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            </div>
            <div className="pointer-events-auto flex items-center gap-4 text-[11px] uppercase tracking-widest">
              <button
                type="button"
                onClick={() => setAuto((a) => !a)}
                className="text-white/80 hover:text-white transition-colors font-semibold"
              >
                {auto ? "❚❚ Pausar" : "▶ Auto"}
              </button>
              <button
                type="button"
                onClick={cerrar}
                className="text-white/80 hover:text-white transition-colors font-semibold"
              >
                Cerrar (esc)
              </button>
            </div>
          </div>

          <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-auto">
            {propiedad.imagenes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Ir a foto ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-1 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
