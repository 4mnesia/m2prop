"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import { IconArrowRight, IconChart, IconGlobe, IconPlus, IconStar } from "./Icon";

const STORAGE_KEY = "m2prop_onboarding_v1";

type Paso = {
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
};

const PASOS: Paso[] = [
  {
    titulo: "Bienvenido a tu panel M2",
    descripcion:
      "Este es tu centro de mando: acá vas a crear, editar y compartir las fichas que tus clientes verán en tu micrositio.",
    icono: <IconStar size={22} />,
  },
  {
    titulo: "Cargá tu primera ficha",
    descripcion:
      "Usá el botón «Nueva ficha» o pegá el link de ZonaProp/MercadoLibre para importar una propiedad en segundos.",
    icono: <IconPlus size={22} />,
  },
  {
    titulo: "Personalizá tu perfil",
    descripcion:
      "Subí tu foto, definí tus colores de marca y ajustá tu slug. Todo eso se refleja en vivo en tu micrositio público.",
    icono: <IconGlobe size={22} />,
  },
  {
    titulo: "Medí tus resultados",
    descripcion:
      "Cada ficha registra visitas y consultas por WhatsApp. Los planes Pro y Admin ven el detalle completo en analytics.",
    icono: <IconChart size={22} />,
  },
];

export default function OnboardingTour() {
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visto = window.localStorage.getItem(STORAGE_KEY);
    if (!visto) setAbierto(true);
  }, []);

  const cerrar = () => {
    setAbierto(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
  };

  const siguiente = () => {
    if (paso < PASOS.length - 1) {
      setPaso((p) => p + 1);
    } else {
      cerrar();
    }
  };

  const actual = PASOS[paso];
  const esUltimo = paso === PASOS.length - 1;

  return (
    <Modal abierto={abierto} onCerrar={cerrar} size="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <span className="w-14 h-14 rounded-full bg-[var(--m2-ink)] text-[var(--m2-bg)] flex items-center justify-center">
          {actual.icono}
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold mb-2">
            Paso {paso + 1} de {PASOS.length}
          </p>
          <h3 className="font-serif font-bold text-xl text-[var(--m2-ink)]">{actual.titulo}</h3>
          <p className="text-sm text-[var(--m2-muted)] mt-3 leading-relaxed">{actual.descripcion}</p>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {PASOS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === paso ? "w-6 bg-[var(--m2-ink)]" : "w-1.5 bg-[var(--m2-line)]"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between w-full mt-4 gap-3">
          <button
            type="button"
            onClick={cerrar}
            className="text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors"
          >
            Saltar tour
          </button>
          <button
            type="button"
            onClick={siguiente}
            className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-5 py-2.5 rounded-sm transition-colors"
          >
            {esUltimo ? "Empezar" : "Siguiente"}
            <IconArrowRight size={12} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
