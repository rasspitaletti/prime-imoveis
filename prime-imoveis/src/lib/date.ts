import type { HHmm, ISODate } from "@/types/entities";

const pad = (n: number) => String(n).padStart(2, "0");

export const toISODate = (d: Date): ISODate =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromISODate = (iso: ISODate) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

export const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const todayISO = () => toISODate(new Date());

export const weekdayShort = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

export const formatLongDate = (iso: ISODate) =>
  fromISODate(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

export const formatShortDate = (iso: ISODate) =>
  fromISODate(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");

export const minutesOf = (h: HHmm) => {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
};

export const hhmm = (minutes: number): HHmm => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export const formatDuration = (min: number) => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h${pad(m)}` : `${h}h`;
};
