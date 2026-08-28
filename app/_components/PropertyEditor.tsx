"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import type { HistorialPrecio, Operacion, Propiedad, TipoAmbiente } from "../_lib/types";
import { useAuth } from "./AuthProvider";
import { IconArrowDown, IconArrowLeft, IconArrowUp, IconChart, IconEye, IconPlus, IconStar, IconTrash } from "./Icon";
import ImageRoomTagger from "./ImageRoomTagger";
import Modal from "./Modal";
import NotasPropiedadPanel from "./NotasPropiedadPanel";
import PropertyPreview from "./PropertyPreview";
import { useProperties } from "./PropertyProvider";
import { useReviews } from "./ReviewsProvider";
import StarRating from "./StarRating";
import { useToast } from "./ToastProvider";
import VisitasChart from "./VisitasChart";

type Props = {
  propiedad?: Propiedad;
};

const OPERACIONES: Operacion[] = ["Venta", "Alquiler"];
const TIPOS = [
  "Casa",
  "Casa de Lujo",
  "Departamento",
  "PH",
  "Loft",
  "Oficina",
  "Quinta",
  "Terreno",
  "Local",
];

const EMPTY: Propiedad = {
  id: "",
  titulo: "",
  ubicacion: "",
  precio: "",
  precioValor: 0,
  monedaPrecio: "USD",
  operacion: "Venta",
  tipo: "Departamento",
  m2Totales: 0,
  m2Cubiertos: 0,
  ambientes: 0,
  dormitorios: 0,
  banos: 0,
  cocheras: 0,
  antiguedad: "",
  descripcion: "",
  origen: "Manual",
  visitas: 0,
  estado: "Activa",
  imagenes: [],
  destacada: false,
};

export default function PropertyEditor({ propiedad }: Props) {
  const router = useRouter();
  const { usuario } = useAuth();
  const { agregar, actualizar, borrar } = useProperties();
  const { exito, info } = useToast();
  const editando = Boolean(propiedad);

  const inicial: Propiedad = propiedad ?? {
    ...EMPTY,
    id: `M2-${Math.floor(1000 + Math.random() * 9000)}`,
    agenteId: usuario?.id,
    fechaAlta: new Date().toISOString().slice(0, 10),
  };

  const [form, setForm] = useState<Propiedad>(inicial);
  const [imgURL, setImgURL] = useState("");
  const [previewAbierto, setPreviewAbierto] = useState(false);
  const { paraTarget, promedio } = useReviews();
  const resenasFicha = useMemo(() => paraTarget("propiedad", form.id), [paraTarget, form.id]);
  const promResenas = promedio("propiedad", form.id);

  const set = <K extends keyof Propiedad>(k: K, v: Propiedad[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const precio =
      form.precio ||
      `${form.monedaPrecio === "USD" ? "USD" : "$"} ${form.precioValor?.toLocaleString("es-AR") ?? 0}`;
    const final: Propiedad = { ...form, precio };
    if (editando) {
      actualizar(final.id, final);
      exito("Ficha actualizada", final.id);
    } else {
      agregar(final);
      exito("Ficha creada", final.id);
    }
    router.push("/panel");
  };

  const eliminar = () => {
    if (!propiedad) return;
    if (!confirm(`¿Eliminar la ficha ${propiedad.id}?`)) return;
    borrar(propiedad.id);
    info("Ficha eliminada", propiedad.titulo);
    router.push("/panel");
  };

  const ambientesActuales = (): TipoAmbiente[] => {
    const base = form.ambientesImagenes ?? [];
    const alineado: TipoAmbiente[] = [];
    for (let i = 0; i < form.imagenes.length; i++) alineado.push(base[i] ?? "sin_etiqueta");
    return alineado;
  };

  const setAmbientes = (nueva: TipoAmbiente[]) => setForm((f) => ({ ...f, ambientesImagenes: nueva }));

  const agregarImg = () => {
    if (!imgURL.trim()) return;
    const amb = ambientesActuales();
    setForm((f) => ({
      ...f,
      imagenes: [...f.imagenes, imgURL.trim()],
      ambientesImagenes: [...amb, "sin_etiqueta"],
    }));
    setImgURL("");
  };

  const quitarImg = (i: number) => {
    const amb = ambientesActuales();
    setForm((f) => ({
      ...f,
      imagenes: f.imagenes.filter((_, idx) => idx !== i),
      ambientesImagenes: amb.filter((_, idx) => idx !== i),
    }));
  };

  const moverImg = (i: number, delta: -1 | 1) => {
    const dst = i + delta;
    if (dst < 0 || dst >= form.imagenes.length) return;
    const copia = [...form.imagenes];
    [copia[i], copia[dst]] = [copia[dst], copia[i]];
    const amb = ambientesActuales();
    [amb[i], amb[dst]] = [amb[dst], amb[i]];
    setForm((f) => ({ ...f, imagenes: copia, ambientesImagenes: amb }));
  };

  const hacerPortada = (i: number) => {
    if (i === 0) return;
    const copia = [...form.imagenes];
    const [seleccionada] = copia.splice(i, 1);
    copia.unshift(seleccionada);
    const amb = ambientesActuales();
    const [ambSel] = amb.splice(i, 1);
    amb.unshift(ambSel);
    setForm((f) => ({ ...f, imagenes: copia, ambientesImagenes: amb }));
    info("Portada actualizada", "Esta imagen aparece primero en la ficha");
  };

  return (
    <div className="min-h-screen bg-[var(--m2-bg)] px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/panel"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] transition-colors mb-4"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">
            <IconArrowLeft size={14} />
          </span>
          Volver al panel
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--m2-ink)] mb-1">
          {editando ? `Editar · ${propiedad!.id}` : "Nueva ficha"}
        </h1>
        <p className="text-sm text-[var(--m2-muted)] mb-8">
          {editando
            ? "Actualizá los datos y guardá los cambios."
            : "Completá los datos para publicar una nueva propiedad."}
        </p>

        <form onSubmit={guardar} className="space-y-6">
          <Section titulo="Datos principales">
            <Field label="Título">
              <input
                required
                value={form.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                className={inputCls}
                placeholder="Departamento 2 dorm. con balcón"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Operación">
                <select
                  value={form.operacion}
                  onChange={(e) => set("operacion", e.target.value as Operacion)}
                  className={inputCls}
                >
                  {OPERACIONES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo">
                <select
                  value={form.tipo}
                  onChange={(e) => set("tipo", e.target.value)}
                  className={inputCls}
                >
                  {TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Ubicación">
              <input
                required
                value={form.ubicacion}
                onChange={(e) => set("ubicacion", e.target.value)}
                className={inputCls}
                placeholder="Barrio, Ciudad"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Moneda">
                <select
                  value={form.monedaPrecio}
                  onChange={(e) => set("monedaPrecio", e.target.value as "USD" | "ARS")}
                  className={inputCls}
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </Field>
              <Field label="Precio (valor)">
                <input
                  type="number"
                  value={form.precioValor ?? 0}
                  onChange={(e) => set("precioValor", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="Precio (texto)">
                <input
                  value={form.precio}
                  onChange={(e) => set("precio", e.target.value)}
                  className={inputCls}
                  placeholder="USD 150.000"
                />
              </Field>
            </div>
          </Section>

          <Section titulo="Superficie y ambientes">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="M² totales">
                <input
                  type="number"
                  value={form.m2Totales}
                  onChange={(e) => set("m2Totales", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="M² cubiertos">
                <input
                  type="number"
                  value={form.m2Cubiertos}
                  onChange={(e) => set("m2Cubiertos", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="Ambientes">
                <input
                  type="number"
                  value={form.ambientes}
                  onChange={(e) => set("ambientes", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="Dormitorios">
                <input
                  type="number"
                  value={form.dormitorios}
                  onChange={(e) => set("dormitorios", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="Baños">
                <input
                  type="number"
                  value={form.banos}
                  onChange={(e) => set("banos", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="Cocheras">
                <input
                  type="number"
                  value={form.cocheras}
                  onChange={(e) => set("cocheras", Number(e.target.value))}
                  className={inputCls}
                  min={0}
                />
              </Field>
              <Field label="Antigüedad">
                <input
                  value={form.antiguedad}
                  onChange={(e) => set("antiguedad", e.target.value)}
                  className={inputCls}
                  placeholder="A estrenar / 5 años"
                />
              </Field>
              <Field label="Estado">
                <select
                  value={form.estado}
                  onChange={(e) => set("estado", e.target.value)}
                  className={inputCls}
                >
                  {["Activa", "Reservada", "Con seña", "Vendida", "Alquilada", "Pausada"].map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section titulo="Descripción">
            <textarea
              required
              rows={6}
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              className={`${inputCls} resize-y min-h-32`}
              placeholder="Describí la propiedad con detalle"
            />
            <label className="inline-flex items-center gap-2 text-xs text-[var(--m2-muted)] mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(form.destacada)}
                onChange={(e) => set("destacada", e.target.checked)}
                className="accent-[var(--m2-ink)]"
              />
              Marcar como destacada en el micrositio
            </label>
          </Section>

          <Section titulo="Imágenes">
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={imgURL}
                onChange={(e) => setImgURL(e.target.value)}
                placeholder="https://…"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={agregarImg}
                className="inline-flex items-center gap-1 bg-[var(--m2-ink)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2 rounded-sm hover:bg-[var(--m2-muted)] transition-colors"
              >
                <IconPlus size={14} />
                Agregar
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.imagenes.map((url, i) => (
                <div key={`${url}-${i}`} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className={`w-full aspect-square object-cover rounded-sm border ${
                      i === 0 ? "border-[var(--m2-ink)] ring-2 ring-[var(--m2-ink)]/20" : "border-[var(--m2-line)]"
                    }`}
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[var(--m2-ink)] text-[var(--m2-bg)] text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm inline-flex items-center gap-1">
                      <IconStar size={9} />
                      Portada
                    </span>
                  )}
                  <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moverImg(i, -1)}
                        disabled={i === 0}
                        className="bg-[var(--m2-ink)] text-[var(--m2-bg)] rounded-sm p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Subir orden"
                      >
                        <IconArrowUp size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moverImg(i, 1)}
                        disabled={i === form.imagenes.length - 1}
                        className="bg-[var(--m2-ink)] text-[var(--m2-bg)] rounded-sm p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Bajar orden"
                      >
                        <IconArrowDown size={11} />
                      </button>
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => hacerPortada(i)}
                          className="bg-[var(--m2-ink)] text-[var(--m2-bg)] rounded-sm p-1"
                          aria-label="Hacer portada"
                          title="Hacer portada"
                        >
                          <IconStar size={11} />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarImg(i)}
                      className="bg-red-700 text-white rounded-sm p-1"
                      aria-label={`Quitar imagen ${i + 1}`}
                    >
                      <IconTrash size={11} />
                    </button>
                  </div>
                </div>
              ))}
              {form.imagenes.length === 0 && (
                <p className="col-span-full text-xs text-[var(--m2-muted)] italic">Sin imágenes aún.</p>
              )}
            </div>
            {form.imagenes.length > 0 && (
              <p className="text-[11px] text-[var(--m2-muted)] mt-2">
                Usá las flechas para reordenar o marcá otra como portada.
              </p>
            )}
            <ImageRoomTagger
              imagenes={form.imagenes}
              ambientes={ambientesActuales()}
              onChange={setAmbientes}
            />
          </Section>

          {editando && (
            <Section titulo="Notas privadas">
              <NotasPropiedadPanel propiedadId={form.id} />
            </Section>
          )}

          {editando && (
            <Section titulo="Estadísticas de la ficha">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">Visitas</p>
                  <p className="font-serif font-bold text-2xl text-[var(--m2-ink)] tabular-nums">{form.visitas ?? 0}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">Reseñas</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <StarRating value={promResenas} size={14} />
                    <span className="text-sm font-serif font-bold text-[var(--m2-ink)] tabular-nums">
                      {resenasFicha.length > 0 ? promResenas.toFixed(1) : "—"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--m2-muted)] mt-0.5">{resenasFicha.length} opiniones</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">Estado</p>
                  <p className="font-serif font-bold text-lg text-[var(--m2-ink)]">{form.estado || "—"}</p>
                </div>
              </div>
              <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[var(--m2-muted)]">
                    <IconChart size={14} />
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[var(--m2-muted)]">
                    Visitas últimas 2 semanas
                  </p>
                </div>
                <VisitasChart seed={form.id} totalVisitas={form.visitas ?? 0} />
              </div>
            </Section>
          )}

          <Section titulo="Video / Tour 360 (opcional)">
            <Field label="URL de YouTube, Vimeo o tour 360">
              <input
                type="url"
                value={form.videoUrl ?? ""}
                onChange={(e) => set("videoUrl", e.target.value || undefined)}
                className={inputCls}
                placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
              />
            </Field>
            <p className="text-[11px] text-[var(--m2-muted)] mt-2">
              Se embebe automáticamente en la ficha si es YouTube/Vimeo, o se muestra como link.
            </p>
          </Section>

          <Section titulo="Historial de precios (opcional)">
            <HistorialPrecioEditor
              historial={form.historialPrecio ?? []}
              monedaBase={form.monedaPrecio ?? "USD"}
              onChange={(h) => set("historialPrecio", h.length > 0 ? h : undefined)}
            />
          </Section>

          <Section titulo="SEO (opcional)">
            <div className="space-y-4">
              <Field label="Título SEO">
                <input
                  value={form.seoTitle ?? ""}
                  onChange={(e) => set("seoTitle", e.target.value || undefined)}
                  className={inputCls}
                  placeholder={form.titulo || "Título optimizado para buscadores"}
                  maxLength={60}
                />
                <p className="text-[10px] text-[var(--m2-muted)] mt-1">{(form.seoTitle ?? "").length}/60</p>
              </Field>
              <Field label="Descripción SEO">
                <textarea
                  value={form.seoDescription ?? ""}
                  onChange={(e) => set("seoDescription", e.target.value || undefined)}
                  className={`${inputCls} resize-y min-h-20`}
                  placeholder={form.descripcion?.slice(0, 160) || "Descripción corta para buscadores"}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-[10px] text-[var(--m2-muted)] mt-1">{(form.seoDescription ?? "").length}/160</p>
              </Field>
            </div>
          </Section>

          <Section titulo="Geolocalización (opcional)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitud">
                <input
                  type="number"
                  step="any"
                  value={form.lat ?? ""}
                  onChange={(e) => set("lat", e.target.value ? Number(e.target.value) : undefined)}
                  className={inputCls}
                />
              </Field>
              <Field label="Longitud">
                <input
                  type="number"
                  step="any"
                  value={form.lng ?? ""}
                  onChange={(e) => set("lng", e.target.value ? Number(e.target.value) : undefined)}
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            {editando ? (
              <button
                type="button"
                onClick={eliminar}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 transition-colors"
              >
                <IconTrash size={14} />
                Eliminar ficha
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewAbierto(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m2-ink)] border border-[var(--m2-line)] hover:border-[var(--m2-muted)] px-4 py-2.5 rounded-sm transition-colors"
              >
                <IconEye size={14} />
                Vista previa
              </button>
              <Link
                href="/panel"
                className="text-xs font-semibold text-[var(--m2-muted)] hover:text-[var(--m2-ink)] px-4 py-2.5 rounded-sm transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-6 py-2.5 rounded-sm transition-colors tracking-wider"
              >
                {editando ? "GUARDAR CAMBIOS" : "CREAR FICHA"}
              </button>
            </div>
          </div>
        </form>

        {usuario && (
          <Modal
            abierto={previewAbierto}
            onCerrar={() => setPreviewAbierto(false)}
            titulo="Vista previa de la ficha"
            descripcion="Así la ve un cliente en tu micrositio."
            size="lg"
          >
            <PropertyPreview propiedad={form} agente={usuario} />
          </Modal>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm px-3 py-2.5 text-sm text-[var(--m2-ink)] placeholder:text-[var(--m2-muted)]/60 focus:outline-none focus:border-[var(--m2-ink)] transition-colors";

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm p-5 sm:p-6 space-y-4">
      <legend className="px-2 text-[10px] uppercase tracking-[0.22em] font-semibold text-[var(--m2-muted)]">
        {titulo}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function HistorialPrecioEditor({
  historial,
  monedaBase,
  onChange,
}: {
  historial: HistorialPrecio[];
  monedaBase: "USD" | "ARS";
  onChange: (h: HistorialPrecio[]) => void;
}) {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [valor, setValor] = useState("");
  const [moneda, setMoneda] = useState<"USD" | "ARS">(monedaBase);

  const agregar = () => {
    const n = Number(valor);
    if (!fecha || !n || n <= 0) return;
    const nuevo: HistorialPrecio = { fecha, valor: n, moneda };
    const ordenado = [...historial, nuevo].sort((a, b) => a.fecha.localeCompare(b.fecha));
    onChange(ordenado);
    setValor("");
  };

  const quitar = (i: number) => onChange(historial.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={inputCls}
        />
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Precio"
          className={inputCls}
          min={0}
        />
        <select
          value={moneda}
          onChange={(e) => setMoneda(e.target.value as "USD" | "ARS")}
          className={inputCls}
        >
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
        </select>
        <button
          type="button"
          onClick={agregar}
          className="bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-3 py-2.5 rounded-sm transition-colors"
        >
          Agregar
        </button>
      </div>
      {historial.length === 0 ? (
        <p className="text-[11px] text-[var(--m2-muted)] italic">
          Cargá cambios de precio para mostrar la evolución en la ficha pública.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--m2-line)] border border-[var(--m2-line)] rounded-sm">
          {historial.map((h, i) => (
            <li key={`${h.fecha}-${i}`} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-[var(--m2-muted)] text-xs">{new Date(h.fecha).toLocaleDateString("es-AR")}</span>
              <span className="font-serif font-bold text-[var(--m2-ink)] tabular-nums">
                {h.moneda} {h.valor.toLocaleString("es-AR")}
              </span>
              <button
                type="button"
                onClick={() => quitar(i)}
                aria-label="Quitar"
                className="text-[var(--m2-muted)] hover:text-red-700"
              >
                <IconTrash size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
