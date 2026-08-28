import type { Rol, Usuario } from "./types";

const STORAGE_KEY = "m2prop_session_v1";
const PROFILE_STORAGE_PREFIX = "m2prop_perfil_";

type Credencial = { email: string; password: string; usuario: Usuario };

// Mock store — reemplazar por backend real cuando esté listo.
export const USUARIOS_MOCK: Credencial[] = [
  {
    email: "admin@m2prop.com",
    password: "admin123",
    usuario: {
      id: "u_admin",
      email: "admin@m2prop.com",
      nombre: "Nicolás Márquez Casali",
      rol: "admin",
      slug: "nicolas-marquez",
      inmobiliaria: "López Baena Propiedades",
      telefono: "+54 9 3804 251846",
      avatarIniciales: "NM",
      fotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      bio: "Asesor inmobiliario con 12 años de experiencia. Especialista en propiedades premium en Villa Carlos Paz, Villa Allende y Nueva Córdoba.",
      colorPrimario: "#2c2416",
      colorAcento: "#8b7355",
      instagram: "@nicolas.marquez.props",
      sitioWeb: "lopezbaena.com",
    },
  },
  {
    email: "pro@demo.com",
    password: "pro123",
    usuario: {
      id: "u_pro",
      email: "pro@demo.com",
      nombre: "Laura Fernández",
      rol: "agente_pro",
      slug: "laura-fernandez",
      inmobiliaria: "Fernández Propiedades",
      telefono: "+54 9 351 555 0100",
      avatarIniciales: "LF",
      fotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Especialista en Nueva Córdoba y Cerro. Más de 200 operaciones cerradas. Financiación bancaria y asesoramiento personalizado.",
      colorPrimario: "#1a3a52",
      colorAcento: "#c9a26a",
      instagram: "@laurafernandez.props",
    },
  },
  {
    email: "agente@demo.com",
    password: "agente123",
    usuario: {
      id: "u_agente",
      email: "agente@demo.com",
      nombre: "Martín Ruiz",
      rol: "agente",
      slug: "martin-ruiz",
      inmobiliaria: "Ruiz Inmobiliaria",
      telefono: "+54 9 351 555 0200",
      avatarIniciales: "MR",
      fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Barrio Jardín y zonas residenciales. Atención personalizada.",
      colorPrimario: "#2a4d3a",
      colorAcento: "#b58a5c",
    },
  },
];

export type ResultadoLogin =
  | { ok: true; usuario: Usuario }
  | { ok: false; error: string };

function combinarPerfilPersistido(usuario: Usuario): Usuario {
  if (typeof window === "undefined") return usuario;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_PREFIX + usuario.id);
    if (!raw) return usuario;
    const parcial = JSON.parse(raw) as Partial<Usuario>;
    return { ...usuario, ...parcial };
  } catch {
    return usuario;
  }
}

export function login(email: string, password: string): ResultadoLogin {
  const match = USUARIOS_MOCK.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
  );
  if (!match) return { ok: false, error: "Email o contraseña incorrectos" };
  const usuario = combinarPerfilPersistido(match.usuario);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  }
  return { ok: true, usuario };
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function leerSesion(): Usuario | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

export function guardarPerfil(usuario: Usuario) {
  if (typeof window === "undefined") return;
  const { id, nombre, inmobiliaria, telefono, fotoUrl, bio, colorPrimario, colorAcento, instagram, sitioWeb, slug } = usuario;
  const parcial = { nombre, inmobiliaria, telefono, fotoUrl, bio, colorPrimario, colorAcento, instagram, sitioWeb, slug };
  window.localStorage.setItem(PROFILE_STORAGE_PREFIX + id, JSON.stringify(parcial));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function agentePorSlug(slug: string): Usuario | null {
  const base = USUARIOS_MOCK.find((c) => c.usuario.slug === slug)?.usuario;
  return base ? combinarPerfilPersistido(base) : null;
}

export function listarAgentes(): Usuario[] {
  return USUARIOS_MOCK.map((c) => combinarPerfilPersistido(c.usuario));
}

export const ETIQUETAS_ROL: Record<Rol, string> = {
  admin: "Administrador",
  agente_pro: "Agente Pro",
  agente: "Agente",
};

export function limitePropiedades(rol: Rol): number {
  if (rol === "admin") return Infinity;
  if (rol === "agente_pro") return 50;
  return 15;
}
