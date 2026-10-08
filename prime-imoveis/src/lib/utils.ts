import { clsx, type ClassValue } from "clsx";
import { agency, whatsappDefaultMessage } from "@/config/agency";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const whatsappLink = (message: string = whatsappDefaultMessage, phone = agency.contato.whatsapp) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


/** Máscara (11) 99999-9999 */
export const maskPhone = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const isValidPhone = (value: string) => {
  const d = value.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
};

export const initials = (name: string) =>
  name
    .replace(/^(Dra?\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/** PRNG determinístico (mulberry32) — mantém os mocks estáveis entre servidor e cliente. */
export const seeded = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const hashString = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
