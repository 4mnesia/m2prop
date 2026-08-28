"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Tema } from "../_lib/types";

const STORAGE_KEY = "m2prop_theme_v1";

type ThemeContextValue = {
  tema: Tema;
  alternar: () => void;
  setTema: (t: Tema) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTemaState] = useState<Tema>("light");

  useEffect(() => {
    const guardado = window.localStorage.getItem(STORAGE_KEY) as Tema | null;
    const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const inicial: Tema = guardado ?? (prefiereOscuro ? "dark" : "light");
    setTemaState(inicial);
    document.documentElement.setAttribute("data-theme", inicial);
  }, []);

  const setTema = useCallback((nuevo: Tema) => {
    setTemaState(nuevo);
    document.documentElement.setAttribute("data-theme", nuevo);
    window.localStorage.setItem(STORAGE_KEY, nuevo);
  }, []);

  const alternar = useCallback(() => {
    setTema(tema === "light" ? "dark" : "light");
  }, [tema, setTema]);

  const value = useMemo(() => ({ tema, alternar, setTema }), [tema, alternar, setTema]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
