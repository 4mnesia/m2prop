"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Toast, ToastVariant } from "../_lib/types";
import { IconCheck } from "./Icon";

type ToastInput = Omit<Toast, "id">;

type ToastContextValue = {
  mostrar: (t: ToastInput) => string;
  descartar: (id: string) => void;
  exito: (titulo: string, descripcion?: string) => string;
  error: (titulo: string, descripcion?: string) => string;
  info: (titulo: string, descripcion?: string) => string;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DURACION_DEFAULT_MS = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const descartar = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (t: ToastInput) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const nuevo: Toast = { ...t, id, duracionMs: t.duracionMs ?? DURACION_DEFAULT_MS };
      setToasts((prev) => [...prev, nuevo]);
      window.setTimeout(() => descartar(id), nuevo.duracionMs);
      return id;
    },
    [descartar],
  );

  const helper = (variant: ToastVariant) => (titulo: string, descripcion?: string) =>
    mostrar({ variant, titulo, descripcion });

  const value = useMemo<ToastContextValue>(
    () => ({
      mostrar,
      descartar,
      exito: helper("success"),
      error: helper("error"),
      info: helper("info"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mostrar, descartar],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastList toasts={toasts} onCerrar={descartar} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

function ToastList({ toasts, onCerrar }: { toasts: Toast[]; onCerrar: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] sm:w-96 pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onCerrar={() => onCerrar(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onCerrar }: { toast: Toast; onCerrar: () => void }) {
  const paleta =
    toast.variant === "success"
      ? "bg-[var(--m2-ink)] text-[var(--m2-bg)] border-[var(--m2-ink)]"
      : toast.variant === "error"
        ? "bg-red-700 text-white border-red-800"
        : "bg-[var(--m2-surface)] text-[var(--m2-ink)] border-[var(--m2-line)]";

  return (
    <div
      role="status"
      className={`animate-toast-in pointer-events-auto border rounded-sm px-4 py-3 shadow-lg flex items-start gap-3 ${paleta}`}
    >
      {toast.variant === "success" && (
        <span className="shrink-0 mt-0.5 opacity-90">
          <IconCheck size={14} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{toast.titulo}</p>
        {toast.descripcion && <p className="text-xs opacity-80 mt-0.5">{toast.descripcion}</p>}
      </div>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar notificación"
        className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
