export type Operacion = "Venta" | "Alquiler";
export type FiltroOperacion = "Todos" | Operacion;
export type Vista = "landing" | "dashboard" | "micrositio" | "detalle" | "login";

export type Rol = "admin" | "agente_pro" | "agente";

export type Usuario = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  slug: string;
  inmobiliaria?: string;
  telefono?: string;
  avatarIniciales: string;
  fotoUrl?: string;
  bio?: string;
  colorPrimario?: string;
  colorAcento?: string;
  instagram?: string;
  sitioWeb?: string;
  plantilla?: Plantilla;
};

export type Propiedad = {
  id: string;
  titulo: string;
  ubicacion: string;
  precio: string;
  precioValor?: number;
  monedaPrecio?: "USD" | "ARS";
  operacion: Operacion;
  tipo: string;
  m2Totales: number;
  m2Cubiertos: number;
  ambientes: number;
  dormitorios: number;
  banos: number;
  cocheras: number;
  antiguedad: string;
  descripcion: string;
  origen: string;
  visitas: number;
  estado: string;
  imagenes: string[];
  agenteId?: string;
  destacada?: boolean;
  lat?: number;
  lng?: number;
  fechaAlta?: string;
  videoUrl?: string;
  historialPrecio?: HistorialPrecio[];
  seoTitle?: string;
  seoDescription?: string;
  ambientesImagenes?: TipoAmbiente[];
};

export type TipoAmbiente =
  | "sin_etiqueta"
  | "fachada"
  | "living"
  | "comedor"
  | "cocina"
  | "dormitorio"
  | "bano"
  | "exterior"
  | "cochera"
  | "otro";

export type Paquete = {
  nombre: string;
  precio: string;
  propiedades: number;
  destacado: boolean;
  beneficios: string[];
};

export type Faq = {
  pregunta: string;
  respuesta: string;
};

export type Testimonio = {
  id: string;
  nombre: string;
  cargo: string;
  inmobiliaria: string;
  fotoUrl: string;
  texto: string;
  rating: number;
};

export type Tema = "light" | "dark";

export type ToastVariant = "success" | "error" | "info";
export type Toast = {
  id: string;
  variant: ToastVariant;
  titulo: string;
  descripcion?: string;
  duracionMs?: number;
};

export type OrdenPropiedades =
  | "recientes"
  | "precio_asc"
  | "precio_desc"
  | "m2_desc"
  | "visitas_desc";

export type TipoResena = "propiedad" | "agente";

export type Resena = {
  id: string;
  tipo: TipoResena;
  targetId: string;
  autor: string;
  calificacion: number;
  comentario: string;
  fecha: string;
};

export type EstadoLead = "nuevo" | "contactado" | "visito" | "oferto" | "cerrado" | "perdido";

export type Lead = {
  id: string;
  agenteId: string;
  propiedadId?: string;
  nombre: string;
  contacto: string;
  canal: "whatsapp" | "email" | "web" | "otro";
  mensaje?: string;
  estado: EstadoLead;
  fecha: string;
  notas?: string;
};

export type Alerta = {
  id: string;
  agenteSlug: string;
  email: string;
  operacion?: FiltroOperacion;
  tipo?: string;
  precioMax?: number;
  dormitoriosMin?: number;
  fecha: string;
};

export type Nota = {
  id: string;
  propiedadId: string;
  autorId: string;
  texto: string;
  fecha: string;
};

export type Tarea = {
  id: string;
  agenteId: string;
  propiedadId?: string;
  titulo: string;
  vence?: string;
  hecha: boolean;
  fecha: string;
};

export type Visita = {
  id: string;
  agenteId: string;
  propiedadId?: string;
  cliente: string;
  fechaHora: string;
  duracionMin?: number;
  notas?: string;
};

export type HistorialPrecio = {
  fecha: string;
  valor: number;
  moneda: "USD" | "ARS";
};

export type Plantilla = "elegante" | "moderna" | "minimal";

export type EstadoFichaAvanzado = "Activa" | "Reservada" | "Con seña" | "Vendida" | "Alquilada" | "Pausada";
