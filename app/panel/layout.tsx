"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../_components/AuthProvider";
import ControlBar from "../_components/ControlBar";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !usuario) {
      router.replace("/login?next=/panel");
    }
  }, [usuario, cargando, router]);

  return (
    <>
      <ControlBar />
      {cargando ? (
        <div className="min-h-[60vh] flex items-center justify-center text-sm text-[var(--m2-muted)] animate-fade-in">
          Cargando panel…
        </div>
      ) : usuario ? (
        <>{children}</>
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center text-sm text-[var(--m2-muted)] animate-fade-in">
          Redirigiendo al inicio de sesión…
        </div>
      )}
    </>
  );
}
