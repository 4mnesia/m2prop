"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PROPIEDADES_INICIALES } from "../_lib/data";
import type { Propiedad } from "../_lib/types";

const STORAGE_KEY = "m2prop_propiedades_v1";

type PropertyContextValue = {
  propiedades: Propiedad[];
  agregar: (p: Propiedad) => void;
  actualizar: (id: string, cambios: Partial<Propiedad>) => void;
  borrar: (id: string) => void;
  reemplazar: (todas: Propiedad[]) => void;
  buscarPorId: (id: string) => Propiedad | undefined;
  cargando: boolean;
};

const PropertyContext = createContext<PropertyContextValue | null>(null);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(PROPIEDADES_INICIALES);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Propiedad[];
        if (Array.isArray(parsed) && parsed.length > 0) setPropiedades(parsed);
      }
    } catch {}
    setCargando(false);
  }, []);

  const persistir = useCallback((nuevas: Propiedad[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
    } catch {}
  }, []);

  const agregar = useCallback(
    (p: Propiedad) => {
      setPropiedades((prev) => {
        const nuevas = [p, ...prev];
        persistir(nuevas);
        return nuevas;
      });
    },
    [persistir],
  );

  const actualizar = useCallback(
    (id: string, cambios: Partial<Propiedad>) => {
      setPropiedades((prev) => {
        const nuevas = prev.map((p) => (p.id === id ? { ...p, ...cambios } : p));
        persistir(nuevas);
        return nuevas;
      });
    },
    [persistir],
  );

  const borrar = useCallback(
    (id: string) => {
      setPropiedades((prev) => {
        const nuevas = prev.filter((p) => p.id !== id);
        persistir(nuevas);
        return nuevas;
      });
    },
    [persistir],
  );

  const reemplazar = useCallback(
    (todas: Propiedad[]) => {
      setPropiedades(todas);
      persistir(todas);
    },
    [persistir],
  );

  const buscarPorId = useCallback((id: string) => propiedades.find((p) => p.id === id), [propiedades]);

  const value = useMemo(
    () => ({ propiedades, agregar, actualizar, borrar, reemplazar, buscarPorId, cargando }),
    [propiedades, agregar, actualizar, borrar, reemplazar, buscarPorId, cargando],
  );

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
}

export function useProperties() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperties debe usarse dentro de <PropertyProvider>");
  return ctx;
}
