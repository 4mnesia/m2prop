"use client";

import { useState, type FormEvent } from "react";
import type { FiltroOperacion } from "../_lib/types";
import { useAlerts } from "./AlertsProvider";
import { IconBell } from "./Icon";
import { useToast } from "./ToastProvider";

type Props = {
  agenteSlug: string;
  tiposDisponibles: string[];
};

export default function AlertForm({ agenteSlug, tiposDisponibles }: Props) {
  const { agregar } = useAlerts();
  const { exito, info } = useToast();
  const [email, setEmail] = useState("");
  const [operacion, setOperacion] = useState<FiltroOperacion>("Todos");
  const [tipo, setTipo] = useState<string>("");
  const [precioMax, setPrecioMax] = useState<string>("");
  const [dormitoriosMin, setDormitoriosMin] = useState<string>("");
  const [enviado, setEnviado] = useState(false);

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      info("Email inválido", "Ingresá un email válido para recibir alertas");
      return;
    }
    agregar({
      agenteSlug,
      email: email.trim(),
      operacion: operacion === "Todos" ? undefined : operacion,
      tipo: tipo || undefined,
      precioMax: precioMax ? Number(precioMax) : undefined,
      dormitoriosMin: dormitoriosMin ? Number(dormitoriosMin) : undefined,
    });
    exito("Alerta creada", "Te avisaremos cuando aparezca una propiedad que encaje");
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="bg-[var(--m2-ink)] text-[var(--m2-bg)] rounded-sm p-6 text-center">
        <IconBell size={24} />
        <p className="font-serif font-bold text-lg mt-2">¡Alerta activa!</p>
        <p className="text-xs text-[var(--m2-line)]/80 mt-1">
          Te avisaremos por email cuando el asesor publique algo que coincida.
        </p>
        <button
          type="button"
          onClick={() => { setEnviado(false); setEmail(""); }}
          className="mt-4 text-[11px] uppercase tracking-widest font-semibold underline underline-offset-4"
        >
          Crear otra alerta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handle}
      className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8"
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-[var(--m2-ink)]"><IconBell size={20} /></span>
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--m2-ink)]">
            Alerta de nuevas propiedades
          </h3>
          <p className="text-xs text-[var(--m2-muted)] mt-1">
            Recibí un email cuando aparezca algo que encaje con tu búsqueda.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Campo label="Email" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
          />
        </Campo>
        <Campo label="Operación">
          <select
            value={operacion}
            onChange={(e) => setOperacion(e.target.value as FiltroOperacion)}
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
          >
            <option value="Todos">Todas</option>
            <option value="Venta">Venta</option>
            <option value="Alquiler">Alquiler</option>
          </select>
        </Campo>
        <Campo label="Tipo">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
          >
            <option value="">Cualquiera</option>
            {tiposDisponibles.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Precio máximo (USD)">
          <input
            type="number"
            min={0}
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="ej: 150000"
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
          />
        </Campo>
        <Campo label="Dormitorios mínimos">
          <input
            type="number"
            min={0}
            value={dormitoriosMin}
            onChange={(e) => setDormitoriosMin(e.target.value)}
            placeholder="ej: 2"
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-muted)]"
          />
        </Campo>
      </div>

      <button
        type="submit"
        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-semibold text-xs px-5 py-3 rounded-sm transition-colors tracking-widest uppercase"
      >
        <IconBell size={14} />
        Activar alerta
      </button>
    </form>
  );
}

function Campo({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] block mb-1">
        {label}{required && " *"}
      </span>
      {children}
    </label>
  );
}
