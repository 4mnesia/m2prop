"use client";

import { useMemo, useState } from "react";
import { IconCopy, IconGlobe, IconQr } from "./Icon";
import { useToast } from "./ToastProvider";

type Props = {
  slug: string;
  variant?: "card" | "compact";
};

export default function ShareMicrositio({ slug, variant = "card" }: Props) {
  const [mostrarQR, setMostrarQR] = useState(false);
  const { exito } = useToast();

  const url = useMemo(() => {
    if (typeof window === "undefined") return `/a/${slug}`;
    return `${window.location.origin}/a/${slug}`;
  }, [slug]);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(url)}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      exito("Link copiado", url);
    } catch {}
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={copiar}
          className="inline-flex items-center gap-1.5 border border-[var(--m2-line)] hover:border-[var(--m2-muted)] text-[var(--m2-ink)] text-xs font-semibold px-3 py-2 rounded-sm transition-colors"
        >
          <IconCopy size={12} />
          Copiar link
        </button>
        <button
          type="button"
          onClick={() => setMostrarQR((v) => !v)}
          aria-pressed={mostrarQR}
          className="inline-flex items-center gap-1.5 border border-[var(--m2-line)] hover:border-[var(--m2-muted)] text-[var(--m2-ink)] text-xs font-semibold px-3 py-2 rounded-sm transition-colors"
        >
          <IconQr size={12} />
          {mostrarQR ? "Ocultar QR" : "Ver QR"}
        </button>
        {mostrarQR && (
          <div className="w-full mt-2 flex flex-col items-start gap-2">
            <img src={qrSrc} alt="Código QR del micrositio" className="w-40 h-40 rounded-sm border border-[var(--m2-line)] bg-white" />
            <a href={qrSrc} download={`m2prop-${slug}.png`} className="text-[11px] text-[var(--m2-muted)] hover:text-[var(--m2-ink)] underline underline-offset-2">
              Descargar QR
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="inline-flex items-center gap-2">
          <span className="text-[var(--m2-muted)]">
            <IconGlobe size={14} />
          </span>
          <h3 className="font-serif font-bold text-sm text-[var(--m2-ink)]">Tu link público</h3>
        </div>
        <button
          type="button"
          onClick={() => setMostrarQR((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors"
        >
          <IconQr size={12} />
          {mostrarQR ? "Ocultar QR" : "Ver QR"}
        </button>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm px-3 py-2 text-xs text-[var(--m2-ink)] font-mono focus:outline-none focus:border-[var(--m2-ink)]"
        />
        <button
          type="button"
          onClick={copiar}
          className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 rounded-sm transition-colors"
        >
          <IconCopy size={12} />
          Copiar
        </button>
      </div>
      {mostrarQR && (
        <div className="flex flex-col items-center gap-2 pt-3 border-t border-[var(--m2-line)]">
          <img src={qrSrc} alt="Código QR del micrositio" className="w-44 h-44 rounded-sm border border-[var(--m2-line)] bg-white" />
          <a href={qrSrc} download={`m2prop-${slug}.png`} className="text-[11px] text-[var(--m2-muted)] hover:text-[var(--m2-ink)] underline underline-offset-2">
            Descargar QR (PNG)
          </a>
        </div>
      )}
    </div>
  );
}
