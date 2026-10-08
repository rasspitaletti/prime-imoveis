"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, CalendarCheck2, CalendarClock, CalendarDays, CalendarPlus, CalendarX2, FilePenLine, House, Inbox, Users } from "lucide-react";
import { activities, clients, leads, visits, type Activity } from "@/data/operations";
import { brokers, getBroker } from "@/data/brokers";
import { getProperty, properties } from "@/data/properties";
import { addDays, startOfDay, toISODate, weekdayShort } from "@/lib/date";
import { computeSlots } from "@/services/availability";
import { AdminPageHeader, Avatar, LeadBadge, Panel, Segmented, StatCard, StatusBadge, statusMeta } from "@/components/admin/ui";
import { BarChart, Ring, StackedBar } from "@/components/admin/charts";
import { ButtonLink } from "@/components/ui/button";

const activityIcon: Record<Activity["tipo"], { icon: typeof Users; color: string }> = {
  visita: { icon: CalendarPlus, color: "var(--color-link)" },
  confirmacao: { icon: CalendarCheck2, color: "var(--color-mint)" },
  cancelamento: { icon: CalendarX2, color: "var(--color-danger)" },
  lead: { icon: Inbox, color: "var(--color-sky)" },
  proposta: { icon: FilePenLine, color: "var(--color-accent)" },
  assistente: { icon: Bot, color: "var(--color-violet)" },
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};

export default function DashboardPage() {
  const [brokerFilter, setBrokerFilter] = useState<string>("todos");

  const data = useMemo(() => {
    const today = startOfDay();
    const todayISO = toISODate(today);
    const weekEnd = toISODate(addDays(today, 6));
    const filtered = visits.filter((v) => brokerFilter === "todos" || v.corretorId === brokerFilter);
    const active = filtered.filter((v) => v.status !== "cancelada");

    const todayList = active.filter((v) => v.data === todayISO);
    const week = active.filter((v) => v.data >= todayISO && v.data <= weekEnd);
    const prevWeek = active.filter((v) => v.data >= toISODate(addDays(today, -7)) && v.data < todayISO);

    const now = new Date();
    const nowHHmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const upcoming = todayList.filter((v) => v.hora >= nowHHmm).slice(0, 6);
    const nextList = upcoming.length ? upcoming : week.filter((v) => v.data > todayISO).slice(0, 6);

    const chart = Array.from({ length: 14 }, (_, i) => {
      const d = addDays(today, i - 7);
      const iso = toISODate(d);
      return { label: i === 7 ? "Hoje" : `${d.getDate()}`, sub: weekdayShort(d), value: active.filter((v) => v.data === iso).length, highlight: i === 7 };
    });

    const bs = brokerFilter === "todos" ? brokers : brokers.filter((b) => b.id === brokerFilter);
    const freeToday = bs.map((b) => {
      const s = computeSlots(b.id, todayISO);
      return { broker: b, free: s.filter((x) => x.disponivel), total: s.length };
    });
    const totalSlots = freeToday.reduce((a, f) => a + f.total, 0);
    const occupancy = totalSlots ? Math.round(((totalSlots - freeToday.reduce((a, f) => a + f.free.length, 0)) / totalSlots) * 100) : 0;

    const myLeads = leads.filter((l) => brokerFilter === "todos" || getProperty(l.imovelId ?? "")?.corretorId === brokerFilter);

    return {
      todayCount: todayList.length,
      weekCount: week.length,
      weekDelta: prevWeek.length ? Math.round(((week.length - prevWeek.length) / prevWeek.length) * 100) : 0,
      confirmed: week.filter((v) => v.status === "confirmada").length,
      pending: week.filter((v) => v.status === "pendente").length,
      cancelled: filtered.filter((v) => v.status === "cancelada" && v.data >= todayISO && v.data <= weekEnd).length,
      newLeads: myLeads.filter((l) => l.status === "novo").length,
      recentLeads: myLeads.slice(0, 5),
      nextList,
      showingNextDays: !upcoming.length,
      chart,
      freeToday,
      occupancy,
    };
  }, [brokerFilter]);

  return (
    <>
      <AdminPageHeader
        title={greeting()}
        description="Visitas, leads e agenda da imobiliária hoje e nos próximos 7 dias."
        actions={
          <>
            <Segmented
              layoutId="dash-broker"
              value={brokerFilter}
              onChange={setBrokerFilter}
              options={[{ value: "todos", label: "Todos" }, ...brokers.map((b) => ({ value: b.id, label: b.nome.split(" ")[0] }))]}
            />
            <ButtonLink href="/admin/agenda" size="sm" className="h-10" icon={<CalendarPlus size={15} />}>
              Nova visita
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Visitas hoje" value={data.todayCount} hint="agendadas" icon={<CalendarDays size={15} />} accent="var(--color-accent)" />
        <StatCard label="Próximos 7 dias" value={data.weekCount} delta={data.weekDelta} hint="vs. semana anterior" icon={<CalendarClock size={15} />} delay={0.04} />
        <StatCard label="Leads novos" value={data.newLeads} hint="aguardando contato" icon={<Inbox size={15} />} accent="var(--color-sky)" delay={0.08} />
        <StatCard label="Clientes" value={clients.length} delta={9} hint="no mês" icon={<Users size={15} />} delay={0.12} />
        <StatCard label="Imóveis ativos" value={properties.filter((p) => p.ativo).length} hint={`${properties.filter((p) => p.destaque).length} em destaque`} icon={<House size={15} />} delay={0.16} />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Visitas por dia" action={<span className="text-[12px] text-ash">últimos 7 dias e próximos 7</span>}>
          <BarChart data={data.chart} height={220} />
        </Panel>
        <Panel title="Status da semana">
          <StackedBar
            parts={[
              { label: "Confirmadas", value: data.confirmed, color: statusMeta.confirmada.color },
              { label: "Pendentes", value: data.pending, color: statusMeta.pendente.color },
              { label: "Canceladas", value: data.cancelled, color: statusMeta.cancelada.color },
            ]}
          />
          <p className="mt-4 text-[13px] text-ash">
            Taxa de confirmação:{" "}
            <span className="font-medium text-porcelain tabular">{Math.round((data.confirmed / Math.max(1, data.confirmed + data.pending)) * 100)}%</span>
          </p>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title={data.showingNextDays ? "Próximas visitas" : "Próximas visitas de hoje"}
          action={
            <Link href="/admin/visitas" className="inline-flex items-center gap-1 text-[13px] text-link hover:underline">
              Ver todas <ArrowUpRight size={14} />
            </Link>
          }
          bodyClassName="p-2 md:p-3"
        >
          {data.nextList.length === 0 ? (
            <p className="p-6 text-center text-[14px] text-ash">Nenhuma visita nos próximos dias.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.nextList.map((v, i) => {
                const imv = getProperty(v.imovelId);
                return (
                  <motion.li
                    key={v.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-3 rounded-[16px] px-3 py-3 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-[16px] font-medium tabular">{v.hora}</p>
                      <p className="text-[11px] text-slate">{data.showingNextDays ? `${v.data.slice(8)}/${v.data.slice(5, 7)}` : "hoje"}</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {imv && <img src={imv.imagens[0]} alt="" className="hidden h-11 w-14 shrink-0 rounded-lg object-cover sm:block" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{v.clienteNome}</p>
                      <p className="truncate text-[12px] text-ash">
                        {imv?.titulo} · {getBroker(v.corretorId)?.nome.split(" ")[0]}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </motion.li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Horários livres hoje">
          <div className="flex items-center gap-5">
            <Ring value={data.occupancy} label="ocupação" size={108} />
            <p className="text-[13px] leading-relaxed text-ash">
              {data.freeToday.reduce((a, f) => a + f.free.length, 0)} horários de visita ainda livres hoje.
            </p>
          </div>
          <div className="mt-5 space-y-4">
            {data.freeToday.map(({ broker, free, total }) => (
              <div key={broker.id}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">{broker.nome}</span>
                  <span className="text-ash tabular">{total ? `${free.length}/${total}` : "não atende hoje"}</span>
                </div>
                {free.length > 0 && (
                  <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
                    {free.slice(0, 8).map((s) => (
                      <span key={s.hora} className="shrink-0 rounded-full bg-white/[0.05] px-2.5 py-1 text-[12px] text-mist tabular">
                        {s.hora}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <Panel
          title="Leads recentes"
          action={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-[13px] text-link hover:underline">
              Ver todos <ArrowUpRight size={14} />
            </Link>
          }
          bodyClassName="p-2 md:p-3"
        >
          <ul className="divide-y divide-line">
            {data.recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-3 py-3">
                <Avatar name={l.nome} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{l.nome}</p>
                  <p className="truncate text-[12px] text-ash">{l.imovelId ? getProperty(l.imovelId)?.titulo : "Contato geral"}</p>
                </div>
                <LeadBadge status={l.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Atividades recentes">
          <ul className="space-y-1">
            {activities.map((act, i) => {
              const m = activityIcon[act.tipo];
              return (
                <motion.li key={act.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 * i }} className="flex items-center gap-3 py-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.05]" style={{ color: m.color }}>
                    <m.icon size={16} />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[14px]">{act.texto}</p>
                  <span className="shrink-0 text-[12px] text-slate">{act.quando}</span>
                </motion.li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </>
  );
}
