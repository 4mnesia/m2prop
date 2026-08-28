"use client";

import Link from "next/link";
import { use } from "react";
import { useProperties } from "../../../_components/PropertyProvider";
import PropertyEditor from "../../../_components/PropertyEditor";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { buscarPorId, cargando } = useProperties();
  const propiedad = buscarPorId(id);

  if (cargando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-[var(--m2-muted)] animate-fade-in">
        Cargando ficha…
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-sm text-[var(--m2-muted)] animate-fade-in">
        <p>No encontramos la ficha <span className="font-mono">{id}</span>.</p>
        <Link href="/panel" className="text-[var(--m2-ink)] underline underline-offset-2">
          Volver al panel
        </Link>
      </div>
    );
  }

  return <PropertyEditor propiedad={propiedad} />;
}
