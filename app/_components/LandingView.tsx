"use client";

import Link from "next/link";
import { useState } from "react";
import { FAQS, PAQUETES, TESTIMONIOS } from "../_lib/data";
import { linkWhatsApp } from "../_lib/whatsapp";
import { useAuth } from "./AuthProvider";
import CasosExito from "./CasosExito";
import { IconArrowRight, IconCheck, IconLayout, IconMail, IconPin, IconStar, IconUser, IconWhatsApp } from "./Icon";
import LandingHeader from "./LandingHeader";
import { Logo } from "./Logo";

const PASOS = [
  {
    num: "01",
    titulo: "Elegí tu paquete",
    desc: "Seleccioná la cantidad de propiedades que necesitás (15, 30 o 50) y me escribís por WhatsApp.",
  },
  {
    num: "02",
    titulo: "Mandame los links",
    desc: "Pegá los enlaces de ZonaProp o MercadoLibre de las propiedades que querés rebrandear.",
  },
  {
    num: "03",
    titulo: "Recibí tus fichas",
    desc: "En 24-48 hs te envío los links personalizados con tu foto, WhatsApp y marca listos para compartir.",
  },
];

export default function LandingView() {
  const { usuario } = useAuth();
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  return (
    <div id="top" className="min-h-screen bg-[var(--m2-bg)]">
      <LandingHeader />

      {/* Hero */}
      <section className="relative h-[560px] sm:h-[640px] md:h-[720px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
          alt="Propiedad premium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--m2-ink)]/85 via-[var(--m2-ink)]/55 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[var(--m2-line)] font-semibold animate-fade-up">
              Para agentes inmobiliarios
            </span>
            <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-serif font-bold text-[var(--m2-bg)] leading-[1.05] animate-fade-up delay-100">
              Tu nueva forma de mostrar propiedades{" "}
              <span className="italic text-[var(--m2-line)]">Evolucionó</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[var(--m2-line)]/90 leading-relaxed max-w-lg animate-fade-up delay-200">
              Fichas web con tu marca, listas para WhatsApp e Instagram. Importá de ZonaProp o MercadoLibre en minutos.
              Dejá de mandar clientes al portal de tu competencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 animate-fade-up delay-300">
              <a
                href="#precios"
                className="inline-flex items-center justify-center gap-2 bg-[var(--m2-bg)] hover:bg-[var(--m2-line)] text-[var(--m2-ink)] font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm transition-colors duration-300 text-xs sm:text-sm tracking-wide"
              >
                VER PAQUETES
                <IconArrowRight size={14} />
              </a>
              <Link
                href="/a/nicolas-marquez"
                className="group inline-flex items-center justify-center gap-2 border border-[var(--m2-bg)]/40 hover:border-[var(--m2-bg)] hover:bg-[var(--m2-bg)]/5 text-[var(--m2-bg)] font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm transition-colors duration-300 text-xs sm:text-sm tracking-wide"
              >
                Ver demo en vivo
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  <IconArrowRight size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">
            Proceso simple
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-ink)] mt-3 mb-4">
            Cómo funciona
          </h2>
          <p className="text-[var(--m2-muted)] text-sm sm:text-base max-w-xl mx-auto">
            3 pasos simples para tener tus fichas profesionales
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {PASOS.map((paso, i) => (
            <div
              key={paso.num}
              style={{ animationDelay: `${i * 120}ms` }}
              className="bg-[var(--m2-surface)] p-8 sm:p-10 rounded-sm border border-[var(--m2-line)] hover:border-[var(--m2-muted)] hover-lift group animate-fade-up"
            >
              <div className="text-4xl sm:text-5xl font-serif font-bold text-[var(--m2-line)] group-hover:text-[var(--m2-muted)] transition-colors duration-500 mb-4 sm:mb-6">
                {paso.num}
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--m2-ink)] mb-2 sm:mb-3">
                {paso.titulo}
              </h3>
              <p className="text-sm text-[var(--m2-muted)] leading-relaxed">{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Casos de éxito antes/después */}
      <CasosExito />

      {/* Testimonios */}
      <section className="bg-[var(--m2-surface)] py-16 sm:py-24 border-y border-[var(--m2-line)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">
              Lo que dicen los agentes
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-ink)] mt-3 mb-4">
              Confianza que se traduce en ventas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {TESTIMONIOS.map((t, i) => (
              <blockquote
                key={t.id}
                style={{ animationDelay: `${i * 120}ms` }}
                className="bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8 hover:border-[var(--m2-muted)] transition-colors duration-500 animate-fade-up hover-lift"
              >
                <div className="flex items-center gap-1 mb-4 text-[var(--m2-muted)]">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <IconStar key={idx} size={14} />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-[var(--m2-ink)] leading-relaxed italic mb-6">
                  “{t.texto}”
                </p>
                <footer className="flex items-center gap-3">
                  <img
                    src={t.fotoUrl}
                    alt={t.nombre}
                    className="w-11 h-11 rounded-full object-cover border border-[var(--m2-line)]"
                  />
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-sm text-[var(--m2-ink)] truncate">{t.nombre}</p>
                    <p className="text-[11px] text-[var(--m2-muted)] truncate">
                      {t.cargo} · {t.inmobiliaria}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="bg-[var(--m2-ink)] py-16 sm:py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">
              Inversión
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-bg)] mt-3 mb-4">
              Paquetes a tu medida
            </h2>
            <p className="text-[var(--m2-line)]/70 text-sm sm:text-base max-w-xl mx-auto">
              Pago único. Sin suscripciones mensuales. Sin letra chica.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {PAQUETES.map((paq, i) => (
              <div
                key={paq.nombre}
                style={{ animationDelay: `${i * 120}ms` }}
                className={`rounded-sm p-8 sm:p-10 flex flex-col transition-all duration-500 hover-lift animate-fade-up ${
                  paq.destacado
                    ? "bg-[var(--m2-muted)] border-2 border-[var(--m2-bg)]/20 relative md:-translate-y-2"
                    : "bg-[var(--m2-bg)]/5 border border-[var(--m2-bg)]/10 hover:border-[var(--m2-muted)]"
                }`}
              >
                {paq.destacado && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--m2-bg)] text-[var(--m2-ink)] text-[10px] font-bold px-4 py-1 rounded-sm uppercase tracking-widest">
                    Más elegido
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 text-[var(--m2-bg)]">{paq.nombre}</h3>
                <div className="text-4xl sm:text-5xl font-serif font-bold mb-2 text-[var(--m2-bg)]">{paq.precio}</div>
                <p className={`text-xs mb-6 sm:mb-8 ${paq.destacado ? "text-[var(--m2-bg)]/70" : "text-[var(--m2-line)]/60"}`}>
                  {paq.propiedades} propiedades • Pago único
                </p>
                <ul className="space-y-3 text-sm mb-8 sm:mb-10 flex-1">
                  {paq.beneficios.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-3 ${paq.destacado ? "text-[var(--m2-bg)]/90" : "text-[var(--m2-line)]/80"}`}
                    >
                      <span className="mt-0.5 shrink-0 text-[var(--m2-bg)]">
                        <IconCheck size={14} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={linkWhatsApp(
                    `Hola Nicolás, quiero contratar el Paquete ${paq.nombre} (${paq.propiedades} propiedades) por ${paq.precio}`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-2 w-full font-semibold py-3.5 sm:py-4 rounded-sm transition-colors duration-300 text-xs sm:text-sm tracking-wide ${
                    paq.destacado
                      ? "bg-[var(--m2-bg)] text-[var(--m2-ink)] hover:bg-[var(--m2-line)]"
                      : "bg-[var(--m2-bg)]/10 text-[var(--m2-bg)] hover:bg-[var(--m2-bg)]/20 border border-[var(--m2-bg)]/20"
                  }`}
                >
                  <IconWhatsApp size={14} />
                  CONTRATAR
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">Dudas</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-ink)] mt-3 mb-4">
            Preguntas frecuentes
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const abierta = faqAbierta === i;
            return (
              <div
                key={faq.pregunta}
                className="bg-[var(--m2-surface)] rounded-sm border border-[var(--m2-line)] overflow-hidden transition-colors duration-300 hover:border-[var(--m2-muted)]/60"
              >
                <button
                  onClick={() => setFaqAbierta(abierta ? null : i)}
                  aria-expanded={abierta}
                  className="w-full px-5 sm:px-8 py-4 sm:py-5 text-left flex justify-between items-center hover:bg-[var(--m2-bg)] transition-colors duration-200"
                >
                  <span className="font-serif font-semibold text-[var(--m2-ink)] text-sm sm:text-base">
                    {faq.pregunta}
                  </span>
                  <span
                    className={`text-[var(--m2-muted)] text-xl ml-4 font-serif transition-transform duration-300 ${abierta ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-400 ease-out ${abierta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-8 pb-5 text-sm text-[var(--m2-muted)] leading-relaxed border-t border-[var(--m2-line)] pt-4">
                      {faq.respuesta}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative h-[360px] sm:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80"
          alt="Interior elegante"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--m2-ink)]/75" />
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--m2-bg)] mb-4">
            Empezá a captar clientes para vos
          </h2>
          <p className="text-[var(--m2-line)]/90 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl">
            Escribime por WhatsApp, elegí tu paquete y en 24-48 horas tenés tus fichas listas para compartir.
          </p>
          <a
            href={linkWhatsApp("Hola Nicolás, quiero contratar el servicio de fichas inmobiliarias")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--m2-bg)] hover:bg-[var(--m2-line)] text-[var(--m2-ink)] font-semibold px-8 sm:px-10 py-3.5 sm:py-4 rounded-sm transition-colors duration-300 text-xs sm:text-sm tracking-widest"
          >
            <IconWhatsApp size={16} />
            ESCRIBIR POR WHATSAPP
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--m2-ink)] text-[var(--m2-line)]/70 pt-16 sm:pt-20 border-t border-[var(--m2-muted)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Auth CTA band */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center bg-[var(--m2-bg)]/[0.04] border border-[var(--m2-bg)]/10 rounded-sm p-6 sm:p-8 mb-14 sm:mb-16">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-line)]/60 font-semibold mb-2">
                {usuario ? "Tu cuenta" : "Empezá hoy"}
              </p>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-bg)] leading-tight">
                {usuario
                  ? `Seguí trabajando, ${usuario.nombre.split(" ")[0]}.`
                  : "Sumate a los agentes que ya usan M2Prop."}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {usuario ? (
                <Link
                  href="/panel"
                  className="group inline-flex items-center gap-2 bg-[var(--m2-bg)] hover:bg-[var(--m2-line)] text-[var(--m2-ink)] font-semibold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-sm transition-colors duration-300 tracking-wide"
                >
                  <IconLayout size={14} />
                  <span>Ir al panel</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    <IconArrowRight size={14} />
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--m2-bg)] hover:text-[var(--m2-line)] transition-colors duration-300 px-3 py-2.5 rounded-sm"
                  >
                    <IconUser size={14} />
                    <span>Iniciar sesión</span>
                  </Link>
                  <a
                    href="#precios"
                    className="group inline-flex items-center gap-2 bg-[var(--m2-bg)] hover:bg-[var(--m2-line)] text-[var(--m2-ink)] font-semibold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-sm transition-colors duration-300 tracking-wide"
                  >
                    <span>Registrate</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      <IconArrowRight size={14} />
                    </span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Info columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 pb-12 sm:pb-14">
            <div className="md:col-span-2">
              <div className="text-[var(--m2-bg)] mb-4">
                <Logo size={32} />
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Fichas inmobiliarias profesionales con tu marca. Importás desde ZonaProp o MercadoLibre y compartís por WhatsApp.
              </p>
            </div>

            <div>
              <h4 className="font-serif font-bold text-[var(--m2-bg)] mb-4 text-[11px] uppercase tracking-[0.22em]">
                Contacto
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={linkWhatsApp("Hola Nicolás, quiero consultar sobre M2Prop")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[var(--m2-bg)] transition-colors duration-200"
                  >
                    <IconWhatsApp size={14} />
                    +54 9 3804 251846
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:nicommarquez@gmail.com"
                    className="inline-flex items-center gap-2 hover:text-[var(--m2-bg)] transition-colors duration-200"
                  >
                    <IconMail size={14} />
                    nicommarquez@gmail.com
                  </a>
                </li>
                <li className="inline-flex items-center gap-2">
                  <IconPin size={14} />
                  Córdoba, Argentina
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-[var(--m2-bg)] mb-4 text-[11px] uppercase tracking-[0.22em]">
                Servicio
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="inline-flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--m2-bg)]/70">
                    <IconCheck size={14} />
                  </span>
                  Pago único, sin suscripción
                </li>
                <li className="inline-flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--m2-bg)]/70">
                    <IconCheck size={14} />
                  </span>
                  Entrega en 24-48 horas
                </li>
                <li className="inline-flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--m2-bg)]/70">
                    <IconCheck size={14} />
                  </span>
                  Fichas sin vencimiento
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[var(--m2-muted)]/20 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--m2-line)]/50">
            <p>© 2026 M2Prop · Nicolás Márquez Casali</p>
            <p className="text-[10px] uppercase tracking-[0.22em]">Hecho en Argentina</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
