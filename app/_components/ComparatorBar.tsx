"use client";

import { useMemo, useState } from "react";
import type { Propiedad } from "../_lib/types";
import { useComparator } from "./ComparatorProvider";
import { IconClose, IconLayers } from "./Icon";
import Modal from "./Modal";
import { useProperties } from "./PropertyProvider";

export default function ComparatorBar() {
  const { ids, quitar, limpiar } = useComparator();
  const { propiedades } = useProperties();
  const [abierto, setAbierto] = useState(false);

  const seleccion = useMemo<Propiedad[]>(
    () => ids.map((id) => propiedades.find((p) => p.id === id)).filter(Boolean) as Propiedad[],
    [ids, propiedades],
  );

  if (seleccion.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-fade-up">
        <div className="flex items-center gap-2 bg-[var(--m2-ink)] text-[var(--m2-bg)] rounded-sm shadow-lg pl-4 pr-2 py-2 border border-[var(--m2-ink)]">
          <IconLayers size={14} />
          <span className="text-xs font-semibold">
            Comparador · {seleccion.length}
          </span>
          <div className="hidden sm:flex items-center gap-1 ml-2 max-w-[280px] overflow-hidden">
            {seleccion.map((p) => (
              <span
                key={p.id}
                className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-sm truncate max-w-[80px]"
                title={p.titulo}
              >
                {p.id}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAbierto(true)}
            disabled={seleccion.length < 2}
            className="ml-2 bg-[var(--m2-bg)] text-[var(--m2-ink)] hover:bg-[var(--m2-line)] text-[11px] font-semibold px-3 py-1.5 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Comparar
          </button>
          <button
            type="button"
            onClick={limpiar}
            aria-label="Vaciar"
            className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-[var(--m2-bg)]/80 hover:text-white hover:bg-white/10"
          >
            <IconClose size={12} />
          </button>
        </div>
      </div>

      <Modal
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo={`Comparación · ${seleccion.length} propiedades`}
        size="xl"
      >
        <TablaComparacion propiedades={seleccion} onQuitar={quitar} />
      </Modal>
    </>
  );
}

function TablaComparacion({
  propiedades,
  onQuitar,
}: {
  propiedades: Propiedad[];
  onQuitar: (id: string) => void;
}) {
  const filas: { label: string; get: (p: Propiedad) => React.ReactNode }[] = [
    { label: "Precio", get: (p) => p.precio },
    { label: "Operación", get: (p) => p.operacion },
    { label: "Tipo", get: (p) => p.tipo },
    { label: "Ubicación", get: (p) => p.ubicacion },
    { label: "m² totales", get: (p) => p.m2Totales },
    { label: "m² cubiertos", get: (p) => p.m2Cubiertos },
    { label: "Ambientes", get: (p) => p.ambientes },
    { label: "Dormitorios", get: (p) => p.dormitorios },
    { label: "Baños", get: (p) => p.banos },
    { label: "Cocheras", get: (p) => p.cocheras },
    { label: "Antigüedad", get: (p) => p.antiguedad },
    { label: "Visitas", get: (p) => p.visitas },
    { label: "Estado", get: (p) => p.estado },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="text-left text-[10px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold py-2 pr-3 border-b border-[var(--m2-line)] align-bottom">
              Atributo
            </th>
            {propiedades.map((p) => (
              <th key={p.id} className="text-left border-b border-[var(--m2-line)] p-2 min-w-[180px] align-bottom">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold">
                    {p.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuitar(p.id)}
                    aria-label="Quitar"
                    className="text-[var(--m2-muted)] hover:text-red-700"
                  >
                    <IconClose size={12} />
                  </button>
                </div>
                {p.imagenes[0] && (
                  <img src={p.imagenes[0]} alt={p.titulo} className="w-full aspect-[16/10] object-cover rounded-sm mb-2" />
                )}
                <p className="text-[13px] font-serif font-bold text-[var(--m2-ink)] leading-tight">
                  {p.titulo}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.label} className="border-b border-[var(--m2-line)]">
              <td className="text-[11px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold py-2 pr-3 whitespace-nowrap">
                {f.label}
              </td>
              {propiedades.map((p) => (
                <td key={p.id} className="text-sm text-[var(--m2-ink)] py-2 px-2">
                  {f.get(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
