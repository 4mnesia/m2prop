"use client";

import { IconPrint } from "./Icon";

export default function ExportPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center justify-center gap-2 w-full border border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)] font-semibold text-xs py-3 rounded-sm transition-colors duration-300 tracking-wider"
    >
      <IconPrint size={14} />
      Exportar a PDF
    </button>
  );
}
