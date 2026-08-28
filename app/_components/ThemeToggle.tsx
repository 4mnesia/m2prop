"use client";

import { IconMoon, IconSun } from "./Icon";
import { useTheme } from "./ThemeProvider";

type Props = {
  variant?: "control" | "landing";
};

export default function ThemeToggle({ variant = "control" }: Props) {
  const { tema, alternar } = useTheme();
  const oscuro = tema === "dark";

  const control =
    "bg-[var(--m2-bg)]/[0.06] hover:bg-[var(--m2-bg)]/[0.12] border border-[var(--m2-line)]/10 text-[var(--m2-line)]/80 hover:text-[var(--m2-bg)]";
  const landing =
    "bg-[var(--m2-surface)] hover:bg-[var(--m2-line-soft)] border border-[var(--m2-line)] text-[var(--m2-ink)]";

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={oscuro}
      title={oscuro ? "Modo claro" : "Modo oscuro"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
        variant === "control" ? control : landing
      }`}
    >
      <span className="transition-transform duration-500" style={{ transform: oscuro ? "rotate(0deg)" : "rotate(-30deg)" }}>
        {oscuro ? <IconSun size={14} /> : <IconMoon size={14} />}
      </span>
    </button>
  );
}
