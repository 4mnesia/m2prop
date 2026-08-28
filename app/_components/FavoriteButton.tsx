"use client";

import { useFavorites } from "./FavoritesProvider";
import { IconHeart } from "./Icon";
import { useToast } from "./ToastProvider";

type Props = {
  id: string;
  label?: boolean;
  size?: number;
  className?: string;
};

export default function FavoriteButton({ id, label, size = 14, className }: Props) {
  const { esFavorito, alternar } = useFavorites();
  const { info } = useToast();
  const activo = esFavorito(id);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alternar(id);
    info(activo ? "Quitado de favoritos" : "Guardado en favoritos", id);
  };

  if (label) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={activo}
        className={`inline-flex items-center justify-center gap-2 w-full border rounded-sm py-3 text-xs font-semibold tracking-wider transition-colors ${
          activo
            ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            : "border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)]"
        } ${className ?? ""}`}
      >
        <IconHeart size={size} filled={activo} />
        {activo ? "GUARDADO EN FAVORITOS" : "AGREGAR A FAVORITOS"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm transition-colors ${
        activo
          ? "bg-red-600 text-white"
          : "bg-black/40 text-white hover:bg-black/60"
      } ${className ?? ""}`}
    >
      <IconHeart size={size} filled={activo} />
    </button>
  );
}
