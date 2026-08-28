"use client";

import type { Propiedad, Usuario } from "../_lib/types";
import { IconMail, IconPin, IconWhatsApp } from "./Icon";

type Props = {
  propiedad: Propiedad;
  agente: Usuario;
};

export default function PropertyPreview({ propiedad, agente }: Props) {
  return (
    <div className="animate-fade-in">
      {propiedad.imagenes[0] ? (
        <div className="w-full aspect-[16/9] overflow-hidden rounded-sm border border-[var(--m2-line)] mb-4">
          <img src={propiedad.imagenes[0]} alt={propiedad.titulo} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] flex items-center justify-center bg-[var(--m2-bg)] border border-dashed border-[var(--m2-line)] rounded-sm mb-4 text-xs text-[var(--m2-muted)]">
          Sin imágenes cargadas
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-sm text-[var(--m2-bg)] bg-[var(--m2-ink)] tracking-wider">
          {propiedad.operacion || "—"}
        </span>
        <span className="text-[10px] uppercase font-bold text-[var(--m2-muted)] tracking-widest">
          {propiedad.tipo} · Ref: {propiedad.id}
        </span>
        {propiedad.destacada && (
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm text-[var(--m2-bg)] bg-[var(--m2-muted)] tracking-wider">
            Destacada
          </span>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-ink)] leading-tight">
        {propiedad.titulo || "Sin título"}
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
        <p className="inline-flex items-center gap-1.5 text-xs text-[var(--m2-muted)]">
          <IconPin size={12} />
          {propiedad.ubicacion || "Ubicación pendiente"}
        </p>
        <p className="text-lg sm:text-xl font-serif font-bold text-[var(--m2-ink)]">
          {propiedad.precio || "Precio pendiente"}
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm p-3">
        <MiniStat label="Total" value={`${propiedad.m2Totales || 0} m²`} />
        <MiniStat label="Cub." value={`${propiedad.m2Cubiertos || 0} m²`} />
        <MiniStat label="Amb." value={propiedad.ambientes || 0} />
        <MiniStat label="Dorm." value={propiedad.dormitorios || 0} />
        <MiniStat label="Baños" value={propiedad.banos || 0} />
        <MiniStat label="Coch." value={propiedad.cocheras || 0} />
      </div>

      {propiedad.descripcion && (
        <p className="mt-4 text-sm text-[var(--m2-muted)] leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
          {propiedad.descripcion}
        </p>
      )}

      <div className="mt-4 border-t border-[var(--m2-line)] pt-4 flex items-center gap-3">
        {agente.fotoUrl ? (
          <img src={agente.fotoUrl} alt={agente.nombre} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--m2-line)] flex items-center justify-center text-xs font-serif font-bold">
            {agente.avatarIniciales}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-serif font-bold text-[var(--m2-ink)] truncate">{agente.nombre}</p>
          <p className="text-xs text-[var(--m2-muted)] truncate">{agente.inmobiliaria}</p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-[var(--m2-muted)]">
          <IconWhatsApp size={14} />
          <IconMail size={14} />
        </span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--m2-muted)] font-semibold">{label}</p>
      <p className="text-sm font-serif font-bold text-[var(--m2-ink)] mt-0.5">{value}</p>
    </div>
  );
}
