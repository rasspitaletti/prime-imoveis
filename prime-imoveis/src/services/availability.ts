import { settings } from "@/config/agency";
import { visits } from "@/data/operations";
import { getBroker } from "@/data/brokers";
import { fromISODate, hhmm, minutesOf } from "@/lib/date";
import { hashString } from "@/lib/utils";
import type { Horario, ID, ISODate } from "@/types/entities";

/**
 * Horários de visita livres de um corretor numa data (mock).
 * No backend: GET /corretores/{id}/horarios?data=YYYY-MM-DD
 */
export function computeSlots(corretorId: ID, data: ISODate, now = new Date()): Horario[] {
  const broker = getBroker(corretorId);
  const day = fromISODate(data);
  if (!broker || !broker.diasAtendimento.includes(day.getDay())) return [];

  const { abertura, fechamento, pausaInicio, pausaFim, intervaloMin, antecedenciaMinimaHoras } = settings.agenda;
  const close = day.getDay() === 6 ? minutesOf("14:00") : minutesOf(fechamento);
  const taken = new Set(
    visits.filter((v) => v.corretorId === corretorId && v.data === data && v.status !== "cancelada").map((v) => v.hora),
  );

  const isToday = day.toDateString() === now.toDateString();
  const minStart = now.getHours() * 60 + now.getMinutes() + antecedenciaMinimaHoras * 60;
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const slots: Horario[] = [];
  for (let m = minutesOf(abertura); m < close; m += intervaloMin) {
    if (m >= minutesOf(pausaInicio) && m < minutesOf(pausaFim)) continue;
    const hora = hhmm(m);
    const pseudoBusy = hashString(`${corretorId}-${data}-${hora}`) % 5 === 0;
    const disponivel = !taken.has(hora) && !pseudoBusy && (!isToday || m >= minStart) && day >= todayStart;
    slots.push({ corretorId, data, hora, disponivel });
  }
  return slots;
}
