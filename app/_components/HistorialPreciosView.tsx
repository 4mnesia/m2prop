"use client";

import { useMemo } from "react";
import type { HistorialPrecio } from "../_lib/types";
import { IconArrowDown, IconArrowUp, IconChart } from "./Icon";

export default function HistorialPreciosView({ historial }: { historial: HistorialPrecio[] }) {
  const ordenado = useMemo(
    () => [...historial].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [historial],
  );

  if (ordenado.length === 0) return null;

  const primero = ordenado[0];
  const ultimo = ordenado[ordenado.length - 1];
  const diferencia = ultimo.valor - primero.valor;
  const pctCambio = primero.valor ? (diferencia / primero.valor) * 100 : 0;
  const subio = diferencia > 0;

  const max = Math.max(...ordenado.map((h) => h.valor));
  const min = Math.min(...ordenado.map((h) => h.valor));
  const rango = Math.max(1, max - min);

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-ink)] mb-4 border-b border-[var(--m2-line)] pb-3 flex items-center gap-2">
        <span className="text-[var(--m2-muted)]"><IconChart size={18} /></span>
        Historial de precios
      </h3>
      <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold">Cambio total</p>
            <p className={`text-lg font-serif font-bold tabular-nums ${subio ? "text-red-600" : "text-emerald-600"}`}>
              {subio ? "+" : ""}{pctCambio.toFixed(1)}%
            </p>
          </div>
          <div className={`inline-flex items-center gap-1 text-xs font-semibold ${subio ? "text-red-600" : "text-emerald-600"}`}>
            {subio ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />}
            {ultimo.moneda} {Math.abs(diferencia).toLocaleString("es-AR")}
          </div>
        </div>

        <div className="flex items-end gap-2 h-20 mb-4" aria-hidden>
          {ordenado.map((h, i) => {
            const alto = ((h.valor - min) / rango) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <div
                  className="w-full bg-[var(--m2-ink)] rounded-sm transition-all"
                  style={{ height: `${Math.max(8, alto)}%` }}
                  title={`${h.moneda} ${h.valor.toLocaleString("es-AR")}`}
                />
              </div>
            );
          })}
        </div>

        <ul className="divide-y divide-[var(--m2-line)] text-sm">
          {ordenado.map((h, i) => {
            const anterior = i > 0 ? ordenado[i - 1] : null;
            const delta = anterior ? h.valor - anterior.valor : 0;
            return (
              <li key={i} className="flex items-center justify-between py-2">
                <span className="text-xs text-[var(--m2-muted)]">
                  {new Date(h.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                <span className="font-serif font-bold text-[var(--m2-ink)] tabular-nums">
                  {h.moneda} {h.valor.toLocaleString("es-AR")}
                </span>
                {anterior && delta !== 0 && (
                  <span className={`text-[11px] tabular-nums ${delta > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {delta > 0 ? "+" : ""}{delta.toLocaleString("es-AR")}
                  </span>
                )}
                {!anterior && <span className="text-[11px] text-[var(--m2-muted)]">Inicial</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
