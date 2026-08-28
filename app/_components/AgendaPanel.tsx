"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Visita } from "../_lib/types";
import { useAgenda } from "./AgendaProvider";
import { useAuth } from "./AuthProvider";
import { IconCalendar, IconPlus, IconTrash } from "./Icon";
import { useProperties } from "./PropertyProvider";
import { useToast } from "./ToastProvider";

function fechaISOLocal(fecha: string) {
  return new Date(fecha).toLocaleString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgendaPanel() {
  const { usuario } = useAuth();
  const { visitas, agregar, borrar } = useAgenda();
  const { propiedades } = useProperties();
  const { exito, info } = useToast();
  const [abrir, setAbrir] = useState(false);
  const [form, setForm] = useState({
    cliente: "",
    fechaHora: "",
    duracionMin: 45,
    propiedadId: "",
    notas: "",
  });

  const mias = useMemo(() => {
    if (!usuario) return [];
    const base = usuario.rol === "admin" ? visitas : visitas.filter((v) => v.agenteId === usuario.id);
    return [...base].sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));
  }, [visitas, usuario]);

  const proximas = useMemo(
    () => mias.filter((v) => new Date(v.fechaHora).getTime() >= Date.now() - 3600_000),
    [mias],
  );
  const pasadas = useMemo(
    () => mias.filter((v) => new Date(v.fechaHora).getTime() < Date.now() - 3600_000).reverse(),
    [mias],
  );

  if (!usuario) return null;

  const propiedadesUsuario = usuario.rol === "admin"
    ? propiedades
    : propiedades.filter((p) => p.agenteId === usuario.id);

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!form.cliente.trim() || !form.fechaHora) {
      info("Datos incompletos", "Necesitás cliente y fecha/hora");
      return;
    }
    agregar({
      agenteId: usuario.id,
      cliente: form.cliente.trim(),
      fechaHora: new Date(form.fechaHora).toISOString(),
      duracionMin: form.duracionMin || undefined,
      propiedadId: form.propiedadId || undefined,
      notas: form.notas.trim() || undefined,
    });
    exito("Visita agendada", form.cliente.trim());
    setForm({ cliente: "", fechaHora: "", duracionMin: 45, propiedadId: "", notas: "" });
    setAbrir(false);
  };

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[var(--m2-ink)]"><IconCalendar size={16} /></span>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--m2-ink)]">Agenda de visitas</h2>
            <p className="text-xs text-[var(--m2-muted)] mt-1">
              {proximas.length} próximas · {pasadas.length} pasadas
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAbrir((v) => !v)}
          className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-3 py-2 rounded-sm transition-colors"
        >
          <IconPlus size={12} />
          {abrir ? "Cancelar" : "Nueva visita"}
        </button>
      </div>

      {abrir && (
        <form onSubmit={handle} className="mb-6 p-4 bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm space-y-3 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">Cliente *</span>
              <input
                type="text"
                required
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">Fecha y hora *</span>
              <input
                type="datetime-local"
                required
                value={form.fechaHora}
                onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">Duración (min)</span>
              <input
                type="number"
                min={15}
                step={15}
                value={form.duracionMin}
                onChange={(e) => setForm({ ...form, duracionMin: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">Propiedad</span>
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
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">Notas</span>
            <textarea
              rows={2}
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="w-full px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)] resize-none"
            />
          </label>
          <div className="flex justify-end">
            <button type="submit" className="bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2 rounded-sm transition-colors">
              Agendar
            </button>
          </div>
        </form>
      )}

      {mias.length === 0 ? (
        <p className="text-center text-sm text-[var(--m2-muted)] py-6 border border-dashed border-[var(--m2-line)] rounded-sm">
          Sin visitas todavía. Agendá para ver tu semana de un vistazo.
        </p>
      ) : (
        <>
          {proximas.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] mb-2">Próximas</p>
              <VisitasLista visitas={proximas} propiedades={propiedades} onBorrar={(v) => { if (confirm(`¿Cancelar visita con ${v.cliente}?`)) { borrar(v.id); info("Visita cancelada"); } }} />
            </>
          )}
          {pasadas.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] mb-2">Historial</p>
              <VisitasLista visitas={pasadas.slice(0, 5)} propiedades={propiedades} onBorrar={(v) => { if (confirm(`¿Eliminar visita con ${v.cliente}?`)) { borrar(v.id); info("Visita eliminada"); } }} apagado />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VisitasLista({
  visitas,
  propiedades,
  onBorrar,
  apagado,
}: {
  visitas: Visita[];
  propiedades: Array<{ id: string; titulo: string }>;
  onBorrar: (v: Visita) => void;
  apagado?: boolean;
}) {
  return (
    <ul className="divide-y divide-[var(--m2-line)]">
      {visitas.map((v) => {
        const propiedad = v.propiedadId ? propiedades.find((p) => p.id === v.propiedadId) : undefined;
        return (
          <li key={v.id} className={`flex items-start justify-between gap-3 py-3 ${apagado ? "opacity-60" : ""}`}>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-serif font-semibold text-[var(--m2-ink)]">{v.cliente}</p>
              <p className="text-[11px] text-[var(--m2-muted)] mt-0.5">
                {fechaISOLocal(v.fechaHora)}
                {v.duracionMin && ` · ${v.duracionMin} min`}
              </p>
              {propiedad && (
                <p className="text-[11px] text-[var(--m2-muted)] mt-0.5">
                  <span className="text-[var(--m2-ink)] font-semibold">{propiedad.id}</span> · {propiedad.titulo}
                </p>
              )}
              {v.notas && <p className="text-[11px] text-[var(--m2-muted)] italic mt-1">{v.notas}</p>}
            </div>
            <button
              type="button"
              onClick={() => onBorrar(v)}
              aria-label="Eliminar"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-red-700 border border-[var(--m2-line)]"
            >
              <IconTrash size={13} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
