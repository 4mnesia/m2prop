"use client";

import Link from "next/link";
import type { Propiedad, Usuario } from "../_lib/types";
import { linkWhatsApp } from "../_lib/whatsapp";
import AmenidadesBarrio from "./AmenidadesBarrio";
import Carousel from "./Carousel";
import CompareButton from "./CompareButton";
import CreditoSimulator from "./CreditoSimulator";
import EstadoOverlay from "./EstadoOverlay";
import ExportPdfButton from "./ExportPdfButton";
import FavoriteButton from "./FavoriteButton";
import HistorialPreciosView from "./HistorialPreciosView";
import PresentMode from "./PresentMode";
import VideoEmbed from "./VideoEmbed";
import { IconArrowLeft, IconMail, IconPin, IconWhatsApp } from "./Icon";
import ReviewsSection from "./ReviewsSection";
import SendToClient from "./SendToClient";
import ShareButton from "./ShareButton";

type Props = {
  propiedad: Propiedad;
  agente: Usuario;
};

export default function DetalleView({ propiedad, agente }: Props) {
  const wspMensaje = `Hola ${agente.nombre.split(" ")[0]}, estoy interesado en la propiedad ${propiedad.id} (${propiedad.titulo})`;

  return (
    <div className="min-h-screen bg-[var(--m2-bg)] animate-fade-in">
      <div className="bg-[var(--m2-surface)]/90 backdrop-blur-md border-b border-[var(--m2-line)] sticky top-12 sm:top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
          <Link
            href={`/a/${agente.slug}`}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors duration-300"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
              <IconArrowLeft size={14} />
            </span>
            Volver al catálogo
          </Link>
          <div className="flex items-center gap-3">
            <ShareButton
              titulo={`${propiedad.titulo} · ${propiedad.precio}`}
              descripcion={propiedad.descripcion.slice(0, 140)}
              path={`/a/${agente.slug}/${propiedad.id}`}
              compact
            />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-serif font-bold text-[var(--m2-ink)]">{agente.nombre}</p>
              <p className="text-[10px] text-[var(--m2-muted)]">{agente.inmobiliaria}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 animate-fade-up">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-sm text-[var(--m2-bg)] bg-[var(--m2-ink)] tracking-wider">
              {propiedad.operacion}
            </span>
            <span className="text-xs uppercase font-bold text-[var(--m2-muted)] tracking-widest">
              {propiedad.tipo} • Ref: {propiedad.id}
            </span>
            {propiedad.destacada && (
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm text-[var(--m2-bg)] bg-[var(--m2-muted)] tracking-wider">
                Destacada
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-ink)] leading-tight">
            {propiedad.titulo}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
            <p className="inline-flex items-center gap-1.5 text-sm text-[var(--m2-muted)]">
              <IconPin size={14} />
              {propiedad.ubicacion}
            </p>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[var(--m2-ink)]">
              {propiedad.precio}
            </p>
          </div>
        </div>

        <div className="mb-8 sm:mb-10 animate-scale-in relative" style={{ animationDelay: "80ms" }}>
          <Carousel imagenes={propiedad.imagenes} alt={propiedad.titulo} ambientes={propiedad.ambientesImagenes} />
          <EstadoOverlay estado={propiedad.estado} tamanio="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div
              className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 text-center animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              <Stat label="Total" value={`${propiedad.m2Totales} m²`} />
              <Stat label="Cubiertos" value={`${propiedad.m2Cubiertos} m²`} />
              <Stat label="Ambientes" value={propiedad.ambientes} />
              <Stat label="Dormitorios" value={propiedad.dormitorios} />
              <Stat label="Baños" value={propiedad.banos} />
              <Stat label="Cocheras" value={propiedad.cocheras} />
              <Stat label="Antigüedad" value={propiedad.antiguedad} small />
              <Stat label="Estado" value="Excelente" small accent />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-ink)] mb-4 border-b border-[var(--m2-line)] pb-3">
                Descripción
              </h3>
              <p className="text-[var(--m2-muted)] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {propiedad.descripcion}
              </p>
            </div>
            {propiedad.videoUrl && (
              <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-ink)] mb-4 border-b border-[var(--m2-line)] pb-3">
                  Video / Tour 360
                </h3>
                <VideoEmbed url={propiedad.videoUrl} />
              </div>
            )}
            {propiedad.historialPrecio && propiedad.historialPrecio.length > 0 && (
              <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
                <HistorialPreciosView historial={propiedad.historialPrecio} />
              </div>
            )}
            <div className="animate-fade-up" style={{ animationDelay: "260ms" }}>
              <CreditoSimulator propiedad={propiedad} />
            </div>
            {typeof propiedad.lat === "number" && typeof propiedad.lng === "number" && (
              <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-ink)] mb-4 border-b border-[var(--m2-line)] pb-3">
                  Ubicación
                </h3>
                <div className="rounded-sm overflow-hidden border border-[var(--m2-line)] aspect-video bg-[var(--m2-surface)]">
                  <iframe
                    title="Mapa de ubicación"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${propiedad.lng - 0.01}%2C${propiedad.lat - 0.01}%2C${propiedad.lng + 0.01}%2C${propiedad.lat + 0.01}&layer=mapnik&marker=${propiedad.lat}%2C${propiedad.lng}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] text-[var(--m2-muted)] mt-2 text-right">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${propiedad.lat}&mlon=${propiedad.lng}#map=15/${propiedad.lat}/${propiedad.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--m2-ink)] underline underline-offset-2"
                  >
                    Ver mapa más grande
                  </a>
                </p>
              </div>
            )}
            {typeof propiedad.lat === "number" && typeof propiedad.lng === "number" && (
              <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
                <AmenidadesBarrio lat={propiedad.lat} lng={propiedad.lng} />
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div
              className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8 lg:sticky lg:top-28 space-y-5 animate-fade-up"
              style={{ animationDelay: "320ms" }}
            >
              <div className="flex items-center gap-4 border-b border-[var(--m2-line)] pb-5">
                {agente.fotoUrl ? (
                  <img
                    src={agente.fotoUrl}
                    alt={agente.nombre}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--m2-line)] flex items-center justify-center text-[var(--m2-ink)] font-serif font-bold shrink-0">
                    {agente.avatarIniciales}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-[var(--m2-ink)] truncate">{agente.nombre}</h4>
                  <p className="text-xs text-[var(--m2-muted)] truncate">{agente.inmobiliaria}</p>
                </div>
              </div>
              <a
                href={linkWhatsApp(wspMensaje)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-bold text-xs py-3.5 sm:py-4 rounded-sm transition-colors duration-300 tracking-wider"
              >
                <IconWhatsApp size={14} />
                CONSULTAR POR WHATSAPP
              </a>
              <a
                href={`mailto:${agente.email}?subject=${encodeURIComponent(`Consulta ${propiedad.id}`)}`}
                className="inline-flex items-center justify-center gap-2 w-full border border-[var(--m2-ink)] text-[var(--m2-ink)] hover:bg-[var(--m2-ink)] hover:text-[var(--m2-bg)] font-semibold text-xs py-3.5 sm:py-4 rounded-sm transition-colors duration-300 tracking-wider"
              >
                <IconMail size={14} />
                ENVIAR EMAIL
              </a>
              <div className="pt-2 space-y-2">
                <ShareButton
                  titulo={`${propiedad.titulo} · ${propiedad.precio}`}
                  descripcion={propiedad.descripcion.slice(0, 140)}
                  path={`/a/${agente.slug}/${propiedad.id}`}
                />
                <SendToClient propiedad={propiedad} agente={agente} />
                <FavoriteButton id={propiedad.id} label />
                <CompareButton id={propiedad.id} />
                <PresentMode propiedad={propiedad} agente={agente} />
                <ExportPdfButton />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 sm:mt-12 animate-fade-up" style={{ animationDelay: "380ms" }}>
          <ReviewsSection tipo="propiedad" targetId={propiedad.id} />
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  small,
  accent,
}: {
  label: string;
  value: string | number;
  small?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] sm:text-xs text-[var(--m2-muted)] uppercase tracking-wider">{label}</p>
      <p
        className={`${small ? "text-base sm:text-lg" : "text-xl sm:text-2xl"} font-serif font-bold mt-1 ${
          accent ? "text-[var(--m2-muted)]" : "text-[var(--m2-ink)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
