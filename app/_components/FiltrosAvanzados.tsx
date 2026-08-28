"use client";

import { useMemo } from "react";
import type { FiltroOperacion, OrdenPropiedades, Propiedad } from "../_lib/types";
import { IconClose, IconFilter } from "./Icon";

export type EstadoFiltros = {
  operacion: FiltroOperacion;
  tipo: string;
  dormitoriosMin: number;
  precioMin: number;
  precioMax: number;
  orden: OrdenPropiedades;
  busqueda: string;
};

export const FILTROS_INICIAL: EstadoFiltros = {
  operacion: "Todos",
  tipo: "Todos",
  dormitoriosMin: 0,
  precioMin: 0,
  precioMax: 0,
  orden: "recientes",
  busqueda: "",
};

const OPERACIONES: FiltroOperacion[] = ["Todos", "Venta", "Alquiler"];

const ORDEN_LABEL: Record<OrdenPropiedades, string> = {
  recientes: "Más recientes",
  precio_asc: "Precio ↑",
  precio_desc: "Precio ↓",
  m2_desc: "M² ↓",
  visitas_desc: "Más vistas",
};

type Props = {
  propiedades: Propiedad[];
  filtros: EstadoFiltros;
  onCambiar: (f: EstadoFiltros) => void;
};

export default function FiltrosAvanzados({ propiedades, filtros, onCambiar }: Props) {
  const tipos = useMemo(() => {
    const set = new Set<string>();
    propiedades.forEach((p) => set.add(p.tipo));
    return ["Todos", ...Array.from(set).sort()];
  }, [propiedades]);

  const precios = useMemo(() => {
    const values = propiedades
      .filter((p) => typeof p.precioValor === "number")
      .map((p) => p.precioValor as number);
    if (values.length === 0) return { min: 0, max: 1000000 };
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [propiedades]);

  const activo =
    filtros.operacion !== "Todos" ||
    filtros.tipo !== "Todos" ||
    filtros.dormitoriosMin > 0 ||
    filtros.precioMin > 0 ||
    (filtros.precioMax > 0 && filtros.precioMax < precios.max) ||
    filtros.busqueda.length > 0;

  const set = <K extends keyof EstadoFiltros>(k: K, v: EstadoFiltros[K]) =>
    onCambiar({ ...filtros, [k]: v });

  const limpiar = () =>
    onCambiar({ ...FILTROS_INICIAL, orden: filtros.orden, precioMax: precios.max });

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-4 sm:p-5 space-y-4">
      {/* Búsqueda + orden */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m2-muted)]">
            <IconFilter size={14} />
          </span>
          <input
            type="search"
            value={filtros.busqueda}
            onChange={(e) => set("busqueda", e.target.value)}
            placeholder="Buscar por título, barrio o referencia…"
            className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm pl-10 pr-3 py-2.5 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)] transition-colors"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-[var(--m2-muted)] shrink-0">
          <span className="uppercase tracking-[0.18em] font-semibold">Orden</span>
          <select
            value={filtros.orden}
            onChange={(e) => set("orden", e.target.value as OrdenPropiedades)}
            className="bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm px-3 py-2 text-xs text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-ink)]"
          >
            {(Object.keys(ORDEN_LABEL) as OrdenPropiedades[]).map((o) => (
              <option key={o} value={o}>
                {ORDEN_LABEL[o]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {OPERACIONES.map((op) => {
          const active = filtros.operacion === op;
          return (
            <button
              key={op}
              type="button"
              onClick={() => set("operacion", op)}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors duration-200 border ${
                active
                  ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]"
                  : "bg-[var(--m2-bg)] border-[var(--m2-line)] text-[var(--m2-muted)] hover:border-[var(--m2-muted)] hover:text-[var(--m2-ink)]"
              }`}
            >
              {op}
            </button>
          );
        })}
        <span className="w-px bg-[var(--m2-line)] mx-1 self-stretch" aria-hidden />
        {tipos.slice(0, 8).map((tipo) => {
          const active = filtros.tipo === tipo;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => set("tipo", tipo)}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors duration-200 border ${
                active
                  ? "bg-[var(--m2-muted)] text-[var(--m2-bg)] border-[var(--m2-muted)]"
                  : "bg-[var(--m2-bg)] border-[var(--m2-line)] text-[var(--m2-muted)] hover:border-[var(--m2-muted)] hover:text-[var(--m2-ink)]"
              }`}
            >
              {tipo}
            </button>
          );
        })}
      </div>

      {/* Rangos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-1.5">
            Dormitorios mín · {filtros.dormitoriosMin === 0 ? "cualquiera" : `${filtros.dormitoriosMin}+`}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={filtros.dormitoriosMin}
            onChange={(e) => set("dormitoriosMin", Number(e.target.value))}
            className="m2-range w-full"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-1.5">
            Precio mín · {filtros.precioMin === 0 ? "sin mínimo" : filtros.precioMin.toLocaleString("es-AR")}
          </label>
          <input
            type="range"
            min={0}
            max={precios.max}
            step={Math.max(1000, Math.round(precios.max / 100))}
            value={filtros.precioMin}
            onChange={(e) => set("precioMin", Number(e.target.value))}
            className="m2-range w-full"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-1.5">
            Precio máx · {filtros.precioMax === 0 ? "sin máximo" : filtros.precioMax.toLocaleString("es-AR")}
          </label>
          <input
            type="range"
            min={0}
            max={precios.max}
            step={Math.max(1000, Math.round(precios.max / 100))}
            value={filtros.precioMax}
            onChange={(e) => set("precioMax", Number(e.target.value))}
            className="m2-range w-full"
          />
        </div>
      </div>

      {activo && (
        <button
          type="button"
          onClick={limpiar}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors"
        >
          <IconClose size={12} /> Limpiar filtros
        </button>
      )}
    </div>
  );
}

export function aplicarFiltros(propiedades: Propiedad[], f: EstadoFiltros): Propiedad[] {
  const q = f.busqueda.trim().toLowerCase();
  const filtradas = propiedades.filter((p) => {
    if (f.operacion !== "Todos" && p.operacion !== f.operacion) return false;
    if (f.tipo !== "Todos" && p.tipo !== f.tipo) return false;
    if (f.dormitoriosMin > 0 && p.dormitorios < f.dormitoriosMin) return false;
    const precio = p.precioValor ?? 0;
    if (f.precioMin > 0 && precio < f.precioMin) return false;
    if (f.precioMax > 0 && precio > f.precioMax) return false;
    if (q) {
      const hay = [p.titulo, p.ubicacion, p.id, p.tipo].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (f.orden) {
    case "precio_asc":
      return [...filtradas].sort((a, b) => (a.precioValor ?? 0) - (b.precioValor ?? 0));
    case "precio_desc":
      return [...filtradas].sort((a, b) => (b.precioValor ?? 0) - (a.precioValor ?? 0));
    case "m2_desc":
      return [...filtradas].sort((a, b) => b.m2Totales - a.m2Totales);
    case "visitas_desc":
      return [...filtradas].sort((a, b) => b.visitas - a.visitas);
    case "recientes":
    default:
      return [...filtradas].sort((a, b) => (b.fechaAlta ?? "").localeCompare(a.fechaAlta ?? ""));
  }
}
