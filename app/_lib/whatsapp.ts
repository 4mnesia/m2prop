export const WHATSAPP_NUMBER = "5493804251846";

const soloDigitos = (v: string) => v.replace(/\D/g, "");

export const linkWhatsApp = (mensaje: string, telefono?: string) => {
  const numero = telefono ? soloDigitos(telefono) : WHATSAPP_NUMBER;
  return `https://wa.me/${numero || WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
};
