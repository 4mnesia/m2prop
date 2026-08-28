"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ETIQUETAS_ROL, limitePropiedades, listarAgentes } from "../_lib/auth";
import type { Propiedad, Rol } from "../_lib/types";
import { linkWhatsApp } from "../_lib/whatsapp";
import { useAuth } from "./AuthProvider";
import FiltrosAvanzados, { FILTROS_INICIAL, aplicarFiltros, type EstadoFiltros } from "./FiltrosAvanzados";
import { IconArrowRight, IconChart, IconCopy, IconEdit, IconGlobe, IconPlus, IconStar, IconTrash, IconUser, IconWhatsApp } from "./Icon";
import AgendaPanel from "./AgendaPanel";
import AlertsInbox from "./AlertsInbox";
import LeadsPanel from "./LeadsPanel";
import TareasPanel from "./TareasPanel";
import OnboardingTour from "./OnboardingTour";
import { useProperties } from "./PropertyProvider";
import ShareMicrositio from "./ShareMicrositio";
import { useToast } from "./ToastProvider";

const IMPORT_DEMO_DELAY_MS = 1200;

export default function DashboardView() {
  const { usuario } = useAuth();
  const { propiedades, agregar, borrar } = useProperties();
  const { exito, info } = useToast();
  const [linkImportar, setLinkImportar] = useState("");
  const [cargandoImport, setCargandoImport] = useState(false);
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIAL);

  const misPropiedades = useMemo(() => {
    if (!usuario) return [];
    if (usuario.rol === "admin") return propiedades;
    return propiedades.filter((p) => p.agenteId === usuario.id);
  }, [propiedades, usuario]);

  const filtradas = useMemo(() => aplicarFiltros(misPropiedades, filtros), [misPropiedades, filtros]);

  const agentesGestionados = useMemo(
    () => listarAgentes().filter((a) => a.rol !== "admin"),
    [],
  );

  if (!usuario) return null;

  const limite = limitePropiedades(usuario.rol);
  const usados = misPropiedades.length;
  const restantes = limite === Infinity ? Infinity : Math.max(0, limite - usados);
  const alcanzoLimite = restantes === 0;
  const porcentaje = limite === Infinity ? 0 : Math.min(100, (usados / limite) * 100);

  const totalVisitas = misPropiedades.reduce((acc, p) => acc + (p.visitas ?? 0), 0);
  const activas = misPropiedades.filter((p) => p.estado === "Activa").length;

  const handleImport = async (e: FormEvent) => {
    e.preventDefault();
    if (!linkImportar || alcanzoLimite) return;
    setCargandoImport(true);
    await new Promise<void>((resolve) => setTimeout(resolve, IMPORT_DEMO_DELAY_MS));
    const nueva: Propiedad = {
      id: `M2-${Math.floor(1000 + Math.random() * 9000)}`,
      titulo: "Propiedad Importada (Demo)",
      ubicacion: "Córdoba, Argentina",
      precio: "USD 150.000",
      precioValor: 150000,
      monedaPrecio: "USD",
      operacion: "Venta",
      tipo: "Departamento",
      m2Totales: 75,
      m2Cubiertos: 65,
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      cocheras: 1,
      antiguedad: "3 años",
      descripcion:
        "Propiedad de ejemplo importada desde el portal. En la versión final, los datos se extraen automáticamente del link que pegues.",
      origen: linkImportar.includes("mercadolibre") ? "MercadoLibre" : "ZonaProp",
      visitas: 1,
      estado: "Activa",
      agenteId: usuario.id,
      fechaAlta: new Date().toISOString().slice(0, 10),
      imagenes: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      ],
    };
    agregar(nueva);
    exito("Ficha importada", `${nueva.id} · ${nueva.titulo}`);
    setLinkImportar("");
    setCargandoImport(false);
  };

  const handleEliminar = (p: Propiedad) => {
    if (!confirm(`¿Eliminar la ficha ${p.id}?`)) return;
    borrar(p.id);
    info("Ficha eliminada", p.titulo);
  };

  const handleDuplicar = (p: Propiedad) => {
    if (alcanzoLimite) {
      info("Alcanzaste el límite", "Eliminá una ficha o subí de plan");
      return;
    }
    const clon: Propiedad = {
      ...p,
      id: `M2-${Math.floor(1000 + Math.random() * 9000)}`,
      titulo: `${p.titulo} (copia)`,
      visitas: 0,
      fechaAlta: new Date().toISOString().slice(0, 10),
    };
    agregar(clon);
    exito("Ficha duplicada", `${clon.id} · lista para editar`);
  };

  const mostrarAnalytics = usuario.rol === "agente_pro" || usuario.rol === "admin";
  const mostrarGestionAgentes = usuario.rol === "admin";
  const mostrarUpgrade = usuario.rol === "agente";

  return (
    <div className="min-h-screen bg-[var(--m2-bg)] px-4 sm:px-6 md:px-8 py-6 sm:py-10 animate-fade-in">
      <OnboardingTour />
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div className="flex items-center gap-4">
            {usuario.fotoUrl ? (
              <img src={usuario.fotoUrl} alt={usuario.nombre} className="w-14 h-14 rounded-full object-cover border border-[var(--m2-line)]" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[var(--m2-line)] flex items-center justify-center text-[var(--m2-ink)] font-serif font-bold">
                {usuario.avatarIniciales}
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--m2-muted)] font-semibold">
                Hola de nuevo
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--m2-ink)] mt-1 leading-none">
                {usuario.nombre.split(" ")[0]}
              </h1>
              <p className="text-[var(--m2-muted)] text-sm mt-1">
                {usuario.inmobiliaria} ·{" "}
                <span className="text-[var(--m2-ink)] font-semibold">{ETIQUETAS_ROL[usuario.rol]}</span>
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold mb-1">Plan</p>
            <p className="text-xs text-[var(--m2-ink)]">
              <span className="font-serif font-bold text-lg">{usados}</span>
              {limite === Infinity ? (
                <span className="text-[var(--m2-muted)]"> propiedades</span>
              ) : (
                <span className="text-[var(--m2-muted)]"> / {limite} propiedades</span>
              )}
            </p>
            {limite !== Infinity && (
              <div className="w-full sm:w-40 h-1 rounded-full bg-[var(--m2-line)] mt-2 overflow-hidden">
                <div
                  className="h-full bg-[var(--m2-ink)] transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="flex flex-wrap gap-2 mb-6 animate-fade-up"
          style={{ animationDelay: "40ms" }}
        >
          <Link
            href="/panel/propiedad/nueva"
            className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors"
          >
            <IconPlus size={14} />
            Nueva ficha
          </Link>
          <Link
            href="/panel/perfil"
            className="inline-flex items-center gap-1.5 bg-[var(--m2-surface)] border border-[var(--m2-line)] hover:border-[var(--m2-muted)] text-[var(--m2-ink)] text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors"
          >
            <IconUser size={14} />
            Editar mi perfil
          </Link>
          <Link
            href={`/a/${usuario.slug}`}
            className="inline-flex items-center gap-1.5 bg-[var(--m2-surface)] border border-[var(--m2-line)] hover:border-[var(--m2-muted)] text-[var(--m2-ink)] text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors"
          >
            <IconGlobe size={14} />
            Ver mi micrositio
          </Link>
        </div>

        {/* Stats analytics */}
        {mostrarAnalytics && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <StatCard label="Fichas activas" value={activas} icon={<IconChart size={14} />} />
            <StatCard label="Visitas totales" value={totalVisitas} icon={<IconChart size={14} />} />
            <StatCard label="Consultas WSP" value={Math.round(totalVisitas * 0.18)} accent />
            <StatCard
              label="Conversión"
              value={`${totalVisitas ? Math.round((activas / Math.max(1, usados)) * 100) : 0}%`}
            />
          </div>
        )}

        {/* Compartir micrositio */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "140ms" }}>
          <ShareMicrositio slug={usuario.slug} />
        </div>

        {/* CRM Leads */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <LeadsPanel />
        </div>

        {/* Alertas de visitantes */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "170ms" }}>
          <AlertsInbox />
        </div>

        {/* Agenda */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <AgendaPanel />
        </div>

        {/* Tareas */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "190ms" }}>
          <TareasPanel />
        </div>

        {/* Import */}
        <div
          className="bg-[var(--m2-surface)] p-6 sm:p-8 rounded-sm border border-[var(--m2-line)] mb-8 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--m2-ink)] mb-1">
            Importar enlace de portal
          </h2>
          <p className="text-xs sm:text-sm text-[var(--m2-muted)] mb-5 sm:mb-6">
            Pegá el enlace de ZonaProp o MercadoLibre.
          </p>
          <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={linkImportar}
              onChange={(e) => setLinkImportar(e.target.value)}
              disabled={alcanzoLimite}
              placeholder="https://www.zonaprop.com.ar/propiedades/..."
              className="flex-1 px-4 py-3 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-muted)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={cargandoImport || alcanzoLimite}
              className="relative overflow-hidden bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-medium text-sm px-6 py-3 rounded-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargandoImport ? "Procesando…" : alcanzoLimite ? "Límite alcanzado" : "Importar"}
            </button>
          </form>
        </div>

        {/* Upgrade CTA */}
        {mostrarUpgrade && (
          <div
            className="bg-[var(--m2-ink)] text-[var(--m2-bg)] rounded-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex items-start gap-3">
              <span className="text-[var(--m2-line)] mt-0.5">
                <IconStar size={20} />
              </span>
              <div>
                <p className="font-serif font-bold text-base sm:text-lg">Pasate a Agente Pro</p>
                <p className="text-xs sm:text-sm text-[var(--m2-line)]/70">
                  50 propiedades, analytics en tiempo real y soporte prioritario.
                </p>
              </div>
            </div>
            <a
              href={linkWhatsApp("Hola Nicolás, quiero upgradear a Agente Pro")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--m2-bg)] hover:bg-[var(--m2-line)] text-[var(--m2-ink)] font-semibold text-xs px-5 py-3 rounded-sm transition-colors duration-300 tracking-wider whitespace-nowrap"
            >
              <IconWhatsApp size={14} />
              CONSULTAR
            </a>
          </div>
        )}

        {/* Gestión de agentes */}
        {mostrarGestionAgentes && (
          <div
            className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-6 sm:p-8 mb-8 animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--m2-ink)]">
                  Agentes gestionados
                </h2>
                <p className="text-xs text-[var(--m2-muted)] mt-1">
                  {agentesGestionados.length} activos · Vista rápida
                </p>
              </div>
            </div>
            <ul className="divide-y divide-[var(--m2-line)]">
              {agentesGestionados.map((a) => {
                const fichas = propiedades.filter((p) => p.agenteId === a.id).length;
                return (
                  <li key={a.id} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {a.fotoUrl ? (
                        <img src={a.fotoUrl} alt={a.nombre} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-[var(--m2-line)] text-[var(--m2-ink)] flex items-center justify-center text-[10px] font-serif font-bold shrink-0">
                          {a.avatarIniciales}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-serif font-semibold text-[var(--m2-ink)] truncate">
                          {a.nombre}
                        </p>
                        <p className="text-[11px] text-[var(--m2-muted)] truncate">{a.inmobiliaria}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/a/${a.slug}`}
                        className="text-[11px] text-[var(--m2-muted)] hover:text-[var(--m2-ink)] underline underline-offset-2"
                      >
                        Ver micrositio
                      </Link>
                      <span className="text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] text-[var(--m2-muted)]">
                        {ETIQUETAS_ROL[a.rol as Rol]}
                      </span>
                      <span className="text-xs text-[var(--m2-ink)] font-semibold tabular-nums">
                        {fichas} <span className="text-[var(--m2-muted)] font-normal">fichas</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-4 animate-fade-up" style={{ animationDelay: "260ms" }}>
          <FiltrosAvanzados propiedades={misPropiedades} filtros={filtros} onCambiar={setFiltros} />
        </div>

        <h3 className="font-serif font-bold text-xs text-[var(--m2-muted)] uppercase tracking-widest mb-4">
          Propiedades ({filtradas.length} de {misPropiedades.length})
        </h3>
        <div className="space-y-3">
          {filtradas.map((p, i) => (
            <div
              key={p.id}
              style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
              className="bg-[var(--m2-surface)] p-3 sm:p-4 rounded-sm border border-[var(--m2-line)] flex items-center justify-between gap-3 hover:border-[var(--m2-muted)] transition-colors duration-300 animate-fade-up"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <img
                  src={p.imagenes[0]}
                  alt={p.titulo}
                  className="w-16 h-12 sm:w-20 sm:h-14 rounded-sm object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-serif font-semibold text-sm text-[var(--m2-ink)] truncate">{p.titulo}</h4>
                  <p className="text-xs text-[var(--m2-muted)] truncate">
                    {p.ubicacion} • {p.precio}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/a/${usuario.slug}/${p.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] border border-[var(--m2-line)] hover:border-[var(--m2-muted)] px-3 py-2 rounded-sm transition-colors"
                >
                  Ver
                  <IconArrowRight size={12} />
                </Link>
                <Link
                  href={`/panel/propiedad/${p.id}`}
                  aria-label="Editar"
                  className="inline-flex items-center justify-center text-[var(--m2-muted)] hover:text-[var(--m2-ink)] w-9 h-9 rounded-sm transition-colors"
                >
                  <IconEdit size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDuplicar(p)}
                  aria-label="Duplicar"
                  className="inline-flex items-center justify-center text-[var(--m2-muted)] hover:text-[var(--m2-ink)] w-9 h-9 rounded-sm transition-colors"
                >
                  <IconCopy size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminar(p)}
                  aria-label="Eliminar"
                  className="inline-flex items-center justify-center text-[var(--m2-muted)] hover:text-red-700 w-9 h-9 rounded-sm transition-colors"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            </div>
          ))}
          {filtradas.length === 0 && (
            <div className="text-center py-12 text-[var(--m2-muted)] text-sm border border-dashed border-[var(--m2-line)] rounded-sm">
              No hay propiedades con los filtros actuales.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-sm p-4 sm:p-5 border transition-colors duration-300 ${
        accent
          ? "bg-[var(--m2-ink)] border-[var(--m2-ink)] text-[var(--m2-bg)]"
          : "bg-[var(--m2-surface)] border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)]"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-semibold mb-2 ${accent ? "text-[var(--m2-line)]/80" : "text-[var(--m2-muted)]"}`}
      >
        {icon ?? <IconUser size={12} />}
        <span>{label}</span>
      </div>
      <p className="font-serif font-bold text-2xl sm:text-3xl tabular-nums leading-none">{value}</p>
    </div>
  );
}
