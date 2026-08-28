"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { EstadoLead, Lead } from "../_lib/types";

const STORAGE_KEY = "m2prop_leads_v1";

const SEMILLA: Lead[] = [
  {
    id: "l-seed-1",
    agenteId: "u_admin",
    propiedadId: "M2-1024",
    nombre: "Camila Ríos",
    contacto: "+54 351 555 0121",
    canal: "whatsapp",
    mensaje: "Hola, me interesa coordinar visita este sábado.",
    estado: "nuevo",
    fecha: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
  {
    id: "l-seed-2",
    agenteId: "u_admin",
    propiedadId: "M2-1025",
    nombre: "Diego Suárez",
    contacto: "diego.suarez@mail.com",
    canal: "email",
    mensaje: "Quisiera saber si acepta permuta.",
    estado: "contactado",
    fecha: new Date(Date.now() - 5 * 86400_000).toISOString(),
    notas: "Interesado en permuta, revisar antes de llamar.",
  },
  {
    id: "l-seed-3",
    agenteId: "u_pro",
    propiedadId: "M2-1027",
    nombre: "Sofía Aguirre",
    contacto: "+54 351 555 0133",
    canal: "whatsapp",
    estado: "visito",
    fecha: new Date(Date.now() - 7 * 86400_000).toISOString(),
    notas: "Visitó el jueves, muy interesada, evalúa financiación.",
  },
];

type Ctx = {
  leads: Lead[];
  agregar: (l: Omit<Lead, "id" | "fecha" | "estado"> & { estado?: EstadoLead }) => void;
  actualizar: (id: string, cambios: Partial<Lead>) => void;
  borrar: (id: string) => void;
  paraAgente: (agenteId: string) => Lead[];
};

const LeadsContext = createContext<Ctx | null>(null);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEMILLA);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Lead[];
        if (Array.isArray(parsed)) setLeads(parsed);
      }
    } catch {}
  }, []);

  const persistir = useCallback((v: Lead[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {}
  }, []);

  const agregar = useCallback<Ctx["agregar"]>(
    (l) => {
      setLeads((prev) => {
        const nuevo: Lead = {
          ...l,
          id: `l-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fecha: new Date().toISOString(),
          estado: l.estado ?? "nuevo",
        };
        const nueva = [nuevo, ...prev];
        persistir(nueva);
        return nueva;
      });
    },
    [persistir],
  );

  const actualizar = useCallback<Ctx["actualizar"]>(
    (id, cambios) => {
      setLeads((prev) => {
        const nueva = prev.map((x) => (x.id === id ? { ...x, ...cambios } : x));
        persistir(nueva);
        return nueva;
      });
    },
    [persistir],
  );

  const borrar = useCallback<Ctx["borrar"]>(
    (id) => {
      setLeads((prev) => {
        const nueva = prev.filter((x) => x.id !== id);
        persistir(nueva);
        return nueva;
      });
    },
    [persistir],
  );

  const paraAgente = useCallback(
    (agenteId: string) => leads.filter((l) => l.agenteId === agenteId),
    [leads],
  );

  const value = useMemo(
    () => ({ leads, agregar, actualizar, borrar, paraAgente }),
    [leads, agregar, actualizar, borrar, paraAgente],
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads debe usarse dentro de <LeadsProvider>");
  return ctx;
}

export const ETIQUETAS_ESTADO_LEAD: Record<EstadoLead, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  visito: "Visitó",
  oferto: "Ofertó",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

export const COLORES_ESTADO_LEAD: Record<EstadoLead, string> = {
  nuevo: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  contactado: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  visito: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  oferto: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  cerrado: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  perdido: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};
