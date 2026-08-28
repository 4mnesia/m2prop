"use client";

import { useMemo } from "react";

type Props = {
  seed: string;
  totalVisitas: number;
  dias?: number;
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pseudoRandom(seed: number) {
  let x = seed || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 1000) / 1000;
  };
}

export default function VisitasChart({ seed, totalVisitas, dias = 14 }: Props) {
  const serie = useMemo(() => {
    const rnd = pseudoRandom(hash(seed));
    const raw = Array.from({ length: dias }, () => 0.3 + rnd() * 1);
    const suma = raw.reduce((a, b) => a + b, 0);
    return raw.map((v) => Math.max(0, Math.round((v / suma) * totalVisitas)));
  }, [seed, totalVisitas, dias]);

  const max = Math.max(1, ...serie);
  const totalReal = serie.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-end justify-between gap-1 h-24" aria-label="Visitas diarias últimos días">
        {serie.map((v, i) => {
          const alto = (v / max) * 100;
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - (dias - 1 - i));
          const label = `${v} visitas · ${fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}`;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div
                className="w-full bg-[var(--m2-ink)] rounded-sm transition-all duration-500 hover:bg-[var(--m2-muted)]"
                style={{ height: `${Math.max(6, alto)}%` }}
                title={label}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-[var(--m2-muted)] uppercase tracking-[0.18em] font-semibold">
        <span>Hace {dias} días</span>
        <span className="text-[var(--m2-ink)]">{totalReal} visitas totales</span>
        <span>Hoy</span>
      </div>
    </div>
  );
}
