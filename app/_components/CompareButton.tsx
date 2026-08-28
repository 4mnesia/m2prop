"use client";

import { useComparator } from "./ComparatorProvider";
import { IconLayers } from "./Icon";
import { useToast } from "./ToastProvider";

export default function CompareButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { esta, alternar } = useComparator();
  const { info } = useToast();
  const activo = esta(id);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const r = alternar(id);
    if (!r.ok) info("No se pudo agregar", r.motivo ?? "");
    else info(activo ? "Quitada del comparador" : "Añadida al comparador");
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handle}
        aria-pressed={activo}
        aria-label={activo ? "Quitar del comparador" : "Añadir al comparador"}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-sm backdrop-blur-sm transition-colors ${
          activo
            ? "bg-[var(--m2-ink)] text-[var(--m2-bg)]"
            : "bg-white/85 dark:bg-black/60 text-[var(--m2-ink)] hover:bg-white"
        }`}
      >
        <IconLayers size={14} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={activo}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-2 rounded-sm border transition-colors ${
        activo
          ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]"
          : "bg-transparent text-[var(--m2-muted)] border-[var(--m2-line)] hover:text-[var(--m2-ink)] hover:border-[var(--m2-muted)]"
      }`}
    >
      <IconLayers size={12} />
      {activo ? "En comparador" : "Comparar"}
    </button>
  );
}
