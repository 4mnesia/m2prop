"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { IconNote, IconTrash } from "./Icon";
import { useNotes } from "./NotesProvider";

export default function NotasPropiedadPanel({ propiedadId }: { propiedadId: string }) {
  const { usuario } = useAuth();
  const { notas, agregarNota, borrarNota, notasDePropiedad } = useNotes();
  const [texto, setTexto] = useState("");
  const lista = notasDePropiedad(propiedadId);

  if (!usuario) return null;

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    agregarNota({ propiedadId, autorId: usuario.id, texto: texto.trim() });
    setTexto("");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[var(--m2-muted)]"><IconNote size={14} /></span>
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[var(--m2-muted)]">
          Notas privadas · {lista.length}
        </p>
      </div>
      <form onSubmit={handle} className="flex gap-2 mb-3">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Agregá una nota interna (solo la ves vos)"
          className="flex-1 px-3 py-2 rounded-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
        />
        <button
          type="submit"
          className="bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-3 py-2 rounded-sm transition-colors"
        >
          Guardar
        </button>
      </form>
      {lista.length === 0 ? (
        <p className="text-[11px] text-[var(--m2-muted)] italic">Sin notas todavía.</p>
      ) : (
        <ul className="space-y-2">
          {lista.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-2 text-sm bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-3">
              <div className="min-w-0">
                <p className="text-[var(--m2-ink)]">{n.texto}</p>
                <p className="text-[10px] text-[var(--m2-muted)] mt-1">
                  {new Date(n.fecha).toLocaleString("es-AR")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => borrarNota(n.id)}
                aria-label="Eliminar"
                className="text-[var(--m2-muted)] hover:text-red-700 shrink-0"
              >
                <IconTrash size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
