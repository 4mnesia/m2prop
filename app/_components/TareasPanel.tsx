"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { IconCheckSquare, IconPlus, IconTrash } from "./Icon";
import { useNotes } from "./NotesProvider";
import { useProperties } from "./PropertyProvider";

export default function TareasPanel() {
  const { usuario } = useAuth();
  const { tareas, agregarTarea, alternarTarea, borrarTarea, tareasDeAgente } = useNotes();
  const { propiedades } = useProperties();
  const [nueva, setNueva] = useState("");
  const [vence, setVence] = useState("");
  const [propiedadId, setPropiedadId] = useState("");
  const [ocultarHechas, setOcultarHechas] = useState(false);

  const mias = useMemo(() => {
    if (!usuario) return [];
    const base = usuario.rol === "admin" ? tareas : tareasDeAgente(usuario.id);
    const filtradas = ocultarHechas ? base.filter((t) => !t.hecha) : base;
    return [...filtradas].sort((a, b) => {
      if (a.hecha !== b.hecha) return a.hecha ? 1 : -1;
      if (a.vence && b.vence) return a.vence.localeCompare(b.vence);
      if (a.vence) return -1;
      if (b.vence) return 1;
      return b.fecha.localeCompare(a.fecha);
    });
  }, [tareas, tareasDeAgente, usuario, ocultarHechas]);

  if (!usuario) return null;

  const propiedadesUsuario = usuario.rol === "admin"
    ? propiedades
    : propiedades.filter((p) => p.agenteId === usuario.id);

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!nueva.trim()) return;
    agregarTarea({
      agenteId: usuario.id,
      titulo: nueva.trim(),
      vence: vence ? new Date(vence).toISOString() : undefined,
      propiedadId: propiedadId || undefined,
    });
    setNueva("");
    setVence("");
    setPropiedadId("");
  };

  const pendientes = mias.filter((t) => !t.hecha).length;

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[var(--m2-ink)]"><IconCheckSquare size={16} /></span>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--m2-ink)]">Tareas</h2>
            <p className="text-xs text-[var(--m2-muted)] mt-1">{pendientes} pendientes</p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-[11px] text-[var(--m2-muted)]">
          <input
            type="checkbox"
            checked={ocultarHechas}
            onChange={(e) => setOcultarHechas(e.target.checked)}
            className="accent-[var(--m2-ink)]"
          />
          Ocultar completadas
        </label>
      </div>

      <form onSubmit={handle} className="grid grid-cols-1 sm:grid-cols-[1fr_150px_150px_auto] gap-2 mb-5">
        <input
          type="text"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          placeholder="Nueva tarea"
          className="px-3 py-2 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
        />
        <input
          type="date"
          value={vence}
          onChange={(e) => setVence(e.target.value)}
          className="px-3 py-2 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
        />
        <select
          value={propiedadId}
          onChange={(e) => setPropiedadId(e.target.value)}
          className="px-3 py-2 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
        >
          <option value="">Sin propiedad</option>
          {propiedadesUsuario.map((p) => (
            <option key={p.id} value={p.id}>{p.id}</option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2 rounded-sm transition-colors"
        >
          <IconPlus size={12} /> Agregar
        </button>
      </form>

      {mias.length === 0 ? (
        <p className="text-center text-sm text-[var(--m2-muted)] py-6 border border-dashed border-[var(--m2-line)] rounded-sm">
          Sin tareas. Agregá una para no olvidar seguimientos.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--m2-line)]">
          {mias.map((t) => {
            const propiedad = t.propiedadId ? propiedades.find((p) => p.id === t.propiedadId) : undefined;
            const vencida = t.vence && !t.hecha && new Date(t.vence).getTime() < Date.now();
            return (
              <li key={t.id} className="flex items-start gap-3 py-3">
                <button
                  type="button"
                  onClick={() => alternarTarea(t.id)}
                  aria-pressed={t.hecha}
                  className={`w-5 h-5 mt-0.5 shrink-0 rounded-sm border flex items-center justify-center transition-colors ${
                    t.hecha
                      ? "bg-[var(--m2-ink)] border-[var(--m2-ink)] text-[var(--m2-bg)]"
                      : "bg-transparent border-[var(--m2-line)] hover:border-[var(--m2-muted)]"
                  }`}
                >
                  {t.hecha && <span className="text-[10px]">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${t.hecha ? "line-through text-[var(--m2-muted)]" : "text-[var(--m2-ink)]"}`}>
                    {t.titulo}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] mt-1">
                    {t.vence && (
                      <span className={vencida ? "text-red-600 font-semibold" : "text-[var(--m2-muted)]"}>
                        Vence {new Date(t.vence).toLocaleDateString("es-AR")}
                      </span>
                    )}
                    {propiedad && (
                      <span className="text-[var(--m2-muted)]">{propiedad.id}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => borrarTarea(t.id)}
                  aria-label="Eliminar"
                  className="text-[var(--m2-muted)] hover:text-red-700 shrink-0"
                >
                  <IconTrash size={12} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
