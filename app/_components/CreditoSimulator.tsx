"use client";

import { useMemo, useState } from "react";
import type { Propiedad } from "../_lib/types";
import { IconMoney } from "./Icon";

const TASA_CAMBIO_ARS = 1300;

function parsePrecio(p: Propiedad): { valor: number; moneda: "USD" | "ARS" } {
  if (p.precioValor && p.monedaPrecio) return { valor: p.precioValor, moneda: p.monedaPrecio };
  const match = p.precio.replace(/\./g, "").match(/(\d+)/);
  const valor = match ? Number(match[1]) : 0;
  const moneda: "USD" | "ARS" = /USD|U\$S/i.test(p.precio) ? "USD" : "ARS";
  return { valor, moneda };
}

function calcularCuota(capital: number, tasaAnualPct: number, meses: number): number {
  if (capital <= 0 || meses <= 0) return 0;
  const r = tasaAnualPct / 100 / 12;
  if (r === 0) return capital / meses;
  return (capital * r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

export default function CreditoSimulator({ propiedad }: { propiedad: Propiedad }) {
  const { valor, moneda } = parsePrecio(propiedad);
  const precioUSD = moneda === "USD" ? valor : Math.round(valor / TASA_CAMBIO_ARS);
  const precioARS = moneda === "ARS" ? valor : Math.round(valor * TASA_CAMBIO_ARS);

  const [anticipoPct, setAnticipoPct] = useState(30);
  const [plazoAnios, setPlazoAnios] = useState(20);
  const [tasaAnual, setTasaAnual] = useState(9);
  const [monedaVista, setMonedaVista] = useState<"USD" | "ARS">(moneda);

  const capital = useMemo(() => {
    const base = monedaVista === "USD" ? precioUSD : precioARS;
    return Math.max(0, Math.round(base * (1 - anticipoPct / 100)));
  }, [anticipoPct, monedaVista, precioARS, precioUSD]);

  const cuota = useMemo(() => calcularCuota(capital, tasaAnual, plazoAnios * 12), [capital, tasaAnual, plazoAnios]);

  const anticipoAbsoluto = Math.round((monedaVista === "USD" ? precioUSD : precioARS) * (anticipoPct / 100));
  const totalPagado = Math.round(cuota * plazoAnios * 12);
  const interesesPagados = totalPagado - capital;

  const formato = (n: number) => n.toLocaleString("es-AR");
  const simbolo = monedaVista === "USD" ? "USD " : "ARS $";

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[var(--m2-ink)]"><IconMoney size={16} /></span>
          <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--m2-ink)]">Simulador de crédito</h3>
        </div>
        <div className="flex items-center gap-0.5 border border-[var(--m2-line)] rounded-sm overflow-hidden">
          {(["USD", "ARS"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonedaVista(m)}
              className={`text-[10px] px-2 py-1 font-semibold tracking-widest uppercase transition-colors ${
                monedaVista === m ? "bg-[var(--m2-ink)] text-[var(--m2-bg)]" : "bg-transparent text-[var(--m2-muted)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold mb-1">Precio</p>
      <p className="text-xl font-serif font-bold text-[var(--m2-ink)] mb-4">
        {simbolo}{formato(monedaVista === "USD" ? precioUSD : precioARS)}
        <span className="text-[10px] text-[var(--m2-muted)] ml-2">
          (cambio ref. USD {TASA_CAMBIO_ARS.toLocaleString("es-AR")})
        </span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Slider label={`Anticipo · ${anticipoPct}%`} min={10} max={80} step={5} value={anticipoPct} onChange={setAnticipoPct} />
        <Slider label={`Plazo · ${plazoAnios} años`} min={5} max={30} step={1} value={plazoAnios} onChange={setPlazoAnios} />
        <Slider label={`Tasa · ${tasaAnual}% anual`} min={3} max={20} step={0.5} value={tasaAnual} onChange={setTasaAnual} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--m2-line)]">
        <Stat label="Anticipo" value={`${simbolo}${formato(anticipoAbsoluto)}`} />
        <Stat label="Capital financiado" value={`${simbolo}${formato(capital)}`} />
        <Stat label="Cuota estimada" value={`${simbolo}${formato(Math.round(cuota))}`} accent />
        <Stat label="Intereses totales" value={`${simbolo}${formato(interesesPagados)}`} />
      </div>

      <p className="text-[10px] text-[var(--m2-muted)] mt-3">
        Cálculo referencial (sistema francés). Consultá con el banco por condiciones reales.
      </p>
    </div>
  );
}

function Slider({
  label, min, max, step, value, onChange,
}: {
  label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold block mb-1">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--m2-ink)]"
      />
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-sm p-3 border ${accent ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]" : "bg-[var(--m2-bg)] border-[var(--m2-line)] text-[var(--m2-ink)]"}`}>
      <p className={`text-[9px] uppercase tracking-widest font-semibold mb-1 ${accent ? "text-[var(--m2-line)]/80" : "text-[var(--m2-muted)]"}`}>{label}</p>
      <p className="text-sm font-serif font-bold tabular-nums">{value}</p>
    </div>
  );
}
