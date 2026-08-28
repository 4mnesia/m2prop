"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { useAuth } from "./AuthProvider";
import { IconDoc, IconGlobe, IconLayout, IconPlus, IconSparkles, IconUser } from "./Icon";
import { LogoMark } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

type BotonDef = {
  href: string;
  label: string;
  short: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  matcher?: (path: string) => boolean;
};

const BOTONES: BotonDef[] = [
  { href: "/", label: "Inicio", short: "Inicio", Icon: IconSparkles, matcher: (p) => p === "/" },
  { href: "/panel", label: "Panel", short: "Panel", Icon: IconLayout, matcher: (p) => p === "/panel" },
  { href: "/a", label: "Micrositio", short: "Sitio", Icon: IconGlobe, matcher: (p) => p.startsWith("/a") },
  { href: "/panel/propiedad/nueva", label: "Nueva ficha", short: "Ficha", Icon: IconPlus, matcher: (p) => p.startsWith("/panel/propiedad") },
  { href: "/panel/perfil", label: "Perfil", short: "Perfil", Icon: IconUser, matcher: (p) => p === "/panel/perfil" },
];

export default function ControlBar() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { usuario } = useAuth();

  const slugMicrositio = usuario?.slug ?? "nicolas-marquez";

  const resolverHref = (href: string) => {
    if (href === "/a") return `/a/${slugMicrositio}`;
    return href;
  };

  return (
    <div className="bg-[var(--m2-ink)] text-[var(--m2-line)] sticky top-0 z-50 border-b border-[var(--m2-muted)]/20 animate-fade-down">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-14 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6">
        {/* Left · brand */}
        <Link
          href="/"
          aria-label="M2Prop · Ir al inicio"
          aria-current={pathname === "/" ? "page" : undefined}
          className="group flex items-center gap-2.5 shrink-0 text-[var(--m2-bg)] transition-opacity duration-300 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m2-bg)]/40 rounded-sm py-1 pr-2 -ml-1"
        >
          <span className="transition-transform duration-500 group-hover:scale-105">
            <LogoMark size={22} />
          </span>
          <span className="hidden md:flex flex-col items-start leading-none">
            <span className="font-serif font-bold tracking-[0.16em] text-[11px] uppercase">
              M2Prop
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-[var(--m2-line)]/50 mt-0.5">
              Fichas con tu marca
            </span>
          </span>
        </Link>

        {/* Center · pill nav */}
        <nav
          aria-label="Vistas del demo"
          className="justify-self-center flex items-center gap-0.5 sm:gap-1 bg-[var(--m2-bg)]/[0.06] border border-[var(--m2-line)]/10 rounded-full p-1 backdrop-blur-sm overflow-x-auto no-scrollbar max-w-full"
        >
          {BOTONES.map((b, i) => {
            const active = b.matcher ? b.matcher(pathname) : pathname === b.href;
            const href = resolverHref(b.href);
            const requiereAuth = b.href.startsWith("/panel");
            const onClick = (e: React.MouseEvent) => {
              if (requiereAuth && !usuario) {
                e.preventDefault();
                router.push(`/login?next=${encodeURIComponent(b.href)}`);
              }
            };
            return (
              <Link
                key={b.href}
                href={href}
                onClick={onClick}
                aria-current={active ? "page" : undefined}
                aria-label={b.label}
                className={`group relative flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                  active
                    ? "bg-[var(--m2-bg)] text-[var(--m2-ink)] shadow-[0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-[var(--m2-line)]/70 hover:text-[var(--m2-bg)]"
                }`}
              >
                <span
                  className={`shrink-0 transition-transform duration-500 ${
                    active ? "scale-100" : "scale-95 group-hover:scale-100"
                  }`}
                >
                  <b.Icon size={14} />
                </span>
                <span className="hidden sm:inline">{b.label}</span>
                <span
                  className={`sm:hidden text-[10px] tabular-nums transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-50"
                  }`}
                >
                  0{i + 1}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right · auth + theme */}
        <div className="shrink-0 justify-self-end flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <span className="hidden lg:block h-6 w-px bg-[var(--m2-line)]/15" aria-hidden />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

export function ControlBarLoggedOutHint() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <p className="text-xs text-[var(--m2-muted)]">
        Estás viendo el catálogo público. <Link href="/login" className="underline underline-offset-2 text-[var(--m2-ink)]">Ingresá</Link> para gestionar fichas.
      </p>
    </div>
  );
}

export function BotonDoc({ propId, slug }: { propId: string; slug: string }) {
  return (
    <Link
      href={`/a/${slug}/${propId}`}
      className="inline-flex items-center gap-1.5 text-xs font-semibold"
    >
      <IconDoc size={12} />
      Ver ficha
    </Link>
  );
}
