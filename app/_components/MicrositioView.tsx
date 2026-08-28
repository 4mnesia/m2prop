"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Propiedad, Usuario } from "../_lib/types";
import { linkWhatsApp } from "../_lib/whatsapp";
import AlertForm from "./AlertForm";
import CompareButton from "./CompareButton";
import EstadoOverlay from "./EstadoOverlay";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "./FavoritesProvider";
import FiltrosAvanzados, { FILTROS_INICIAL, aplicarFiltros, type EstadoFiltros } from "./FiltrosAvanzados";
import { IconArrowRight, IconHeart, IconMail, IconPin, IconStar, IconWhatsApp } from "./Icon";
import ReviewsSection from "./ReviewsSection";
import { useReviews } from "./ReviewsProvider";
import ShareButton from "./ShareButton";
import { SkeletonPropertyCard } from "./Skeleton";
import StarRating from "./StarRating";

type Props = {
  agente: Usuario;
  propiedades: Propiedad[];
  cargando?: boolean;
};

export default function MicrositioView({ agente, propiedades, cargando }: Props) {
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIAL);
  const { favoritos } = useFavorites();
  const { promedio, paraTarget } = useReviews();

  const filtradas = useMemo(() => aplicarFiltros(propiedades, filtros), [propiedades, filtros]);
  const destacadas = useMemo(() => propiedades.filter((p) => p.destacada), [propiedades]);
  const tiposDisponibles = useMemo(
    () => Array.from(new Set(propiedades.map((p) => p.tipo))).sort(),
    [propiedades],
  );
  const favoritas = useMemo(
    () => propiedades.filter((p) => favoritos.includes(p.id)),
    [propiedades, favoritos],
  );
  const promAgente = promedio("agente", agente.id);
  const cantResenasAgente = paraTarget("agente", agente.id).length;

  const wspMensaje = `Hola ${agente.nombre.split(" ")[0]}, vi tu micrositio y quiero consultar por una propiedad`;

  const color = agente.colorPrimario || "var(--m2-ink)";
  const acento = agente.colorAcento || "var(--m2-muted)";
  const plantilla = agente.plantilla ?? "elegante";
  const esMinimal = plantilla === "minimal";
  const esModerna = plantilla === "moderna";

  return (
    <div className="min-h-screen bg-[var(--m2-bg)] animate-fade-in">
      {/* Hero */}
      <div className={`relative overflow-hidden ${esMinimal ? "h-[280px] sm:h-[320px]" : "h-[420px] sm:h-[460px]"}`}>
        {!esMinimal && (
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: esMinimal
              ? `linear-gradient(180deg, ${color} 0%, ${acento} 100%)`
              : esModerna
                ? `linear-gradient(180deg, ${color}f5 0%, ${color}bb 100%)`
                : `linear-gradient(120deg, ${color}dd 0%, ${color}80 100%)`,
          }}
        />
        <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-5 animate-fade-up">
            {agente.fotoUrl ? (
              <img
                src={agente.fotoUrl}
                alt={agente.nombre}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shrink-0"
              />
            ) : (
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center font-serif font-bold text-xl sm:text-2xl shrink-0"
                style={{ background: acento, borderColor: "white", color }}
              >
                {agente.avatarIniciales}
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 font-semibold">
                Asesor Inmobiliario
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">{agente.nombre}</h1>
              <p className="text-xs text-white/80">{agente.inmobiliaria}</p>
              {cantResenasAgente > 0 && (
                <div className="inline-flex items-center gap-1.5 mt-2 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <StarRating value={promAgente} size={12} />
                  <span className="text-[11px] font-semibold text-white tabular-nums">{promAgente.toFixed(1)}</span>
                  <span className="text-[10px] text-white/80">· {cantResenasAgente} reseñas</span>
                </div>
              )}
              {agente.bio && (
                <p className="hidden sm:block text-xs text-white/70 max-w-md mt-2 italic leading-relaxed">
                  “{agente.bio}”
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-stretch sm:items-end animate-fade-up" style={{ animationDelay: "120ms" }}>
            <a
              href={linkWhatsApp(wspMensaje)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-[var(--m2-line)] font-semibold text-xs px-5 sm:px-6 py-3 rounded-sm transition-colors duration-300"
              style={{ color }}
            >
              <IconWhatsApp size={14} />
              Consultar por WhatsApp
            </a>
            <ShareButton
              titulo={`${agente.nombre} · Propiedades`}
              descripcion={agente.bio}
              path={`/a/${agente.slug}`}
              compact
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {favoritas.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5 border-b border-[var(--m2-line)] pb-3">
              <div className="inline-flex items-center gap-2">
                <span className="text-red-600">
                  <IconHeart size={16} filled />
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--m2-ink)]">
                  Tus favoritas
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">
                {favoritas.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoritas.map((p, i) => (
                <PropertyCard key={p.id} propiedad={p} slug={agente.slug} index={i} plantilla={plantilla} />
              ))}
            </div>
          </section>
        )}
        {destacadas.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5 border-b border-[var(--m2-line)] pb-3">
              <div className="inline-flex items-center gap-2">
                <span style={{ color: acento }}>
                  <IconStar size={16} />
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--m2-ink)]">
                  Propiedades destacadas
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">
                {destacadas.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destacadas.map((p, i) => (
                <PropertyCard key={p.id} propiedad={p} slug={agente.slug} index={i} plantilla={plantilla} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 border-b border-[var(--m2-line)] pb-3 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">
                Catálogo completo
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--m2-ink)] mt-1">
                {propiedades.length} propiedades disponibles
              </h2>
            </div>
          </div>

          <div className="mb-6">
            <FiltrosAvanzados propiedades={propiedades} filtros={filtros} onCambiar={setFiltros} />
          </div>

          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonPropertyCard key={i} />
              ))}
            </div>
          ) : filtradas.length === 0 ? (
            <div className="text-center py-16 text-[var(--m2-muted)] text-sm border border-dashed border-[var(--m2-line)] rounded-sm">
              No hay propiedades que coincidan con los filtros seleccionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
              {filtradas.map((p, i) => (
                <PropertyCard key={p.id} propiedad={p} slug={agente.slug} index={i} plantilla={plantilla} />
              ))}
            </div>
          )}
        </section>

        <section className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <AlertForm agenteSlug={agente.slug} tiposDisponibles={tiposDisponibles} />
        </section>

        <section className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <ReviewsSection
            tipo="agente"
            targetId={agente.id}
            titulo={`Opiniones sobre ${agente.nombre.split(" ")[0]}`}
            descripcion="Contá tu experiencia con este asesor. Ayudás a que otros elijan mejor."
          />
        </section>
      </main>

      <footer className="border-t border-[var(--m2-line)] py-8 text-center text-xs text-[var(--m2-muted)]">
        <p>Micrositio desarrollado por M2Prop · Nicolás Márquez Casali</p>
        {agente.sitioWeb && (
          <a
            href={`https://${agente.sitioWeb}`}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--m2-ink)] underline underline-offset-2 mt-1 inline-block"
          >
            {agente.sitioWeb}
          </a>
        )}
        {agente.telefono && (
          <p className="mt-2">
            <a
              href={`mailto:${agente.email}`}
              className="inline-flex items-center gap-1.5 hover:text-[var(--m2-ink)] transition-colors"
            >
              <IconMail size={12} /> {agente.email}
            </a>
          </p>
        )}
      </footer>
    </div>
  );
}

function PropertyCard({
  propiedad: p,
  slug,
  index,
  plantilla = "elegante",
}: {
  propiedad: Propiedad;
  slug: string;
  index: number;
  plantilla?: "elegante" | "moderna" | "minimal";
}) {
  const { promedio, paraTarget } = useReviews();
  const prom = promedio("propiedad", p.id);
  const cant = paraTarget("propiedad", p.id).length;

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
      className={`bg-[var(--m2-surface)] rounded-sm overflow-hidden transition-colors duration-500 group hover-lift animate-fade-up flex flex-col ${
        plantilla === "moderna" ? "shadow-md hover:shadow-lg" : "border border-[var(--m2-line)] hover:border-[var(--m2-muted)]"
      }`}
    >
      <Link href={`/a/${slug}/${p.id}`} className="block h-56 sm:h-60 relative overflow-hidden">
        <img src={p.imagenes[0]} alt={p.titulo} className="w-full h-full object-cover img-zoom" />
        <EstadoOverlay estado={p.estado} />
        <div className="absolute top-4 left-4 bg-[var(--m2-ink)] text-[var(--m2-bg)] text-[10px] font-semibold px-3 py-1.5 rounded-sm uppercase tracking-wider backdrop-blur-sm">
          {p.operacion}: {p.precio}
        </div>
        {p.destacada && (
          <div className="absolute top-4 right-4 bg-[var(--m2-muted)] text-[var(--m2-bg)] text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1">
            <IconStar size={10} />
            Destacada
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
          <FavoriteButton id={p.id} />
          <CompareButton id={p.id} compact />
        </div>
      </Link>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--m2-ink)] mb-1">{p.titulo}</h3>
        <p className="inline-flex items-center gap-1.5 text-xs text-[var(--m2-muted)] mb-2">
          <IconPin size={12} />
          {p.ubicacion}
        </p>
        {cant > 0 && (
          <div className="inline-flex items-center gap-1.5 mb-3">
            <StarRating value={prom} size={12} />
            <span className="text-[11px] text-[var(--m2-muted)] tabular-nums">
              {prom.toFixed(1)} · {cant}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-[11px] text-[var(--m2-muted)] mb-5">
          <span>{p.m2Totales} m²</span>
          {p.dormitorios > 0 && <span>· {p.dormitorios} dorm</span>}
          {p.banos > 0 && <span>· {p.banos} baño{p.banos > 1 ? "s" : ""}</span>}
          {p.cocheras > 0 && <span>· {p.cocheras} cochera{p.cocheras > 1 ? "s" : ""}</span>}
        </div>
        <Link
          href={`/a/${slug}/${p.id}`}
          className="group inline-flex items-center justify-center gap-2 w-full bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-medium text-xs py-3 rounded-sm transition-colors duration-300 tracking-wider mt-auto"
        >
          VER DETALLE COMPLETO
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            <IconArrowRight size={12} />
          </span>
        </Link>
      </div>
    </article>
  );
}
