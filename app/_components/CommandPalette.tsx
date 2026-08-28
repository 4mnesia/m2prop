"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { IconArrowRight, IconCommand, IconGlobe, IconLayout, IconLogout, IconMoon, IconPlus, IconSparkles, IconSun, IconUser } from "./Icon";
import { useProperties } from "./PropertyProvider";
import { useTheme } from "./ThemeProvider";

type Comando = {
  id: string;
  titulo: string;
  hint?: string;
  Icon: React.ComponentType<{ size?: number }>;
  ejecutar: () => void;
  seccion: string;
};

export default function CommandPalette() {
  const [abierto, setAbierto] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuth();
  const { propiedades } = useProperties();
  const { tema, alternar: alternarTema } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAbierto((v) => !v);
      }
      if (e.key === "Escape" && abierto) setAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  useEffect(() => {
    if (abierto) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [abierto]);

  const cerrar = () => setAbierto(false);
  const ir = (path: string) => { router.push(path); cerrar(); };

  const comandos = useMemo<Comando[]>(() => {
    const slug = usuario?.slug ?? "nicolas-marquez";
    const misPropiedades = usuario
      ? propiedades.filter((p) => usuario.rol === "admin" || p.agenteId === usuario.id)
      : [];

    const base: Comando[] = [
      { id: "nav-home", titulo: "Ir a la landing", seccion: "Navegar", Icon: IconSparkles, ejecutar: () => ir("/") },
      { id: "nav-panel", titulo: "Ir al panel", seccion: "Navegar", Icon: IconLayout, ejecutar: () => ir("/panel") },
      { id: "nav-nueva", titulo: "Nueva ficha", hint: "Crear propiedad", seccion: "Acciones", Icon: IconPlus, ejecutar: () => ir("/panel/propiedad/nueva") },
      { id: "nav-perfil", titulo: "Editar mi perfil", seccion: "Acciones", Icon: IconUser, ejecutar: () => ir("/panel/perfil") },
      { id: "nav-mi-sitio", titulo: "Ver mi micrositio", hint: `/a/${slug}`, seccion: "Navegar", Icon: IconGlobe, ejecutar: () => ir(`/a/${slug}`) },
      { id: "tema", titulo: `Cambiar tema (${tema === "dark" ? "claro" : "oscuro"})`, seccion: "Preferencias", Icon: tema === "dark" ? IconSun : IconMoon, ejecutar: () => { alternarTema(); cerrar(); } },
    ];
    if (usuario) {
      base.push({
        id: "logout",
        titulo: "Cerrar sesión",
        seccion: "Cuenta",
        Icon: IconLogout,
        ejecutar: () => { cerrarSesion(); cerrar(); router.push("/"); },
      });
    }
    misPropiedades.slice(0, 12).forEach((p) => {
      base.push({
        id: `ficha-${p.id}`,
        titulo: p.titulo,
        hint: `${p.id} · ${p.ubicacion}`,
        seccion: "Mis fichas",
        Icon: IconArrowRight,
        ejecutar: () => ir(`/panel/propiedad/${p.id}`),
      });
    });
    return base;
  }, [alternarTema, cerrarSesion, propiedades, router, tema, usuario]);

  const filtrados = useMemo(() => {
    if (!q.trim()) return comandos;
    const query = q.toLowerCase();
    return comandos.filter((c) =>
      c.titulo.toLowerCase().includes(query) ||
      (c.hint ?? "").toLowerCase().includes(query) ||
      c.seccion.toLowerCase().includes(query),
    );
  }, [comandos, q]);

  useEffect(() => { setIdx(0); }, [q]);

  const secciones = useMemo(() => {
    const map = new Map<string, Comando[]>();
    filtrados.forEach((c) => {
      if (!map.has(c.seccion)) map.set(c.seccion, []);
      map.get(c.seccion)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtrados]);

  if (!abierto) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(filtrados.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtrados[idx]?.ejecutar();
    }
  };

  let running = -1;

  return (
    <div className="no-print fixed inset-0 z-[95] flex items-start justify-center pt-24 sm:pt-32 px-4 animate-fade-in">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={cerrar}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />
      <div className="relative w-full max-w-xl bg-[var(--m2-surface)] text-[var(--m2-ink)] border border-[var(--m2-line)] rounded-sm shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[70vh]">
        <div className="border-b border-[var(--m2-line)] flex items-center gap-2 px-4">
          <span className="text-[var(--m2-muted)]"><IconCommand size={14} /></span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscá una acción o ficha…"
            className="flex-1 bg-transparent border-0 outline-none py-3 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]"
          />
          <kbd className="text-[10px] font-semibold text-[var(--m2-muted)] border border-[var(--m2-line)] rounded-sm px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filtrados.length === 0 ? (
            <p className="text-sm text-[var(--m2-muted)] text-center py-8 italic">Sin resultados.</p>
          ) : (
            secciones.map(([seccion, items]) => (
              <div key={seccion} className="px-2">
                <p className="text-[9px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] px-2 pt-2 pb-1">{seccion}</p>
                <ul>
                  {items.map((c) => {
                    running++;
                    const activo = running === idx;
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setIdx(running)}
                          onClick={() => c.ejecutar()}
                          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors ${
                            activo ? "bg-[var(--m2-ink)] text-[var(--m2-bg)]" : "text-[var(--m2-ink)] hover:bg-[var(--m2-bg)]"
                          }`}
                        >
                          <span className={activo ? "text-[var(--m2-bg)]" : "text-[var(--m2-muted)]"}><c.Icon size={14} /></span>
                          <span className="flex-1 min-w-0">
                            <span className="block truncate">{c.titulo}</span>
                            {c.hint && <span className={`block text-[10px] truncate ${activo ? "text-[var(--m2-bg)]/70" : "text-[var(--m2-muted)]"}`}>{c.hint}</span>}
                          </span>
                          {activo && <span className="text-[10px] opacity-70">↵</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-[var(--m2-line)] px-3 py-2 flex items-center justify-between text-[10px] text-[var(--m2-muted)]">
          <span className="uppercase tracking-widest font-semibold">Command palette</span>
          <span>↑↓ navegar · ↵ ejecutar</span>
        </div>
      </div>
    </div>
  );
}
