"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { agentePorSlug } from "../../_lib/auth";
import MicrositioView from "../../_components/MicrositioView";
import { useProperties } from "../../_components/PropertyProvider";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { propiedades, cargando } = useProperties();
  const agente = useMemo(() => agentePorSlug(slug), [slug]);

  if (!agente) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-sm text-[var(--m2-muted)] animate-fade-in">
        <p>Micrositio no encontrado.</p>
        <Link href="/" className="text-[var(--m2-ink)] underline underline-offset-2">
          Ir al inicio
        </Link>
      </div>
    );
  }

  const propiedadesDelAgente =
    agente.rol === "admin" ? propiedades : propiedades.filter((p) => p.agenteId === agente.id);

  return <MicrositioView agente={agente} propiedades={propiedadesDelAgente} cargando={cargando} />;
}
