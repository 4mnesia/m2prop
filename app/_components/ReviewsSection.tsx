"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { TipoResena } from "../_lib/types";
import { useReviews } from "./ReviewsProvider";
import StarRating from "./StarRating";
import { useToast } from "./ToastProvider";

type Props = {
  tipo: TipoResena;
  targetId: string;
  titulo?: string;
  descripcion?: string;
};

export default function ReviewsSection({ tipo, targetId, titulo, descripcion }: Props) {
  const { paraTarget, agregar, promedio } = useReviews();
  const { exito, error } = useToast();
  const [autor, setAutor] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);

  const lista = useMemo(
    () => paraTarget(tipo, targetId).sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
    [paraTarget, tipo, targetId],
  );
  const prom = promedio(tipo, targetId);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!autor.trim() || !comentario.trim()) {
      error("Falta completar", "Ingresá tu nombre y un comentario");
      return;
    }
    agregar({ tipo, targetId, autor: autor.trim(), comentario: comentario.trim(), calificacion });
    exito("¡Gracias por tu reseña!", "Tu opinión ya es pública");
    setAutor("");
    setComentario("");
    setCalificacion(5);
  };

  return (
    <section
      aria-label={titulo ?? "Reseñas"}
      className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8"
    >
      <header className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h3 className="font-serif font-bold text-lg text-[var(--m2-ink)]">
            {titulo ?? (tipo === "agente" ? "Reseñas del agente" : "Reseñas de la propiedad")}
          </h3>
          {descripcion && (
            <p className="text-xs text-[var(--m2-muted)] mt-1">{descripcion}</p>
          )}
        </div>
        {lista.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={prom} size={16} />
            <span className="text-sm font-serif font-bold text-[var(--m2-ink)] tabular-nums">
              {prom.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--m2-muted)]">
              · {lista.length} {lista.length === 1 ? "reseña" : "reseñas"}
            </span>
          </div>
        )}
      </header>

      {/* Lista */}
      <ul className="space-y-4 mb-6">
        {lista.length === 0 && (
          <li className="text-center py-6 text-sm text-[var(--m2-muted)] border border-dashed border-[var(--m2-line)] rounded-sm">
            Sé el primero en dejar una reseña.
          </li>
        )}
        {lista.map((r) => (
          <li key={r.id} className="border-b border-[var(--m2-line)] pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-full bg-[var(--m2-line)] text-[var(--m2-ink)] flex items-center justify-center text-[10px] font-serif font-bold shrink-0">
                  {iniciales(r.autor)}
                </span>
                <p className="text-sm font-semibold text-[var(--m2-ink)] truncate">{r.autor}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StarRating value={r.calificacion} size={12} />
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--m2-muted)] font-semibold">
                  {formatoFecha(r.fecha)}
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--m2-muted)] leading-relaxed">{r.comentario}</p>
          </li>
        ))}
      </ul>

      {/* Formulario */}
      <form onSubmit={enviar} className="border-t border-[var(--m2-line)] pt-5 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[var(--m2-muted)]">
          Dejá tu reseña
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Tu nombre"
            className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm px-3 py-2 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)]"
          />
          <StarRating value={calificacion} onChange={setCalificacion} size={22} />
        </div>
        <textarea
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Contá tu experiencia…"
          className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm px-3 py-2 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)] resize-y"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-5 py-2.5 rounded-sm transition-colors tracking-wider"
          >
            PUBLICAR RESEÑA
          </button>
        </div>
      </form>
    </section>
  );
}

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatoFecha(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}
