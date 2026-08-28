"use client";

import { useEffect, useRef } from "react";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  titulo?: string;
  descripcion?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
};

const SIZES: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-6xl",
};

export default function Modal({ abierto, onCerrar, titulo, descripcion, size = "md", children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    rootRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titulo ? "m2-modal-title" : undefined}
      aria-describedby={descripcion ? "m2-modal-desc" : undefined}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
    >
      <button
        type="button"
        aria-label="Cerrar diálogo"
        onClick={onCerrar}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />
      <div
        ref={rootRef}
        tabIndex={-1}
        className={`relative w-full ${SIZES[size]} bg-[var(--m2-surface)] text-[var(--m2-ink)] border border-[var(--m2-line)] rounded-t-lg sm:rounded-sm shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col`}
      >
        {(titulo || descripcion) && (
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[var(--m2-line)] flex items-start justify-between gap-3">
            <div className="min-w-0">
              {titulo && (
                <h2 id="m2-modal-title" className="font-serif font-bold text-base sm:text-lg text-[var(--m2-ink)]">
                  {titulo}
                </h2>
              )}
              {descripcion && (
                <p id="m2-modal-desc" className="text-xs sm:text-sm text-[var(--m2-muted)] mt-1">
                  {descripcion}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="shrink-0 text-[var(--m2-muted)] hover:text-[var(--m2-ink)] text-2xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
