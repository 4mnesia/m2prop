"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ETIQUETAS_ROL, guardarPerfil, limitePropiedades } from "../_lib/auth";
import type { Rol, Usuario } from "../_lib/types";
import { linkWhatsApp } from "../_lib/whatsapp";
import { useAuth } from "./AuthProvider";
import { IconArrowLeft, IconChart, IconGlobe, IconStar, IconWhatsApp } from "./Icon";
import { useProperties } from "./PropertyProvider";
import ShareMicrositio from "./ShareMicrositio";
import { useToast } from "./ToastProvider";

export default function ProfileEditor() {
  const { usuario } = useAuth();
  const { propiedades } = useProperties();
  const { exito } = useToast();
  const [form, setForm] = useState<Usuario | null>(usuario);

  const misPropiedades = useMemo(() => {
    if (!usuario) return [];
    if (usuario.rol === "admin") return propiedades;
    return propiedades.filter((p) => p.agenteId === usuario.id);
  }, [propiedades, usuario]);

  if (!usuario || !form) return null;

  const set = <K extends keyof Usuario>(k: K, v: Usuario[K]) =>
    setForm((prev) => (prev ? { ...prev, [k]: v } : prev));

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    guardarPerfil(form);
    exito("Perfil actualizado", "Los cambios ya son visibles en tu micrositio");
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--m2-bg)] px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 sm:gap-8">
        <div>
          <Link
            href="/panel"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors mb-4"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">
              <IconArrowLeft size={14} />
            </span>
            Volver al panel
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--m2-ink)] mb-1">
            Editar mi perfil
          </h1>
          <p className="text-sm text-[var(--m2-muted)] mb-6">
            Los cambios impactan directamente en tu micrositio público.
          </p>

          <form onSubmit={guardar} className="space-y-4">
            <Field label="Nombre completo">
              <input
                required
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Inmobiliaria">
                <input
                  value={form.inmobiliaria ?? ""}
                  onChange={(e) => set("inmobiliaria", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Slug del micrositio">
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Teléfono / WhatsApp">
                <input
                  value={form.telefono ?? ""}
                  onChange={(e) => set("telefono", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Instagram">
                <input
                  value={form.instagram ?? ""}
                  onChange={(e) => set("instagram", e.target.value)}
                  className={inputCls}
                  placeholder="@usuario"
                />
              </Field>
            </div>
            <Field label="Sitio web">
              <input
                value={form.sitioWeb ?? ""}
                onChange={(e) => set("sitioWeb", e.target.value)}
                className={inputCls}
                placeholder="miweb.com"
              />
            </Field>
            <Field label="Foto de perfil (URL)">
              <input
                type="url"
                value={form.fotoUrl ?? ""}
                onChange={(e) => set("fotoUrl", e.target.value)}
                className={inputCls}
                placeholder="https://…"
              />
            </Field>
            <Field label="Bio corta">
              <textarea
                rows={4}
                value={form.bio ?? ""}
                onChange={(e) => set("bio", e.target.value)}
                className={`${inputCls} resize-y`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Color primario">
                <input
                  type="color"
                  value={form.colorPrimario ?? "#2c2416"}
                  onChange={(e) => set("colorPrimario", e.target.value)}
                  className="w-full h-11 rounded-sm border border-[var(--m2-line)] bg-[var(--m2-surface)] cursor-pointer"
                />
              </Field>
              <Field label="Color acento">
                <input
                  type="color"
                  value={form.colorAcento ?? "#8b7355"}
                  onChange={(e) => set("colorAcento", e.target.value)}
                  className="w-full h-11 rounded-sm border border-[var(--m2-line)] bg-[var(--m2-surface)] cursor-pointer"
                />
              </Field>
            </div>

            <Field label="Plantilla del micrositio">
              <div className="grid grid-cols-3 gap-2">
                {(["elegante", "moderna", "minimal"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("plantilla", p)}
                    className={`px-3 py-3 rounded-sm border text-xs font-semibold uppercase tracking-widest transition-colors ${
                      (form.plantilla ?? "elegante") === p
                        ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]"
                        : "bg-[var(--m2-surface)] text-[var(--m2-muted)] border-[var(--m2-line)] hover:text-[var(--m2-ink)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[var(--m2-muted)] mt-2">
                <strong className="text-[var(--m2-ink)]">Elegante:</strong> hero con foto grande. <strong className="text-[var(--m2-ink)]">Moderna:</strong> hero limpio, cards sin bordes. <strong className="text-[var(--m2-ink)]">Minimal:</strong> tipografía protagonista, sin imagen hero.
              </p>
            </Field>

            <div className="flex items-center gap-3 pt-3">
              <Link
                href="/panel"
                className="text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] px-4 py-2.5 rounded-sm transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-6 py-2.5 rounded-sm transition-colors tracking-wider"
              >
                GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        </div>

        {/* Preview + Plan + Share */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[var(--m2-muted)] mb-2">
            Vista previa
          </p>
          <div
            className="rounded-sm overflow-hidden border border-[var(--m2-line)] p-6"
            style={{
              background: `linear-gradient(135deg, ${form.colorPrimario ?? "#2c2416"} 0%, ${form.colorAcento ?? "#8b7355"} 100%)`,
            }}
          >
            <div className="flex flex-col items-center text-center text-white">
              {form.fotoUrl ? (
                <img
                  src={form.fotoUrl}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-2xl font-serif font-bold mb-4">
                  {form.avatarIniciales}
                </div>
              )}
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold opacity-80">
                {ETIQUETAS_ROL[form.rol]}
              </p>
              <h3 className="text-xl font-serif font-bold mt-1">{form.nombre}</h3>
              {form.inmobiliaria && <p className="text-xs opacity-90 mt-1">{form.inmobiliaria}</p>}
              {form.bio && <p className="text-xs italic opacity-90 mt-3 leading-relaxed">“{form.bio}”</p>}
            </div>
          </div>
          <Link
            href={`/a/${form.slug}`}
            target="_blank"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors"
          >
            <IconGlobe size={12} />
            Abrir micrositio en pestaña nueva
          </Link>

          <ShareMicrositio slug={form.slug} />

          <PlanCard rol={usuario.rol} usadas={misPropiedades.length} />
        </aside>
      </div>
    </div>
  );
}

function PlanCard({ rol, usadas }: { rol: Rol; usadas: number }) {
  const limite = limitePropiedades(rol);
  const infinito = limite === Infinity;
  const porcentaje = infinito ? 0 : Math.min(100, (usadas / limite) * 100);
  const restantes = infinito ? Infinity : Math.max(0, limite - usadas);

  const beneficios: Record<Rol, string[]> = {
    admin: ["Propiedades ilimitadas", "Gestión de agentes", "Analytics completo"],
    agente_pro: ["50 fichas activas", "Analytics avanzado", "Soporte prioritario"],
    agente: ["15 fichas activas", "Micrositio con tu marca", "Botón WhatsApp directo"],
  };

  const proximoPlan: Record<Rol, string | null> = {
    admin: null,
    agente_pro: null,
    agente: "Agente Pro",
  };

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[var(--m2-muted)]">
          <IconChart size={14} />
        </span>
        <h3 className="font-serif font-bold text-sm text-[var(--m2-ink)]">Plan y facturación</h3>
      </div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">Plan actual</p>
      <p className="font-serif font-bold text-xl text-[var(--m2-ink)]">{ETIQUETAS_ROL[rol]}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-[var(--m2-muted)] mb-1">
          <span>Uso de fichas</span>
          <span className="tabular-nums text-[var(--m2-ink)] font-semibold">
            {usadas}
            {infinito ? "" : ` / ${limite}`}
          </span>
        </div>
        {!infinito && (
          <div className="w-full h-1.5 rounded-full bg-[var(--m2-line)] overflow-hidden">
            <div
              className="h-full bg-[var(--m2-ink)] transition-all duration-500"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        )}
        {!infinito && (
          <p className="text-[11px] text-[var(--m2-muted)] mt-1">
            Te quedan <span className="text-[var(--m2-ink)] font-semibold">{restantes}</span> disponibles
          </p>
        )}
      </div>

      <ul className="mt-4 space-y-1.5">
        {beneficios[rol].map((b) => (
          <li key={b} className="text-xs text-[var(--m2-muted)] inline-flex items-center gap-2">
            <span className="text-amber-500">
              <IconStar size={10} />
            </span>
            {b}
          </li>
        ))}
      </ul>

      {proximoPlan[rol] && (
        <a
          href={linkWhatsApp(`Hola Nicolás, quiero upgradear a ${proximoPlan[rol]}`)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors tracking-wider"
        >
          <IconWhatsApp size={12} />
          Upgradear a {proximoPlan[rol]}
        </a>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm px-3 py-2.5 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)] transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
