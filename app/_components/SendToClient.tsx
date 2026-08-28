"use client";

import { useMemo, useState } from "react";
import type { Propiedad, Usuario } from "../_lib/types";
import { linkWhatsApp } from "../_lib/whatsapp";
import { IconCopy, IconMail, IconSend, IconWhatsApp } from "./Icon";
import Modal from "./Modal";
import { useToast } from "./ToastProvider";

type Props = { propiedad: Propiedad; agente: Usuario };

export default function SendToClient({ propiedad, agente }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState(defaultMensaje(propiedad, agente));
  const { exito } = useToast();

  const url = useMemo(() => {
    if (typeof window === "undefined") return `/a/${agente.slug}/${propiedad.id}`;
    return `${window.location.origin}/a/${agente.slug}/${propiedad.id}`;
  }, [agente.slug, propiedad.id]);

  const cuerpoFinal = `${mensaje}\n\n${url}`;
  const linkWsp = linkWhatsApp(cuerpoFinal, agente.telefono);
  const linkMail = `mailto:?subject=${encodeURIComponent(`${propiedad.titulo} · ${propiedad.precio}`)}&body=${encodeURIComponent(cuerpoFinal)}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(cuerpoFinal);
      exito("Mensaje copiado", "Pegalo donde quieras");
    } catch {}
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center justify-center gap-2 w-full border border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)] font-semibold text-xs py-3 rounded-sm transition-colors tracking-wider"
      >
        <IconSend size={14} />
        ENVIAR A UN CLIENTE
      </button>

      <Modal
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo="Enviar ficha a un cliente"
        descripcion="Editá el mensaje y elegí por dónde compartirlo."
        size="md"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold block mb-1.5">
              Mensaje
            </span>
            <textarea
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full bg-[var(--m2-bg)] border border-[var(--m2-line)] rounded-sm px-3 py-2.5 text-sm text-[var(--m2-ink)] focus:outline-none focus:border-[var(--m2-ink)] resize-y"
            />
          </label>

          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--m2-muted)] font-semibold">
            Vista previa
          </div>
          <div className="rounded-sm bg-[var(--m2-bg)] border border-[var(--m2-line)] p-3 text-xs text-[var(--m2-muted)] whitespace-pre-line">
            {cuerpoFinal}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a
              href={linkWsp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] text-xs font-semibold px-4 py-2.5 rounded-sm tracking-wider transition-colors"
            >
              <IconWhatsApp size={12} />
              WhatsApp
            </a>
            <a
              href={linkMail}
              className="inline-flex items-center justify-center gap-1.5 border border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)] text-xs font-semibold px-4 py-2.5 rounded-sm tracking-wider transition-colors"
            >
              <IconMail size={12} />
              Email
            </a>
            <button
              type="button"
              onClick={copiar}
              className="inline-flex items-center justify-center gap-1.5 border border-[var(--m2-line)] text-[var(--m2-ink)] hover:border-[var(--m2-muted)] text-xs font-semibold px-4 py-2.5 rounded-sm tracking-wider transition-colors"
            >
              <IconCopy size={12} />
              Copiar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function defaultMensaje(p: Propiedad, a: Usuario) {
  return `Hola! Te comparto esta ficha que puede interesarte:\n\n${p.titulo}\n${p.ubicacion} · ${p.precio}\n${p.dormitorios} dorm · ${p.m2Totales} m²\n\nCualquier consulta escribime.\n${a.nombre}${a.inmobiliaria ? ` · ${a.inmobiliaria}` : ""}`;
}
