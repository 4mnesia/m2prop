import type { TipoAmbiente } from "./types";

export const ETIQUETAS_AMBIENTE: Record<TipoAmbiente, string> = {
  sin_etiqueta: "Sin etiquetar",
  fachada: "Fachada",
  living: "Living",
  comedor: "Comedor",
  cocina: "Cocina",
  dormitorio: "Dormitorio",
  bano: "Baño",
  exterior: "Exterior / Jardín",
  cochera: "Cochera",
  otro: "Otro",
};

export const EMOJIS_AMBIENTE: Record<TipoAmbiente, string> = {
  sin_etiqueta: "·",
  fachada: "🏠",
  living: "🛋️",
  comedor: "🍽️",
  cocina: "🍳",
  dormitorio: "🛏️",
  bano: "🛁",
  exterior: "🌳",
  cochera: "🚗",
  otro: "·",
};

export const AMBIENTES_ORDENADOS: TipoAmbiente[] = [
  "fachada",
  "living",
  "comedor",
  "cocina",
  "dormitorio",
  "bano",
  "exterior",
  "cochera",
  "otro",
];

type PatronAmbiente = { patrones: RegExp[]; tipo: TipoAmbiente };

const PATRONES: PatronAmbiente[] = [
  { tipo: "cocina", patrones: [/cocina/i, /kitchen/i, /kitch/i] },
  { tipo: "bano", patrones: [/ba[nñ]o/i, /bath/i, /toilet/i, /wc/i, /lavatorio/i] },
  { tipo: "dormitorio", patrones: [/dormitorio/i, /bedroom/i, /dorm(?!it)/i, /suite/i, /habitaci[oó]n/i, /cuarto/i] },
  { tipo: "living", patrones: [/living/i, /sala/i, /lounge/i, /salon/i, /estar/i] },
  { tipo: "comedor", patrones: [/comedor/i, /dining/i, /mesa/i] },
  { tipo: "fachada", patrones: [/fachada/i, /facade/i, /front/i, /exterior-front/i, /entrada/i, /portal/i] },
  { tipo: "exterior", patrones: [/exterior/i, /jardin/i, /jard[ií]n/i, /garden/i, /parque/i, /patio/i, /pileta/i, /pool/i, /terraza/i, /balcon/i, /outdoor/i] },
  { tipo: "cochera", patrones: [/cochera/i, /garage/i, /garaje/i, /parking/i] },
];

const SECUENCIA_TIPICA: TipoAmbiente[] = [
  "fachada",
  "living",
  "comedor",
  "cocina",
  "dormitorio",
  "dormitorio",
  "bano",
  "bano",
  "exterior",
  "cochera",
];

type Resultado = { tipo: TipoAmbiente; confianza: number; origen: "url" | "posicion" };

function hashCadena(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function clasificarImagen(url: string, index: number): Resultado {
  const nombre = url.split("?")[0].toLowerCase();
  for (const { patrones, tipo } of PATRONES) {
    if (patrones.some((r) => r.test(nombre))) {
      return { tipo, confianza: 0.88 + (hashCadena(url) % 10) / 100, origen: "url" };
    }
  }
  const desdeSecuencia = SECUENCIA_TIPICA[index] ?? "otro";
  const jitter = (hashCadena(url) % 15) / 100;
  return { tipo: desdeSecuencia, confianza: 0.62 + jitter, origen: "posicion" };
}

export function clasificarLote(urls: string[]): { tipo: TipoAmbiente; confianza: number }[] {
  return urls.map((u, i) => {
    const r = clasificarImagen(u, i);
    return { tipo: r.tipo, confianza: Math.min(0.99, r.confianza) };
  });
}
