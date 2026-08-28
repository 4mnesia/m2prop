"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Visita } from "../_lib/types";

const STORAGE_KEY = "m2prop_agenda_v1";

const SEMILLA: Visita[] = [
  {
    id: "v-seed-1",
    agenteId: "u_admin",
    propiedadId: "M2-1024",
    cliente: "Camila Ríos",
    fechaHora: new Date(Date.now() + 2 * 86400_000).toISOString(),
    duracionMin: 45,
    notas: "Confirmar 1h antes.",
  },
  {
    id: "v-seed-2",
    agenteId: "u_admin",
    propiedadId: "M2-1025",
    cliente: "Diego Suárez",
    fechaHora: new Date(Date.now() + 4 * 86400_000).toISOString(),
    duracionMin: 30,
  },
];

type Ctx = {
  visitas: Visita[];
  agregar: (v: Omit<Visita, "id">) => void;
  actualizar: (id: string, cambios: Partial<Visita>) => void;
  borrar: (id: string) => void;
  paraAgente: (agenteId: string) => Visita[];
};

const AgendaContext = createContext<Ctx | null>(null);

export function AgendaProvider({ children }: { children: React.ReactNode }) {
  const [visitas, setVisitas] = useState<Visita[]>(SEMILLA);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Visita[];
        if (Array.isArray(parsed)) setVisitas(parsed);
      }
    } catch {}
  }, []);

  const persistir = useCallback((v: Visita[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {}
  }, []);

  const agregar = useCallback<Ctx["agregar"]>(
    (v) => {
      setVisitas((prev) => {
        const nueva: Visita = {
          ...v,
          id: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        };
        const lista = [nueva, ...prev].sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));
        persistir(lista);
        return lista;
      });
    },
    [persistir],
  );

  const actualizar = useCallback<Ctx["actualizar"]>(
    (id, cambios) => {
      setVisitas((prev) => {
        const lista = prev
          .map((x) => (x.id === id ? { ...x, ...cambios } : x))
          .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));
        persistir(lista);
        return lista;
      });
    },
    [persistir],
  );

  const borrar = useCallback<Ctx["borrar"]>(
    (id) => {
      setVisitas((prev) => {
        const lista = prev.filter((x) => x.id !== id);
        persistir(lista);
        return lista;
      });
    },
    [persistir],
  );

  const paraAgente = useCallback(
    (agenteId: string) => visitas.filter((v) => v.agenteId === agenteId),
    [visitas],
  );

  const value = useMemo(
    () => ({ visitas, agregar, actualizar, borrar, paraAgente }),
    [visitas, agregar, actualizar, borrar, paraAgente],
  );

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
}

export function useAgenda() {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error("useAgenda debe usarse dentro de <AgendaProvider>");
  return ctx;
}
