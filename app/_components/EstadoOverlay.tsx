"use client";

const COLORES: Record<string, { fondo: string; texto: string }> = {
  Reservada: { fondo: "bg-amber-500/95", texto: "text-white" },
  "Con seña": { fondo: "bg-orange-600/95", texto: "text-white" },
  Vendida: { fondo: "bg-emerald-700/95", texto: "text-white" },
  Alquilada: { fondo: "bg-indigo-700/95", texto: "text-white" },
  Pausada: { fondo: "bg-gray-700/90", texto: "text-white" },
};

type Props = {
  estado: string;
  tamanio?: "sm" | "md" | "lg";
};

export default function EstadoOverlay({ estado, tamanio = "md" }: Props) {
  if (!estado || estado === "Activa") return null;
  const color = COLORES[estado] ?? { fondo: "bg-[var(--m2-ink)]/95", texto: "text-white" };
  const size = tamanio === "lg" ? "text-lg px-6 py-2 tracking-[0.3em]"
    : tamanio === "sm" ? "text-[9px] px-2 py-0.5 tracking-widest"
    : "text-xs px-3 py-1 tracking-widest";

  return (
    <div className={`absolute top-3 left-3 ${color.fondo} ${color.texto} font-serif font-bold uppercase rounded-sm shadow ${size} backdrop-blur-sm`}>
      {estado}
    </div>
  );
}
