"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { visits } from "@/data/operations";
import { brokers, getBroker } from "@/data/brokers";
import { getProperty } from "@/data/properties";
import { addDays, formatShortDate, startOfDay, toISODate } from "@/lib/date";
import type { StatusVisita, Visita } from "@/types/entities";
import { AdminPageHeader, Avatar, EmptyState, Panel, SearchInput, Segmented, StatusBadge } from "@/components/admin/ui";
import { VisitDrawer } from "@/components/admin/visit-drawer";
import { Button } from "@/components/ui/button";

type Period = "hoje" | "7d" | "30d" | "todos";
const PAGE = 12;
const sel = "h-10 rounded-full bg-white/[0.04] px-4 text-[13px] outline-none shadow-[inset_0_0_0_1px_var(--color-line)]";

export default function VisitasPage() {
  const [status, setStatus] = useState<"todos" | StatusVisita>("todos");
  const [period, setPeriod] = useState<Period>("7d");
  const [broker, setBroker] = useState("todos");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Visita | null>(null);
  const [version, setVersion] = useState(0);

  const list = useMemo(() => {
    const today = toISODate(startOfDay());
    const until = period === "hoje" ? today : period === "7d" ? toISODate(addDays(startOfDay(), 6)) : period === "30d" ? toISODate(addDays(startOfDay(), 29)) : "9999";
    const from = period === "todos" ? "0000" : today;
    const term = q.trim().toLowerCase();
    return visits.filter((v) => {
      const imv = getProperty(v.imovelId);
      return (
        v.data >= from &&
        v.data <= until &&
        (status === "todos" || v.status === status) &&
        (broker === "todos" || v.corretorId === broker) &&
        (!term || v.clienteNome.toLowerCase().includes(term) || v.clienteTelefone.includes(term) || (imv && `${imv.titulo} ${imv.codigo}`.toLowerCase().includes(term)))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, period, broker, q, version]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const current = list.slice(page * PAGE, page * PAGE + PAGE);
  const reset = () => setPage(0);
  const pendentes = useMemo(() => visits.filter((v) => v.status === "pendente").length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]);

  return (
    <>
      <AdminPageHeader
        title="Visitas"
        description="Solicitações do site, WhatsApp e assistente em um só lugar."
        actions={
          <Button variant="secondary" size="sm" className="h-10" icon={<Download size={15} />} onClick={() => exportCSV(list)}>
            Exportar CSV
          </Button>
        }
      />

      <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Segmented
          layoutId="visit-status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            reset();
          }}
          options={[
            { value: "todos", label: "Todas" },
            { value: "pendente", label: `Pendentes · ${pendentes}` },
            { value: "confirmada", label: "Confirmadas" },
            { value: "realizada", label: "Realizadas" },
            { value: "cancelada", label: "Canceladas" },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput value={q} onChange={(v) => { setQ(v); reset(); }} placeholder="Cliente, telefone ou imóvel" />
          <select value={period} onChange={(e) => { setPeriod(e.target.value as Period); reset(); }} className={sel} aria-label="Período">
            <option value="hoje" className="bg-graphite">Hoje</option>
            <option value="7d" className="bg-graphite">Próximos 7 dias</option>
            <option value="30d" className="bg-graphite">Próximos 30 dias</option>
            <option value="todos" className="bg-graphite">Todo o histórico</option>
          </select>
          <select value={broker} onChange={(e) => { setBroker(e.target.value); reset(); }} className={sel} aria-label="Corretor">
            <option value="todos" className="bg-graphite">Todos os corretores</option>
            {brokers.map((b) => (
              <option key={b.id} value={b.id} className="bg-graphite">{b.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <Panel bodyClassName="p-0">
        {current.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Nenhuma visita encontrada" text="Ajuste os filtros ou o período." />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-line text-[12px] text-ash">
                    <th className="px-6 py-3.5 font-medium">Cliente</th>
                    <th className="px-4 py-3.5 font-medium">Data</th>
                    <th className="px-4 py-3.5 font-medium">Imóvel</th>
                    <th className="px-4 py-3.5 font-medium">Corretor</th>
                    <th className="px-4 py-3.5 font-medium">Origem</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {current.map((v) => {
                    const imv = getProperty(v.imovelId);
                    return (
                      <tr key={v.id} onClick={() => setSelected(v)} className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-white/[0.025]">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={v.clienteNome} size={32} />
                            <div>
                              <p className="font-medium">{v.clienteNome}</p>
                              <p className="text-[12px] text-ash tabular">{v.clienteTelefone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 tabular">
                          {formatShortDate(v.data)} <span className="text-ash">· {v.hora}</span>
                        </td>
                        <td className="max-w-[260px] px-4 py-3.5">
                          <p className="truncate text-mist">{imv?.titulo}</p>
                          <p className="text-[12px] text-slate">{imv?.codigo} · {imv?.endereco.bairro}</p>
                        </td>
                        <td className="px-4 py-3.5 text-mist">{getBroker(v.corretorId)?.nome}</td>
                        <td className="px-4 py-3.5 text-ash">{v.origem}</td>
                        <td className="px-6 py-3.5">
                          <StatusBadge status={v.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-line md:hidden">
              {current.map((v) => (
                <li key={v.id}>
                  <button onClick={() => setSelected(v)} className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-white/[0.03]">
                    <Avatar name={v.clienteNome} size={38} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{v.clienteNome}</p>
                      <p className="truncate text-[12px] text-ash">
                        {formatShortDate(v.data)} · {v.hora} · {getProperty(v.imovelId)?.codigo}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="flex items-center justify-between border-t border-line px-6 py-3 text-[13px] text-ash">
          <span className="tabular">
            {list.length} resultado{list.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/[0.06] disabled:opacity-30" aria-label="Página anterior">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 tabular">{page + 1} / {pages}</span>
            <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/[0.06] disabled:opacity-30" aria-label="Próxima página">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Panel>

      <VisitDrawer
        visit={selected}
        onClose={() => setSelected(null)}
        onChange={(v) => {
          setSelected(v);
          setVersion((x) => x + 1);
        }}
      />
    </>
  );
}

function exportCSV(list: Visita[]) {
  const header = ["id", "cliente", "telefone", "data", "hora", "imovel", "codigo", "corretor", "status", "origem"];
  const rows = list.map((v) => {
    const imv = getProperty(v.imovelId);
    return [v.id, v.clienteNome, v.clienteTelefone, v.data, v.hora, imv?.titulo, imv?.codigo, getBroker(v.corretorId)?.nome, v.status, v.origem]
      .map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`)
      .join(";");
  });
  const blob = new Blob(["﻿" + [header.join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `visitas-${toISODate(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
