"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ETIQUETAS_ROL } from "../_lib/auth";
import { useAuth } from "./AuthProvider";
import { IconArrowRight, IconChevronDown, IconGlobe, IconLogout, IconUser } from "./Icon";

export default function UserMenu() {
  const { usuario, cerrarSesion, cargando } = useAuth();
  const [abierto, setAbierto] = useState(false);
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

  if (cargando) {
    return <div className="w-32 h-7 rounded-full bg-[var(--m2-bg)]/[0.06]" aria-hidden />;
  }

  if (!usuario) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-[var(--m2-line)]/80 hover:text-[var(--m2-bg)] transition-colors duration-300"
        >
          <IconUser size={13} />
          <span className="hidden sm:inline">Iniciar sesión</span>
          <span className="sm:hidden">Ingresar</span>
        </Link>
        <Link
          href="/#precios"
          className="group inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold bg-[var(--m2-bg)] text-[var(--m2-ink)] hover:bg-[var(--m2-line)] transition-colors duration-300 whitespace-nowrap"
        >
          <span>Registrate</span>
          <span className="hidden sm:inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            <IconArrowRight size={12} />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className="group inline-flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 bg-[var(--m2-bg)]/[0.06] hover:bg-[var(--m2-bg)]/[0.12] border border-[var(--m2-line)]/10 transition-colors duration-300"
      >
        <span className="w-6 h-6 rounded-full bg-[var(--m2-bg)] text-[var(--m2-ink)] flex items-center justify-center text-[10px] font-serif font-bold">
          {usuario.avatarIniciales}
        </span>
        <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-[var(--m2-line)]/80 group-hover:text-[var(--m2-bg)]">
          {usuario.nombre.split(" ")[0]}
          <IconChevronDown size={12} />
        </span>
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 bg-[var(--m2-surface)] text-[var(--m2-ink)] border border-[var(--m2-line)] rounded-sm shadow-lg overflow-hidden animate-fade-down"
        >
          <div className="px-4 py-3 border-b border-[var(--m2-line)]">
            <p className="font-serif font-bold text-sm text-[var(--m2-ink)] truncate">{usuario.nombre}</p>
            <p className="text-[11px] text-[var(--m2-muted)] truncate">{usuario.email}</p>
            <span className="inline-block mt-2 text-[9px] uppercase tracking-[0.22em] font-semibold px-2 py-0.5 rounded-sm bg-[var(--m2-ink)] text-[var(--m2-bg)]">
              {ETIQUETAS_ROL[usuario.rol]}
            </span>
          </div>
          <Link
            href="/panel"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors duration-200 flex items-center gap-2"
          >
            <IconUser size={14} />
            Mi panel
          </Link>
          <Link
            href={`/a/${usuario.slug}`}
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors duration-200 flex items-center gap-2"
          >
            <IconGlobe size={14} />
            Mi micrositio
          </Link>
          <Link
            href="/panel/perfil"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors duration-200 flex items-center gap-2"
          >
            <IconUser size={14} />
            Editar perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setAbierto(false);
              cerrarSesion();
            }}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--m2-bg)] transition-colors duration-200 flex items-center gap-2 border-t border-[var(--m2-line)] text-[var(--m2-muted)] hover:text-[var(--m2-ink)]"
          >
            <IconLogout size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
