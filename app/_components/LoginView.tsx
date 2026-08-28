"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { IconArrowLeft, IconArrowRight, IconLock, IconUser } from "./Icon";
import { Logo } from "./Logo";
import { useToast } from "./ToastProvider";

const DEMO = [
  { rol: "Admin", email: "admin@m2prop.com", password: "admin123" },
  { rol: "Agente Pro", email: "pro@demo.com", password: "pro123" },
  { rol: "Agente", email: "agente@demo.com", password: "agente123" },
];

export default function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next") || "/panel";
  const { iniciarSesion } = useAuth();
  const { exito, error: errorToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const res = iniciarSesion(email, password);
    setEnviando(false);
    if (!res.ok) {
      setError(res.error);
      errorToast("No pudimos ingresar", res.error);
      return;
    }
    exito("Bienvenido/a", `Sesión iniciada como ${res.usuario.nombre}`);
    router.push(nextUrl);
  };

  const usarDemo = (d: (typeof DEMO)[number]) => {
    setEmail(d.email);
    setPassword(d.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[var(--m2-bg)] animate-fade-in flex flex-col">
      <div className="max-w-md mx-auto w-full px-4 sm:px-6 pt-10 pb-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors duration-300"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
            <IconArrowLeft size={14} />
          </span>
          Volver al inicio
        </Link>
      </div>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex text-[var(--m2-ink)] mb-4">
              <Logo size={36} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--m2-ink)] mb-1">
              Ingresá a tu panel
            </h1>
            <p className="text-sm text-[var(--m2-muted)]">
              Gestioná tus fichas, tu marca y tus contactos.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8 space-y-5 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <div>
              <label htmlFor="email" className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m2-muted)]">
                  <IconUser size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm pl-10 pr-3 py-2.5 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)] transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-2">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m2-muted)]">
                  <IconLock size={16} />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm pl-10 pr-3 py-2.5 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)] transition-colors duration-200"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center justify-center gap-2 w-full bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] disabled:opacity-60 disabled:cursor-not-allowed text-[var(--m2-bg)] font-semibold text-xs py-3.5 rounded-sm transition-colors duration-300 tracking-wider"
            >
              {enviando ? "INGRESANDO…" : "INGRESAR"}
              {!enviando && <IconArrowRight size={14} />}
            </button>

            <p className="text-[11px] text-[var(--m2-muted)] text-center">
              ¿Todavía no sos agente M2Prop?{" "}
              <Link href="/#precios" className="underline underline-offset-2 hover:text-[var(--m2-ink)]">
                Contratá un paquete
              </Link>
            </p>
          </form>

          <div
            className="mt-6 bg-[var(--m2-surface)]/60 border border-dashed border-[var(--m2-line)] rounded-sm p-4 animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold mb-3">
              Credenciales demo
            </p>
            <ul className="space-y-2">
              {DEMO.map((d) => (
                <li key={d.email}>
                  <button
                    type="button"
                    onClick={() => usarDemo(d)}
                    className="w-full text-left flex items-center justify-between gap-3 text-xs px-3 py-2 rounded-sm hover:bg-[var(--m2-bg)] transition-colors duration-200"
                  >
                    <span className="font-semibold text-[var(--m2-ink)]">{d.rol}</span>
                    <span className="text-[var(--m2-muted)] font-mono text-[11px]">{d.email}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
