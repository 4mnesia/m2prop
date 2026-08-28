"use client";

import { useState } from "react";
import { IconArrowLeft, IconArrowRight } from "./Icon";

type Caso = {
  id: string;
  titulo: string;
  descripcion: string;
  antes: string;
  despues: string;
  metricas: { label: string; valor: string }[];
};

const CASOS: Caso[] = [
  {
    id: "c1",
    titulo: "PH en Nueva Córdoba",
    descripcion: "Rebranding de ficha vieja de portal a micrositio profesional. Se cerró a los 12 días.",
    antes: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    despues: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    metricas: [
      { label: "Días publicada", valor: "12" },
      { label: "Consultas WSP", valor: "38" },
      { label: "Sobre precio", valor: "+4%" },
    ],
  },
  {
    id: "c2",
    titulo: "Casa Villa Belgrano",
    descripcion: "Ficha con video, tour 360 y CRM. La agente cerró venta a un cliente de fuera de la provincia.",
    antes: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80",
    despues: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    metricas: [
      { label: "Visitas", valor: "1.240" },
      { label: "Ofertas", valor: "6" },
      { label: "Cierre", valor: "18 días" },
    ],
  },
  {
    id: "c3",
    titulo: "Loft Alberdi",
    descripcion: "Alquiler premium con historial de precios visible. Bajó rebotes y aumentó tiempo en ficha.",
    antes: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    despues: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    metricas: [
      { label: "Tiempo en ficha", valor: "3:12" },
      { label: "Rebote", valor: "-46%" },
      { label: "Alquilado", valor: "8 días" },
    ],
  },
];

export default function CasosExito() {
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(50);
  const caso = CASOS[idx];

  const cambiar = (delta: number) => {
    setIdx((i) => (i + delta + CASOS.length) % CASOS.length);
    setPos(50);
  };

  return (
    <section className="bg-[var(--m2-bg)] py-16 sm:py-24 border-t border-[var(--m2-line)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">
            Casos de éxito
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-ink)] mt-3 mb-4">
            Antes y después
          </h2>
          <p className="text-[var(--m2-muted)] text-sm sm:text-base max-w-xl mx-auto">
            Deslizá para ver cómo cambia una ficha con M2Prop.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 sm:gap-10 items-center">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-[var(--m2-line)] bg-[var(--m2-surface)] select-none">
            <img src={caso.despues} alt="Después" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${pos}%` }}
            >
              <img
                src={caso.antes}
                alt="Antes"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }}
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-black/60 text-white px-2 py-1 rounded-sm">
                Antes
              </span>
            </div>
            <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-white/85 text-[var(--m2-ink)] px-2 py-1 rounded-sm">
              Después
            </span>
            <div
              className="absolute inset-y-0 w-0.5 bg-white pointer-events-none shadow"
              style={{ left: `${pos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-[var(--m2-ink)] flex items-center justify-center text-[var(--m2-ink)]">
                <span className="text-xs">↔</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Comparador antes / después"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold text-[var(--m2-ink)]">{caso.titulo}</h3>
            <p className="text-sm text-[var(--m2-muted)] mt-2 mb-6 leading-relaxed">{caso.descripcion}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {caso.metricas.map((m) => (
                <div key={m.label} className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-3 text-center">
                  <p className="text-[9px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold">{m.label}</p>
                  <p className="font-serif font-bold text-lg text-[var(--m2-ink)] mt-1 tabular-nums">{m.valor}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => cambiar(-1)}
                aria-label="Anterior"
                className="w-10 h-10 rounded-sm border border-[var(--m2-line)] hover:border-[var(--m2-muted)] flex items-center justify-center text-[var(--m2-ink)]"
              >
                <IconArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => cambiar(1)}
                aria-label="Siguiente"
                className="w-10 h-10 rounded-sm border border-[var(--m2-line)] hover:border-[var(--m2-muted)] flex items-center justify-center text-[var(--m2-ink)]"
              >
                <IconArrowRight size={14} />
              </button>
              <span className="text-[11px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold">
                {idx + 1} / {CASOS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
