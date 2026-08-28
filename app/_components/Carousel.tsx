"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EMOJIS_AMBIENTE, ETIQUETAS_AMBIENTE } from "../_lib/roomDetector";
import type { TipoAmbiente } from "../_lib/types";
import { IconArrowLeft, IconArrowRight } from "./Icon";

type Props = {
  imagenes: string[];
  alt: string;
  autoplay?: boolean;
  intervaloMs?: number;
  ambientes?: TipoAmbiente[];
};

export default function Carousel({ imagenes, alt, autoplay = true, intervaloMs = 5000, ambientes }: Props) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = imagenes.length;
  const touchStartX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const ir = useCallback(
    (i: number) => setIndice(((i % total) + total) % total),
    [total],
  );
  const anterior = useCallback(() => ir(indice - 1), [ir, indice]);
  const siguiente = useCallback(() => ir(indice + 1), [ir, indice]);

  // Autoplay (pausable on hover + reduced motion)
  useEffect(() => {
    if (!autoplay || pausado || total <= 1) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => setIndice((i) => (i + 1) % total), intervaloMs);
    return () => window.clearInterval(id);
  }, [autoplay, pausado, total, intervaloMs]);

  // Keyboard arrows (only when carousel is focused / hovered)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        anterior();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        siguiente();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [anterior, siguiente]);

  const filtroAmbientes = useMemo(() => {
    if (!ambientes) return [] as TipoAmbiente[];
    const set = new Set<TipoAmbiente>();
    ambientes.forEach((a) => {
      if (a && a !== "sin_etiqueta") set.add(a);
    });
    return Array.from(set);
  }, [ambientes]);

  const tipoActual = ambientes?.[indice];
  const primeraDe = (tipo: TipoAmbiente) => ambientes?.findIndex((a) => a === tipo) ?? -1;

  if (total === 0) return null;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {/* Main frame */}
      <div
        className="relative h-[280px] sm:h-[400px] md:h-[500px] w-full rounded-sm overflow-hidden bg-[var(--m2-line)] group"
        role="region"
        aria-roledescription="carrusel"
        aria-label={alt}
        tabIndex={0}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
          if (Math.abs(dx) > 40) (dx < 0 ? siguiente : anterior)();
          touchStartX.current = null;
        }}
      >
        {imagenes.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${alt} — foto ${i + 1} de ${total}`}
            aria-hidden={i !== indice}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
              i === indice ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {tipoActual && tipoActual !== "sin_etiqueta" && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[var(--m2-ink)]/85 text-[var(--m2-bg)] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-sm flex items-center gap-1.5 tracking-wider">
            <span>{EMOJIS_AMBIENTE[tipoActual]}</span>
            <span className="uppercase">{ETIQUETAS_AMBIENTE[tipoActual]}</span>
          </div>
        )}

        {/* aria-live announcer */}
        <span className="sr-only" aria-live="polite">
          Foto {indice + 1} de {total}
        </span>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--m2-bg)]/85 backdrop-blur text-[var(--m2-ink)] flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-[var(--m2-bg)]"
            >
              <IconArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={siguiente}
              aria-label="Foto siguiente"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--m2-bg)]/85 backdrop-blur text-[var(--m2-ink)] flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-[var(--m2-bg)]"
            >
              <IconArrowRight size={16} />
            </button>

            {/* Counter */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[var(--m2-ink)]/70 text-[var(--m2-bg)] text-[10px] font-semibold px-2.5 py-1 rounded-sm tabular-nums tracking-wider">
              {String(indice + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {imagenes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => ir(i)}
                  aria-label={`Ir a foto ${i + 1}`}
                  aria-current={i === indice}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === indice
                      ? "w-6 bg-[var(--m2-bg)]"
                      : "w-1.5 bg-[var(--m2-bg)]/50 hover:bg-[var(--m2-bg)]/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {filtroAmbientes.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {filtroAmbientes.map((t) => {
            const objetivo = primeraDe(t);
            const activo = ambientes?.[indice] === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => objetivo >= 0 && ir(objetivo)}
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-sm border transition-colors ${
                  activo
                    ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]"
                    : "bg-[var(--m2-surface)] text-[var(--m2-ink)] border-[var(--m2-line)] hover:border-[var(--m2-ink)]"
                }`}
              >
                <span>{EMOJIS_AMBIENTE[t]}</span>
                <span>{ETIQUETAS_AMBIENTE[t]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
          {imagenes.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === indice}
              className={`w-20 h-14 sm:w-24 sm:h-16 rounded-sm overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                i === indice
                  ? "border-[var(--m2-ink)] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
