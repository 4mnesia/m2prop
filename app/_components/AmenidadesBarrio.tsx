"use client";

import { useEffect, useState } from "react";
import { IconPin } from "./Icon";

type POI = {
  id: number;
  nombre: string;
  categoria: string;
  distancia: number;
};

type Grupo = {
  clave: string;
  etiqueta: string;
  emoji: string;
  filtro: (tags: Record<string, string>) => boolean;
};

const GRUPOS: Grupo[] = [
  { clave: "supermercado", etiqueta: "Supermercados", emoji: "🛒", filtro: (t) => t.shop === "supermarket" || t.shop === "convenience" },
  { clave: "gastronomia", etiqueta: "Bares y restaurantes", emoji: "🍽️", filtro: (t) => t.amenity === "restaurant" || t.amenity === "cafe" || t.amenity === "bar" || t.amenity === "fast_food" },
  { clave: "educacion", etiqueta: "Educación", emoji: "🎓", filtro: (t) => t.amenity === "school" || t.amenity === "kindergarten" || t.amenity === "university" || t.amenity === "college" },
  { clave: "salud", etiqueta: "Salud", emoji: "🏥", filtro: (t) => t.amenity === "hospital" || t.amenity === "clinic" || t.amenity === "pharmacy" || t.amenity === "doctors" },
  { clave: "transporte", etiqueta: "Transporte", emoji: "🚌", filtro: (t) => Boolean(t.public_transport) || t.railway === "station" || t.highway === "bus_stop" },
  { clave: "verde", etiqueta: "Parques y plazas", emoji: "🌳", filtro: (t) => t.leisure === "park" || t.leisure === "playground" || t.leisure === "garden" },
  { clave: "banco", etiqueta: "Bancos y ATM", emoji: "🏦", filtro: (t) => t.amenity === "bank" || t.amenity === "atm" },
];

const CACHE_KEY = "m2prop_amenidades_v1";
type CacheEntry = { at: number; pois: POI[] };

function haversineMts(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function categorizar(tags: Record<string, string>): string | null {
  for (const g of GRUPOS) if (g.filtro(tags)) return g.clave;
  return null;
}

export default function AmenidadesBarrio({ lat, lng }: { lat: number; lng: number }) {
  const [pois, setPois] = useState<POI[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheKey = `${CACHE_KEY}_${lat.toFixed(4)}_${lng.toFixed(4)}`;

  useEffect(() => {
    let cancelado = false;
    setError(null);

    try {
      const raw = window.localStorage.getItem(cacheKey);
      if (raw) {
        const entry = JSON.parse(raw) as CacheEntry;
        if (Date.now() - entry.at < 7 * 86400_000) {
          setPois(entry.pois);
          return () => { cancelado = true; };
        }
      }
    } catch {}

    setCargando(true);
    const query = `[out:json][timeout:15];
(
  node["amenity"~"school|kindergarten|university|college|hospital|clinic|pharmacy|doctors|restaurant|cafe|bar|fast_food|bank|atm"](around:900,${lat},${lng});
  node["shop"~"supermarket|convenience"](around:900,${lat},${lng});
  node["leisure"~"park|playground|garden"](around:900,${lat},${lng});
  node["public_transport"](around:900,${lat},${lng});
  node["railway"="station"](around:900,${lat},${lng});
  node["highway"="bus_stop"](around:600,${lat},${lng});
);
out 80;`;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Overpass no disponible");
        return r.json();
      })
      .then((data: { elements: Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }> }) => {
        if (cancelado) return;
        const raw = (data.elements ?? [])
          .map((el) => {
            const tags = el.tags ?? {};
            const cat = categorizar(tags);
            if (!cat) return null;
            const nombre = tags.name || tags["name:es"] || GRUPOS.find((g) => g.clave === cat)?.etiqueta || "Punto de interés";
            return {
              id: el.id,
              nombre,
              categoria: cat,
              distancia: Math.round(haversineMts(lat, lng, el.lat, el.lon)),
            } satisfies POI;
          })
          .filter((x): x is POI => x !== null)
          .sort((a, b) => a.distancia - b.distancia);
        setPois(raw);
        try {
          window.localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), pois: raw } satisfies CacheEntry));
        } catch {}
      })
      .catch((e: Error) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => { if (!cancelado) setCargando(false); });

    return () => { cancelado = true; };
  }, [lat, lng, cacheKey]);

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--m2-ink)] mb-4 border-b border-[var(--m2-line)] pb-3">
        Amenidades del barrio
      </h3>
      {cargando && (
        <p className="text-sm text-[var(--m2-muted)] italic">Buscando puntos de interés cercanos…</p>
      )}
      {error && !cargando && (
        <p className="text-sm text-[var(--m2-muted)]">No se pudo cargar el mapa de amenidades ({error}).</p>
      )}
      {pois && !cargando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GRUPOS.map((g) => {
            const items = pois.filter((p) => p.categoria === g.clave).slice(0, 5);
            if (items.length === 0) return null;
            return (
              <div key={g.clave} className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--m2-muted)] mb-2">
                  <span className="mr-1.5">{g.emoji}</span>
                  {g.etiqueta} · {items.length}
                </p>
                <ul className="space-y-1.5">
                  {items.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[var(--m2-ink)] truncate flex items-center gap-1.5">
                        <IconPin size={10} />
                        {p.nombre}
                      </span>
                      <span className="text-[var(--m2-muted)] tabular-nums shrink-0">
                        {p.distancia < 1000 ? `${p.distancia} m` : `${(p.distancia / 1000).toFixed(1)} km`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {pois.length === 0 && (
            <p className="text-sm text-[var(--m2-muted)] col-span-full italic">
              Sin puntos de interés cercanos en OpenStreetMap.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
