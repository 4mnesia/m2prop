"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { EstadoLead, Lead } from "../_lib/types";
import { linkWhatsApp } from "../_lib/whatsapp";
import { useAuth } from "./AuthProvider";
import { IconChat, IconMail, IconPlus, IconTrash, IconWhatsApp } from "./Icon";
import { COLORES_ESTADO_LEAD, ETIQUETAS_ESTADO_LEAD, useLeads } from "./LeadsProvider";
import { useProperties } from "./PropertyProvider";
import { useToast } from "./ToastProvider";

const ESTADOS: EstadoLead[] = ["nuevo", "contactado", "visito", "oferto", "cerrado", "perdido"];

export default function LeadsPanel() {
  const { usuario } = useAuth();
  const { leads, agregar, actualizar, borrar } = useLeads();
  const { propiedades } = useProperties();
  const { exito, info } = useToast();
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos");
  const [abrirNuevo, setAbrirNuevo] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    canal: "whatsapp" as Lead["canal"],
    propiedadId: "",
    mensaje: "",
  });

  const misLeads = useMemo(() => {
    if (!usuario) return [];
    if (usuario.rol === "admin") return leads;
    return leads.filter((l) => l.agenteId === usuario.id);
  }, [leads, usuario]);

  const filtrados = useMemo(() => {
    const base = filtro === "todos" ? misLeads : misLeads.filter((l) => l.estado === filtro);
    return [...base].sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [misLeads, filtro]);

  const contadores = useMemo(() => {
    const c: Record<EstadoLead | "todos", number> = {
      todos: misLeads.length,
      nuevo: 0, contactado: 0, visito: 0, oferto: 0, cerrado: 0, perdido: 0,
    };
    misLeads.forEach((l) => { c[l.estado] += 1; });
    return c;
  }, [misLeads]);

  if (!usuario) return null;

  const propiedadesUsuario = usuario.rol === "admin"
    ? propiedades
    : propiedades.filter((p) => p.agenteId === usuario.id);

  const handleAgregar = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.contacto.trim()) {
      info("Datos incompletos", "Nombre y contacto son obligatorios");
      return;
    }
    agregar({
      agenteId: usuario.id,
      nombre: form.nombre.trim(),
      contacto: form.contacto.trim(),
      canal: form.canal,
      propiedadId: form.propiedadId || undefined,
      mensaje: form.mensaje.trim() || undefined,
    });
    exito("Lead agregado", form.nombre.trim());
    setForm({ nombre: "", contacto: "", canal: "whatsapp", propiedadId: "", mensaje: "" });
    setAbrirNuevo(false);
  };

  const handleBorrar = (l: Lead) => {
    if (!confirm(`¿Eliminar lead de ${l.nombre}?`)) return;
    borrar(l.id);
    info("Lead eliminado", l.nombre);
  };

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--m2-ink)]">CRM · Leads</h2>
          <p className="text-xs text-[var(--m2-muted)] mt-1">
            {contadores.todos} totales · {contadores.nuevo} nuevos · {contadores.oferto} en oferta
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAbrirNuevo((v) => !v)}
          className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-3 py-2 rounded-sm transition-colors"
        >
          <IconPlus size={12} />
          {abrirNuevo ? "Cancelar" : "Nuevo lead"}
        </button>
      </div>

      {abrirNuevo && (
        <form onSubmit={handleAgregar} className="mb-6 p-4 bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm space-y-3 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Nombre" required>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
                required
              />
            </FormField>
            <FormField label="Contacto (email o tel)" required>
              <input
                type="text"
                value={form.contacto}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
                required
              />
            </FormField>
            <FormField label="Canal">
              <select
                value={form.canal}
                onChange={(e) => setForm({ ...form, canal: e.target.value as Lead["canal"] })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="web">Web</option>
                <option value="otro">Otro</option>
              </select>
            </FormField>
            <FormField label="Propiedad">
              <select
                value={form.propiedadId}
                onChange={(e) => setForm({ ...form, propiedadId: e.target.value })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
              >
                <option value="">— sin propiedad —</option>
                {propiedadesUsuario.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} · {p.titulo}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Mensaje">
            <textarea
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)] resize-none"
            />
          </FormField>
          <div className="flex justify-end">
            <button type="submit" className="bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2 rounded-sm transition-colors">
              Guardar lead
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4 text-[11px]">
        <FiltroChip activo={filtro === "todos"} onClick={() => setFiltro("todos")}>
          Todos ({contadores.todos})
        </FiltroChip>
        {ESTADOS.map((e) => (
          <FiltroChip key={e} activo={filtro === e} onClick={() => setFiltro(e)}>
            {ETIQUETAS_ESTADO_LEAD[e]} ({contadores[e]})
          </FiltroChip>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-10 text-[var(--m2-muted)] text-sm border border-dashed border-[var(--m2-line)] rounded-sm">
          Sin leads {filtro !== "todos" ? `en estado "${ETIQUETAS_ESTADO_LEAD[filtro as EstadoLead]}"` : "todavía"}.
        </div>
      ) : (
        <ul className="divide-y divide-[var(--m2-line)]">
          {filtrados.map((l) => {
            const propiedad = l.propiedadId ? propiedades.find((p) => p.id === l.propiedadId) : undefined;
            const esWhatsapp = l.canal === "whatsapp" && /^\+?\d/.test(l.contacto);
            const esEmail = l.canal === "email" && l.contacto.includes("@");
            return (
              <li key={l.id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-serif font-semibold text-[var(--m2-ink)]">{l.nombre}</p>
                    <span className={`text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-sm border ${COLORES_ESTADO_LEAD[l.estado]}`}>
                      {ETIQUETAS_ESTADO_LEAD[l.estado]}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--m2-muted)] mt-0.5 truncate">
                    {l.contacto} · {new Date(l.fecha).toLocaleDateString("es-AR")}
                  </p>
                  {propiedad && (
                    <p className="text-[11px] text-[var(--m2-muted)] mt-1">
                      Interesado en: <span className="text-[var(--m2-ink)] font-semibold">{propiedad.id}</span> · {propiedad.titulo}
                    </p>
                  )}
                  {l.mensaje && (
                    <p className="text-xs text-[var(--m2-ink)] mt-1 italic">“{l.mensaje}”</p>
                  )}
                  {l.notas && (
                    <p className="text-[11px] text-[var(--m2-muted)] mt-1">
                      <span className="uppercase tracking-widest text-[9px] font-semibold">Nota:</span> {l.notas}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <select
                    value={l.estado}
                    onChange={(e) => actualizar(l.id, { estado: e.target.value as EstadoLead })}
                    aria-label="Cambiar estado"
                    className="text-[11px] px-2 py-1.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{ETIQUETAS_ESTADO_LEAD[e]}</option>
                    ))}
                  </select>
                  {esWhatsapp && (
                    <a
                      href={linkWhatsApp(`Hola ${l.nombre}, te contacto desde M2Prop.`, l.contacto)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-[var(--m2-ink)] border border-[var(--m2-line)]"
                    >
                      <IconWhatsApp size={13} />
                    </a>
                  )}
                  {esEmail && (
                    <a
                      href={`mailto:${l.contacto}`}
                      aria-label="Email"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-[var(--m2-ink)] border border-[var(--m2-line)]"
                    >
                      <IconMail size={13} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const nueva = prompt("Nota interna sobre este lead:", l.notas ?? "");
                      if (nueva !== null) actualizar(l.id, { notas: nueva.trim() || undefined });
                    }}
                    aria-label="Nota"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-[var(--m2-ink)] border border-[var(--m2-line)]"
                  >
                    <IconChat size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBorrar(l)}
                    aria-label="Eliminar"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-red-700 border border-[var(--m2-line)]"
                  >
                    <IconTrash size={13} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FiltroChip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-sm border font-semibold uppercase tracking-widest transition-colors ${
        activo
          ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]"
          : "bg-[var(--m2-bg)] text-[var(--m2-muted)] border-[var(--m2-line)] hover:text-[var(--m2-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">
        {label}{required && " *"}
      </span>
      {children}
    </label>
  );
}
