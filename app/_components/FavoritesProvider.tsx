"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "m2prop_favoritos_v1";

type FavoritesContextValue = {
  favoritos: string[];
  esFavorito: (id: string) => boolean;
  alternar: (id: string) => void;
  limpiar: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavoritos(parsed.filter((x) => typeof x === "string"));
      }
    } catch {}
  }, []);

  const persistir = useCallback((lista: string[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {}
  }, []);

  const alternar = useCallback(
    (id: string) => {
      setFavoritos((prev) => {
        const nueva = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        persistir(nueva);
        return nueva;
      });
    },
    [persistir],
  );

  const limpiar = useCallback(() => {
    setFavoritos([]);
    persistir([]);
  }, [persistir]);

  const esFavorito = useCallback((id: string) => favoritos.includes(id), [favoritos]);

  const value = useMemo(
    () => ({ favoritos, esFavorito, alternar, limpiar }),
    [favoritos, esFavorito, alternar, limpiar],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
