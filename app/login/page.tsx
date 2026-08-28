import { Suspense } from "react";
import LoginView from "../_components/LoginView";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm text-[var(--m2-muted)] animate-fade-in">
          Cargando…
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}
