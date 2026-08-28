"use client";

import { useMemo } from "react";
import { useAlerts } from "./AlertsProvider";
import { useAuth } from "./AuthProvider";
import { IconBell, IconMail, IconTrash } from "./Icon";
import { useToast } from "./ToastProvider";

export default function AlertsInbox() {
  const { usuario } = useAuth();
  const { alertas, borrar } = useAlerts();
  const { info } = useToast();

  const mias = useMemo(() => {
    if (!usuario) return [];
    if (usuario.rol === "admin") return alertas;
    return alertas.filter((a) => a.agenteSlug === usuario.slug);
  }, [alertas, usuario]);

  if (!usuario) return null;

  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[var(--m2-ink)]"><IconBell size={16} /></span>
          <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--m2-ink)]">
            Alertas de visitantes
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[var(--m2-muted)] font-semibold">
          {mias.length} activas
        </span>
      </div>

      {mias.length === 0 ? (
        <p className="text-center text-sm text-[var(--m2-muted)] py-6 border border-dashed border-[var(--m2-line)] rounded-sm">
          Sin alertas todavía. Los visitantes de tu micrositio pueden suscribirse a nuevas propiedades.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--m2-line)]">
          {mias.map((a) => (
            <li key={a.id} className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-serif font-semibold text-[var(--m2-ink)] truncate">{a.email}</p>
                <p className="text-[11px] text-[var(--m2-muted)] mt-0.5">
                  {a.operacion ?? "Cualquier operación"} · {a.tipo ?? "Cualquier tipo"}
                  {a.precioMax != null && ` · hasta USD ${a.precioMax.toLocaleString("es-AR")}`}
                  {a.dormitoriosMin != null && ` · ${a.dormitoriosMin}+ dorm`}
                </p>
                <p className="text-[10px] text-[var(--m2-muted)] mt-0.5">
                  {new Date(a.fecha).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`mailto:${a.email}`}
                  aria-label="Email"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-[var(--m2-ink)] border border-[var(--m2-line)]"
                >
                  <IconMail size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm(`¿Eliminar alerta de ${a.email}?`)) return;
                    borrar(a.id);
                    info("Alerta eliminada");
                  }}
                  aria-label="Eliminar"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[var(--m2-muted)] hover:text-red-700 border border-[var(--m2-line)]"
                >
                  <IconTrash size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
