"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { agentePorSlug } from "../../../_lib/auth";
import DetalleView from "../../../_components/DetalleView";
import { useProperties } from "../../../_components/PropertyProvider";
import SeoHead from "../../../_components/SeoHead";

export default function Page({ params }: { params: Promise<{ slug: string; propId: string }> }) {
  const { slug, propId } = use(params);
  const { buscarPorId, cargando } = useProperties();
  const agente = useMemo(() => agentePorSlug(slug), [slug]);
  const propiedad = buscarPorId(propId);

  if (cargando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-[var(--m2-muted)] animate-fade-in">
        Cargando ficha…
      </div>
    );
  }

  if (!agente || !propiedad) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-sm text-[var(--m2-muted)] animate-fade-in">
        <p>Ficha o agente no encontrado.</p>
        <Link href={`/a/${slug}`} className="text-[var(--m2-ink)] underline underline-offset-2">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const seoTitle = propiedad.seoTitle?.trim() || `${propiedad.titulo} · ${propiedad.precio} · ${agente.nombre}`;
  const seoDesc = propiedad.seoDescription?.trim() || propiedad.descripcion.slice(0, 160);

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        imagen={propiedad.imagenes[0]}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />
      <DetalleView propiedad={propiedad} agente={agente} />
    </>
  );
}
