"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Nota, Tarea } from "../_lib/types";

const STORAGE_NOTAS = "m2prop_notas_v1";
const STORAGE_TAREAS = "m2prop_tareas_v1";

const NOTAS_SEMILLA: Nota[] = [
  {
    id: "n-seed-1",
    propiedadId: "M2-1024",
    autorId: "u_admin",
    texto: "Dueño flexible en precio si se cierra antes de fin de mes.",
    fecha: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
];

const TAREAS_SEMILLA: Tarea[] = [
  {
    id: "t-seed-1",
    agenteId: "u_admin",
    propiedadId: "M2-1024",
    titulo: "Llamar al dueño para confirmar visita",
    vence: new Date(Date.now() + 2 * 86400_000).toISOString(),
    hecha: false,
    fecha: new Date().toISOString(),
  },
  {
    id: "t-seed-2",
    agenteId: "u_admin",
    titulo: "Subir fotos nuevas del PH",
    hecha: true,
    fecha: new Date(Date.now() - 6 * 86400_000).toISOString(),
  },
];

type Ctx = {
  notas: Nota[];
  tareas: Tarea[];
  agregarNota: (n: Omit<Nota, "id" | "fecha">) => void;
  borrarNota: (id: string) => void;
  notasDePropiedad: (propiedadId: string) => Nota[];
  agregarTarea: (t: Omit<Tarea, "id" | "fecha" | "hecha"> & { hecha?: boolean }) => void;
  actualizarTarea: (id: string, cambios: Partial<Tarea>) => void;
  alternarTarea: (id: string) => void;
  borrarTarea: (id: string) => void;
  tareasDeAgente: (agenteId: string) => Tarea[];
};

const NotesContext = createContext<Ctx | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notas, setNotas] = useState<Nota[]>(NOTAS_SEMILLA);
  const [tareas, setTareas] = useState<Tarea[]>(TAREAS_SEMILLA);

  useEffect(() => {
    try {
      const rawN = window.localStorage.getItem(STORAGE_NOTAS);
      if (rawN) {
        const p = JSON.parse(rawN) as Nota[];
        if (Array.isArray(p)) setNotas(p);
      }
      const rawT = window.localStorage.getItem(STORAGE_TAREAS);
      if (rawT) {
        const p = JSON.parse(rawT) as Tarea[];
        if (Array.isArray(p)) setTareas(p);
      }
    } catch {}
  }, []);

  const persistirNotas = useCallback((v: Nota[]) => {
    try {
      window.localStorage.setItem(STORAGE_NOTAS, JSON.stringify(v));
    } catch {}
  }, []);

  const persistirTareas = useCallback((v: Tarea[]) => {
    try {
      window.localStorage.setItem(STORAGE_TAREAS, JSON.stringify(v));
    } catch {}
  }, []);

  const agregarNota = useCallback<Ctx["agregarNota"]>(
    (n) => {
      setNotas((prev) => {
        const nueva: Nota = {
          ...n,
          id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fecha: new Date().toISOString(),
        };
        const lista = [nueva, ...prev];
        persistirNotas(lista);
        return lista;
      });
    },
    [persistirNotas],
  );

  const borrarNota = useCallback<Ctx["borrarNota"]>(
    (id) => {
      setNotas((prev) => {
        const lista = prev.filter((x) => x.id !== id);
        persistirNotas(lista);
        return lista;
      });
    },
    [persistirNotas],
  );

  const notasDePropiedad = useCallback(
    (propiedadId: string) => notas.filter((n) => n.propiedadId === propiedadId),
    [notas],
  );

  const agregarTarea = useCallback<Ctx["agregarTarea"]>(
    (t) => {
      setTareas((prev) => {
        const nueva: Tarea = {
          ...t,
          hecha: t.hecha ?? false,
          id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fecha: new Date().toISOString(),
        };
        const lista = [nueva, ...prev];
        persistirTareas(lista);
        return lista;
      });
    },
    [persistirTareas],
  );

  const actualizarTarea = useCallback<Ctx["actualizarTarea"]>(
    (id, cambios) => {
      setTareas((prev) => {
        const lista = prev.map((x) => (x.id === id ? { ...x, ...cambios } : x));
        persistirTareas(lista);
        return lista;
      });
    },
    [persistirTareas],
  );

  const alternarTarea = useCallback<Ctx["alternarTarea"]>(
    (id) => {
      setTareas((prev) => {
        const lista = prev.map((x) => (x.id === id ? { ...x, hecha: !x.hecha } : x));
        persistirTareas(lista);
        return lista;
      });
    },
    [persistirTareas],
  );

  const borrarTarea = useCallback<Ctx["borrarTarea"]>(
    (id) => {
      setTareas((prev) => {
        const lista = prev.filter((x) => x.id !== id);
        persistirTareas(lista);
        return lista;
      });
    },
    [persistirTareas],
  );

  const tareasDeAgente = useCallback(
    (agenteId: string) => tareas.filter((t) => t.agenteId === agenteId),
    [tareas],
  );

  const value = useMemo(
    () => ({
      notas,
      tareas,
      agregarNota,
      borrarNota,
      notasDePropiedad,
      agregarTarea,
      actualizarTarea,
      alternarTarea,
      borrarTarea,
      tareasDeAgente,
    }),
    [
      notas,
      tareas,
      agregarNota,
      borrarNota,
      notasDePropiedad,
      agregarTarea,
      actualizarTarea,
      alternarTarea,
      borrarTarea,
      tareasDeAgente,
    ],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes debe usarse dentro de <NotesProvider>");
  return ctx;
}
