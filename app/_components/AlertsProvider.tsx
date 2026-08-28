"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Alerta } from "../_lib/types";

const STORAGE_KEY = "m2prop_alertas_v1";

const SEMILLA: Alerta[] = [
  {
    id: "a-seed-1",
    agenteSlug: "admin",
    email: "juan.perez@mail.com",
    operacion: "Venta",
    tipo: "Departamento",
    precioMax: 120000,
    dormitoriosMin: 2,
    fecha: new Date(Date.now() - 4 * 86400_000).toISOString(),
  },
];

type Ctx = {
  alertas: Alerta[];
  agregar: (a: Omit<Alerta, "id" | "fecha">) => void;
  borrar: (id: string) => void;
  paraAgente: (agenteSlug: string) => Alerta[];
};

const AlertsContext = createContext<Ctx | null>(null);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alertas, setAlertas] = useState<Alerta[]>(SEMILLA);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Alerta[];
        if (Array.isArray(parsed)) setAlertas(parsed);
      }
    } catch {}
  }, []);

  const persistir = useCallback((v: Alerta[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {}
  }, []);

  const agregar = useCallback<Ctx["agregar"]>(
    (a) => {
      setAlertas((prev) => {
        const nueva: Alerta = {
          ...a,
          id: `a-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fecha: new Date().toISOString(),
        };
        const lista = [nueva, ...prev];
        persistir(lista);
        return lista;
      });
    },
    [persistir],
  );

  const borrar = useCallback<Ctx["borrar"]>(
    (id) => {
      setAlertas((prev) => {
        const lista = prev.filter((x) => x.id !== id);
        persistir(lista);
        return lista;
      });
    },
    [persistir],
  );

  const paraAgente = useCallback(
    (agenteSlug: string) => alertas.filter((a) => a.agenteSlug === agenteSlug),
    [alertas],
  );

  const value = useMemo(
    () => ({ alertas, agregar, borrar, paraAgente }),
    [alertas, agregar, borrar, paraAgente],
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts debe usarse dentro de <AlertsProvider>");
  return ctx;
}
