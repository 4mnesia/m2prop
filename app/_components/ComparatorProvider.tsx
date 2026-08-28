"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "m2prop_comparador_v1";
const MAX_COMPARADOR = 4;

type ComparatorContextValue = {
  ids: string[];
  esta: (id: string) => boolean;
  alternar: (id: string) => { ok: boolean; motivo?: string };
  quitar: (id: string) => void;
  limpiar: () => void;
  lleno: boolean;
  max: number;
};

const ComparatorContext = createContext<ComparatorContextValue | null>(null);

export function ComparatorProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === "string").slice(0, MAX_COMPARADOR));
      }
    } catch {}
  }, []);

  const persistir = useCallback((lista: string[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {}
  }, []);

  const alternar = useCallback<ComparatorContextValue["alternar"]>(
    (id) => {
      let resultado: { ok: boolean; motivo?: string } = { ok: true };
      setIds((prev) => {
        if (prev.includes(id)) {
          const nueva = prev.filter((x) => x !== id);
          persistir(nueva);
          return nueva;
        }
        if (prev.length >= MAX_COMPARADOR) {
          resultado = { ok: false, motivo: `Máximo ${MAX_COMPARADOR} propiedades en comparación.` };
          return prev;
        }
        const nueva = [...prev, id];
        persistir(nueva);
        return nueva;
      });
      return resultado;
    },
    [persistir],
  );

  const quitar = useCallback(
    (id: string) => {
      setIds((prev) => {
        const nueva = prev.filter((x) => x !== id);
        persistir(nueva);
        return nueva;
      });
    },
    [persistir],
  );

  const limpiar = useCallback(() => {
    setIds([]);
    persistir([]);
  }, [persistir]);

  const esta = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, esta, alternar, quitar, limpiar, lleno: ids.length >= MAX_COMPARADOR, max: MAX_COMPARADOR }),
    [ids, esta, alternar, quitar, limpiar],
  );

  return <ComparatorContext.Provider value={value}>{children}</ComparatorContext.Provider>;
}

export function useComparator() {
  const ctx = useContext(ComparatorContext);
  if (!ctx) throw new Error("useComparator debe usarse dentro de <ComparatorProvider>");
  return ctx;
}
