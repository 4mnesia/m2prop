"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { leerSesion, login as loginMock, logout as logoutMock, type ResultadoLogin } from "../_lib/auth";
import type { Usuario } from "../_lib/types";

type AuthContextValue = {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => ResultadoLogin;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setUsuario(leerSesion());
    setCargando(false);
  }, []);

  const iniciarSesion = useCallback((email: string, password: string) => {
    const res = loginMock(email, password);
    if (res.ok) setUsuario(res.usuario);
    return res;
  }, []);

  const cerrarSesion = useCallback(() => {
    logoutMock();
    setUsuario(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ usuario, cargando, iniciarSesion, cerrarSesion }),
    [usuario, cargando, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
