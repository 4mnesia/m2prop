"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ETIQUETAS_ROL } from "../_lib/auth";
import { useAuth } from "./AuthProvider";
import { IconArrowRight, IconLayout, IconUser } from "./Icon";
import { Logo } from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function LandingHeader() {
  const { usuario, cargando } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--m2-bg)]/90 backdrop-blur-md border-b border-[var(--m2-line)]/70"
          : "bg-transparent border-b border-transparent"
      } animate-fade-down`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          scroll
          className="group text-[var(--m2-ink)] transition-opacity duration-300 hover:opacity-80"
          aria-label="M2Prop · Inicio"
        >
          <Logo size={32} tagline="Fichas con tu marca" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Acceso">
          <ThemeToggle variant="landing" />
          {cargando ? (
            <div className="w-32 h-9 rounded-sm bg-[var(--m2-line)]/40 animate-pulse" aria-hidden />
          ) : usuario ? (
            <>
              <div className="hidden md:flex items-center gap-2 pr-3 border-r border-[var(--m2-line)] mr-1">
                <span className="w-8 h-8 rounded-full bg-[var(--m2-ink)] text-[var(--m2-bg)] flex items-center justify-center text-[10px] font-serif font-bold">
                  {usuario.avatarIniciales}
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-serif font-bold text-[var(--m2-ink)] max-w-[140px] truncate">
                    {usuario.nombre}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--m2-muted)]">
                    {ETIQUETAS_ROL[usuario.rol]}
                  </p>
                </div>
              </div>
              <Link
                href="/panel"
                className="group inline-flex items-center gap-2 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-sm transition-colors duration-300 tracking-wide"
              >
                <IconLayout size={14} />
                <span>Ir al panel</span>
                <span className="hidden sm:inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                  <IconArrowRight size={14} />
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--m2-ink)] hover:text-[var(--m2-muted)] transition-colors duration-300 px-3 py-2 rounded-sm"
              >
                <IconUser size={14} />
                <span>Iniciar sesión</span>
              </Link>
              <Link
                href="/#precios"
                scroll
                className="group inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-sm transition-colors duration-300 tracking-wide"
              >
                <span>Registrate</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                  <IconArrowRight size={14} />
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
