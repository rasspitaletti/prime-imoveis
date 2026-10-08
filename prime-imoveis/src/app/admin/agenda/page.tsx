"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { settings } from "@/config/agency";
import { visits } from "@/data/operations";
import { brokers, getBroker } from "@/data/brokers";
import { getProperty, properties } from "@/data/properties";
import { addDays, formatLongDate, fromISODate, hhmm, minutesOf, startOfDay, toISODate, weekdayShort } from "@/lib/date";
import { cn, isValidPhone, maskPhone } from "@/lib/utils";
import { api } from "@/services/api";
import { computeSlots } from "@/services/availability";
import type { Visita } from "@/types/entities";
import { AdminPageHeader, Segmented, statusMeta } from "@/components/admin/ui";
import { VisitDrawer } from "@/components/admin/visit-drawer";
import { Button } from "@/components/ui/button";

const ROW = 56; // px por 30 min
const START = minutesOf(settings.agenda.abertura);
const END = minutesOf(settings.agenda.fechamento);
const rows = Array.from({ length: (END - START) / 30 }, (_, i) => hhmm(START + i * 30));

export default function AgendaPage() {
  const [date, setDate] = useState(toISODate(startOfDay()));
  const [view, setView] = useState<"dia" | "semana">("dia");
  const [selected, setSelected] = useState<Visita | null>(null);
  const [creating, setCreating] = useState(false);
  const [version, setVersion] = useState(0);

  const day = fromISODate(date);
  const dayList = useMemo(
    () => visits.filter((a) => a.data === date && a.status !== "cancelada"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, version],
  );

  const weekDays = useMemo(() => {
    const monday = addDays(day, -((day.getDay() + 6) % 7));
    return Array.from({ length: 6 }, (_, i) => addDays(monday, i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const shift = (n: number) => setDate(toISODate(addDays(day, view === "dia" ? n : n * 7)));
  const isToday = date === toISODate(startOfDay());

  return (
    <>
      <AdminPageHeader
        title="Agenda"
        description="Visualize e organize as visitas por corretor."
        actions={
          <Button size="sm" className="h-10" icon={<Plus size={16} />} onClick={() => setCreating(true)}>
            Nova visita
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => shift(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.05] hover:bg-white/[0.1]" aria-label="Anterior">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => shift(1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.05] hover:bg-white/[0.1]" aria-label="Próximo">
            <ChevronRight size={18} />
          </button>
          <p className="ml-2 text-[16px] font-medium capitalize">
            {view === "dia"
              ? formatLongDate(date)
              : `${weekDays[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} – ${weekDays[5].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}`}
          </p>
          {!isToday && (
            <button onClick={() => setDate(toISODate(startOfDay()))} className="ml-1 rounded-full px-3 py-1.5 text-[13px] text-link hover:bg-white/[0.05]">
              Hoje
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Legend />
          <Segmented
            layoutId="agenda-view"
            value={view}
            onChange={setView}
            options={[
              { value: "dia", label: "Dia" },
              { value: "semana", label: "Semana" },
            ]}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "dia" ? (
          <motion.div
            key={`d-${date}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-[24px] bg-graphite shadow-[inset_0_0_0_1px_var(--color-line)]"
          >
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                {/* Cabeçalho de colunas */}
                <div className="grid border-b border-line" style={{ gridTemplateColumns: `64px repeat(${brokers.length}, 1fr)` }}>
                  <div />
                  {brokers.map((p) => {
                    const works = p.diasAtendimento.includes(day.getDay());
                    const count = dayList.filter((a) => a.corretorId === p.id).length;
                    return (
                      <div key={p.id} className="flex items-center gap-3 border-l border-line px-4 py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.foto} alt="" className="h-8 w-8 rounded-full object-cover object-top" />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium">{p.nome}</p>
                          <p className="text-[11px] text-ash">{works ? `${count} visitas` : "Não atende"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Grade */}
                <div className="relative grid" style={{ gridTemplateColumns: `64px repeat(${brokers.length}, 1fr)` }}>
                  <div>
                    {rows.map((r) => (
                      <div key={r} className="relative text-right" style={{ height: ROW }}>
                        {r.endsWith(":00") && <span className="absolute -top-2 right-3 text-[11px] text-slate tabular">{r}</span>}
                      </div>
                    ))}
                  </div>
                  {brokers.map((p) => {
                    const works = p.diasAtendimento.includes(day.getDay());
                    return (
                      <div key={p.id} className={cn("relative border-l border-line", !works && "bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgb(255_255_255/0.015)_8px,rgb(255_255_255/0.015)_16px)]")}>
                        {rows.map((r) => {
                          const isLunch = minutesOf(r) >= minutesOf(settings.agenda.pausaInicio) && minutesOf(r) < minutesOf(settings.agenda.pausaFim);
                          return (
                            <div
                              key={r}
                              className={cn("border-t", r.endsWith(":00") ? "border-line" : "border-white/[0.02]", isLunch && "bg-white/[0.015]")}
                              style={{ height: ROW }}
                            />
                          );
                        })}
                        {dayList
                          .filter((a) => a.corretorId === p.id)
                          .map((a, i) => {
                            const top = ((minutesOf(a.hora) - START) / 30) * ROW;
                            const h = Math.max(ROW - 6, (a.duracaoMin / 30) * ROW - 6);
                            return (
                              <motion.button
                                key={a.id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setSelected(a)}
                                className="absolute left-1.5 right-1.5 overflow-hidden rounded-[12px] bg-carbon p-2.5 text-left shadow-[inset_3px_0_0_var(--bar)] transition-colors hover:bg-steel"
                                style={{ top: top + 3, height: h, "--bar": barColor(a.status) } as CSSProperties}
                              >
                                <p className="truncate text-[12px] font-semibold">{a.clienteNome}</p>
                                <p className="truncate text-[11px] text-ash">
                                  {a.hora} · {getProperty(a.imovelId)?.titulo}
                                </p>
                              </motion.button>
                            );
                          })}
                      </div>
                    );
                  })}
                  {isToday && <NowLine />}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`w-${toISODate(weekDays[0])}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          >
            {weekDays.map((d) => {
              const iso = toISODate(d);
              const list = visits.filter((a) => a.data === iso && a.status !== "cancelada");
              const today = iso === toISODate(startOfDay());
              return (
                <div key={iso} className="rounded-[24px] bg-graphite p-3 shadow-[inset_0_0_0_1px_var(--color-line)]">
                  <button
                    onClick={() => {
                      setDate(iso);
                      setView("dia");
                    }}
                    className="flex w-full items-baseline justify-between rounded-[14px] px-2 py-1.5 text-left hover:bg-white/[0.04]"
                  >
                    <span className={cn("text-[13px] uppercase tracking-wide", today ? "text-link" : "text-ash")}>{weekdayShort(d)}</span>
                    <span className={cn("text-[22px] font-semibold tabular", today && "text-link")}>{d.getDate()}</span>
                  </button>
                  <p className="px-2 text-[11px] text-slate">{list.length} visitas</p>
                  <ul className="mt-2 space-y-1.5">
                    {list.slice(0, 9).map((a) => (
                      <li key={a.id}>
                        <button
                          onClick={() => setSelected(a)}
                          className="flex w-full items-center gap-2 rounded-[12px] bg-white/[0.03] px-2.5 py-2 text-left hover:bg-white/[0.07]"
                        >
                          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusMeta[a.status].dot)} />
                          <span className="text-[12px] text-ash tabular">{a.hora}</span>
                          <span className="truncate text-[12px]">{a.clienteNome.split(" ")[0]}</span>
                        </button>
                      </li>
                    ))}
                    {list.length > 9 && <li className="px-2 pt-1 text-[12px] text-slate">+{list.length - 9} visitas</li>}
                  </ul>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <VisitDrawer
        visit={selected}
        onClose={() => setSelected(null)}
        onChange={(a) => {
          setSelected(a);
          setVersion((v) => v + 1);
        }}
      />
      <NewVisitModal
        open={creating}
        defaultDate={date}
        onClose={() => setCreating(false)}
        onCreated={(a) => {
          setCreating(false);
          setDate(a.data);
          setView("dia");
          setVersion((v) => v + 1);
        }}
      />
    </>
  );
}

const barColor = (s: Visita["status"]) =>
  statusMeta[s].color;

function Legend() {
  return (
    <div className="hidden items-center gap-3 text-[12px] text-ash md:flex">
      {(["confirmada", "pendente", "realizada"] as const).map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", statusMeta[s].dot)} />
          {statusMeta[s].label}
        </span>
      ))}
    </div>
  );
}

function NowLine() {
  const now = new Date();
  const m = now.getHours() * 60 + now.getMinutes();
  if (m < START || m > END) return null;
  const top = ((m - START) / 30) * ROW;
  return (
    <div className="pointer-events-none absolute left-[64px] right-0 z-10" style={{ top }}>
      <div className="relative h-px bg-danger">
        <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-danger" />
      </div>
    </div>
  );
}

function NewVisitModal({
  open,
  defaultDate,
  onClose,
  onCreated,
}: {
  open: boolean;
  defaultDate: string;
  onClose: () => void;
  onCreated: (a: Visita) => void;
}) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [imovelId, setImovelId] = useState(properties[0].id);
  const [brokerId, setBrokerId] = useState(properties[0].corretorId);
  const [data, setData] = useState(defaultDate);
  const [hora, setHora] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const slots = brokerId && data ? computeSlots(brokerId, data).filter((s) => s.disponivel) : [];

  const submit = async () => {
    if (nome.trim().length < 3 || !isValidPhone(tel) || !brokerId || !hora) {
      setErr("Preencha nome, telefone válido, imóvel e horário.");
      return;
    }
    setSaving(true);
    const created = await api.admin.createVisit({
      clienteNome: nome.trim(),
      clienteTelefone: tel,
      corretorId: brokerId,
      imovelId,
      data,
      hora,
      duracaoMin: settings.agenda.duracaoVisitaMin,
      status: "confirmada",
      origem: "WhatsApp",
    });
    setSaving(false);
    setNome("");
    setTel("");
    setHora("");
    setErr(null);
    onCreated(created);
  };

  const field = "h-11 w-full rounded-full bg-white/[0.04] px-4 text-[14px] outline-none shadow-[inset_0_0_0_1px_var(--color-slate)] focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Nova visita"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-50 max-h-[90svh] overflow-y-auto rounded-[28px] bg-graphite p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-[520px] sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-medium tracking-[-0.015em]">Nova visita</h2>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.06]" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] text-ash">Cliente</span>
                <input className={field} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] text-ash">Telefone</span>
                <input className={field} value={tel} onChange={(e) => setTel(maskPhone(e.target.value))} placeholder="(11) 99999-9999" inputMode="tel" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] text-ash">Imóvel</span>
                <select
                  className={field}
                  value={imovelId}
                  onChange={(e) => {
                    setImovelId(e.target.value);
                    setBrokerId(getProperty(e.target.value)?.corretorId ?? brokerId);
                    setHora("");
                  }}
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id} className="bg-graphite">{p.codigo} · {p.titulo}</option>
                  ))}
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] text-ash">Corretor</span>
                <select className={field} value={brokerId} onChange={(e) => { setBrokerId(e.target.value); setHora(""); }}>
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id} className="bg-graphite">{b.nome}</option>
                  ))}
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] text-ash">Data</span>
                <input type="date" className={cn(field, "[color-scheme:dark]")} value={data} onChange={(e) => { setData(e.target.value); setHora(""); }} />
              </label>
            </div>
            <p className="mb-2 mt-5 text-[12px] text-ash">
              Horários livres · {getBroker(brokerId)?.nome}
            </p>
            {slots.length ? (
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                {slots.map((s) => (
                  <button
                    key={s.hora}
                    onClick={() => setHora(s.hora)}
                    className={cn("h-9 rounded-full text-[13px] tabular transition-colors", hora === s.hora ? "bg-accent text-ink" : "bg-white/[0.05] hover:bg-white/[0.1]")}
                  >
                    {s.hora}
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-[16px] bg-white/[0.03] p-4 text-[13px] text-ash">Sem horários livres nesta data para este corretor.</p>
            )}
            {err && <p className="mt-4 text-[13px] text-danger">{err}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button onClick={submit} disabled={saving}>{saving ? "Salvando…" : "Salvar visita"}</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
