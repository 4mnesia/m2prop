"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconCopy, IconMail, IconShare, IconWhatsApp } from "./Icon";
import { useToast } from "./ToastProvider";

type Props = {
  titulo: string;
  path: string;
  descripcion?: string;
  compact?: boolean;
};

export default function ShareButton({ titulo, path, descripcion, compact }: Props) {
  const { exito, error: errorToast } = useToast();
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setAbierto(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  const urlAbsoluta = () =>
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(urlAbsoluta());
      setCopiado(true);
      exito("Link copiado", urlAbsoluta());
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      errorToast("No se pudo copiar", "Copiá el link manualmente");
    }
  };

  const compartirNativo = async () => {
    if (typeof navigator === "undefined" || !("share" in navigator)) {
      setAbierto((v) => !v);
      return;
    }
    try {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
        title: titulo,
        text: descripcion,
        url: urlAbsoluta(),
      });
    } catch {
      /* usuario canceló */
    }
  };

  const mensajeWSP = encodeURIComponent(`${titulo}\n${urlAbsoluta()}`);
  const mailto = `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(`${descripcion ?? ""}\n\n${urlAbsoluta()}`)}`;

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={compartirNativo}
        onContextMenu={(e) => {
          e.preventDefault();
          setAbierto((v) => !v);
        }}
        aria-label="Compartir"
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={`inline-flex items-center gap-1.5 font-semibold transition-colors duration-300 ${
          compact
            ? "text-xs text-[var(--m2-muted)] hover:text-[var(--m2-ink)]"
            : "bg-[var(--m2-surface)] border border-[var(--m2-line)] hover:border-[var(--m2-muted)] text-[var(--m2-ink)] text-xs px-4 py-2.5 rounded-sm"
        }`}
      >
        <IconShare size={compact ? 12 : 14} />
        <span>Compartir</span>
      </button>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label="Ver opciones de compartir"
        className="ml-1 text-[var(--m2-muted)] hover:text-[var(--m2-ink)] text-xs"
      >
        ▾
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 bg-[var(--m2-surface)] text-[var(--m2-ink)] border border-[var(--m2-line)] rounded-sm shadow-lg overflow-hidden animate-fade-down z-30"
        >
          <button
            type="button"
            role="menuitem"
            onClick={copiar}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors flex items-center gap-2"
          >
            {copiado ? <IconCheck size={14} /> : <IconCopy size={14} />}
            {copiado ? "¡Copiado!" : "Copiar link"}
          </button>
          <a
            href={`https://wa.me/?text=${mensajeWSP}`}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors flex items-center gap-2 border-t border-[var(--m2-line)]"
            onClick={() => setAbierto(false)}
          >
            <IconWhatsApp size={14} />
            Enviar por WhatsApp
          </a>
          <a
            href={mailto}
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors flex items-center gap-2 border-t border-[var(--m2-line)]"
            onClick={() => setAbierto(false)}
          >
            <IconMail size={14} />
            Enviar por email
          </a>
          <p className="text-[10px] text-[var(--m2-muted)] px-4 py-2 border-t border-[var(--m2-line)] break-all">
            {urlAbsoluta()}
          </p>
        </div>
      )}
    </div>
  );
}
