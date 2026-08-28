"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Resena, TipoResena } from "../_lib/types";

const STORAGE_KEY = "m2prop_resenas_v1";

const SEMILLA: Resena[] = [
  {
    id: "r-seed-1",
    tipo: "agente",
    targetId: "u-1",
    autor: "María Fernández",
    calificacion: 5,
    comentario:
      "Nicolás vendió mi departamento en tiempo récord. Súper profesional y siempre disponible por WhatsApp.",
    fecha: "2026-05-14",
  },
  {
    id: "r-seed-2",
    tipo: "agente",
    targetId: "u-1",
    autor: "Ignacio Peralta",
    calificacion: 5,
    comentario: "La ficha web me pareció espectacular. Mis clientes me lo comentan siempre.",
    fecha: "2026-04-02",
  },
  {
    id: "r-seed-3",
    tipo: "propiedad",
    targetId: "M2-1024",
    autor: "Sofía Aguirre",
    calificacion: 4,
    comentario: "Muy buena ubicación y la fotos representan bien lo que uno se encuentra.",
    fecha: "2026-06-20",
  },
];

type ReviewsContextValue = {
  resenas: Resena[];
  agregar: (r: Omit<Resena, "id" | "fecha">) => void;
  borrar: (id: string) => void;
  paraTarget: (tipo: TipoResena, targetId: string) => Resena[];
  promedio: (tipo: TipoResena, targetId: string) => number;
  cargando: boolean;
};

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [resenas, setResenas] = useState<Resena[]>(SEMILLA);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Resena[];
        if (Array.isArray(parsed)) setResenas(parsed);
      }
    } catch {}
    setCargando(false);
  }, []);

  const persistir = useCallback((nuevas: Resena[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
    } catch {}
  }, []);

  const agregar = useCallback<ReviewsContextValue["agregar"]>(
    (r) => {
      setResenas((prev) => {
        const nueva: Resena = {
          ...r,
          id: `r-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fecha: new Date().toISOString().slice(0, 10),
          calificacion: Math.max(1, Math.min(5, Math.round(r.calificacion))),
        };
        const nuevas = [nueva, ...prev];
        persistir(nuevas);
        return nuevas;
      });
    },
    [persistir],
  );

  const borrar = useCallback<ReviewsContextValue["borrar"]>(
    (id) => {
      setResenas((prev) => {
        const nuevas = prev.filter((r) => r.id !== id);
        persistir(nuevas);
        return nuevas;
      });
    },
    [persistir],
  );

  const paraTarget = useCallback(
    (tipo: TipoResena, targetId: string) =>
      resenas.filter((r) => r.tipo === tipo && r.targetId === targetId),
    [resenas],
  );

  const promedio = useCallback(
    (tipo: TipoResena, targetId: string) => {
      const lista = resenas.filter((r) => r.tipo === tipo && r.targetId === targetId);
      if (lista.length === 0) return 0;
      const total = lista.reduce((acc, r) => acc + r.calificacion, 0);
      return total / lista.length;
    },
    [resenas],
  );

  const value = useMemo(
    () => ({ resenas, agregar, borrar, paraTarget, promedio, cargando }),
    [resenas, agregar, borrar, paraTarget, promedio, cargando],
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews debe usarse dentro de <ReviewsProvider>");
  return ctx;
}
