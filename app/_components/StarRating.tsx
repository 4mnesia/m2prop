"use client";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  className?: string;
  ariaLabel?: string;
};

export default function StarRating({ value, onChange, size = 16, className, ariaLabel }: Props) {
  const interactivo = typeof onChange === "function";
  return (
    <span
      role={interactivo ? "radiogroup" : "img"}
      aria-label={ariaLabel ?? `${value.toFixed(1)} de 5 estrellas`}
      className={`inline-flex items-center gap-0.5 ${className ?? ""}`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const activa = value >= n - 0.25;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactivo}
            onClick={() => onChange?.(n)}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
            className={`text-[var(--m2-muted)]/50 transition-colors ${
              activa ? "text-amber-500" : ""
            } ${interactivo ? "hover:text-amber-500 cursor-pointer" : "cursor-default"}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={activa ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m12 3 2.9 6 6.6 1-4.8 4.7L18 21l-6-3.2L6 21l1.3-6.3L2.5 10l6.6-1z" />
            </svg>
          </button>
        );
      })}
    </span>
  );
}
