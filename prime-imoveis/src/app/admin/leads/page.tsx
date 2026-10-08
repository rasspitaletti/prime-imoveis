"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { leads } from "@/data/operations";
import { getProperty } from "@/data/properties";
import { whatsappLink } from "@/lib/utils";
import { api } from "@/services/api";
import type { Lead, StatusLead } from "@/types/entities";
import { AdminPageHeader, Avatar, EmptyState, LeadBadge, Panel, SearchInput, Segmented, leadMeta } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

const ago = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} ${d === 1 ? "dia" : "dias"}`;
};

export default function LeadsPage() {
  const [status, setStatus] = useState<"todos" | StatusLead>("todos");
  const [q, setQ] = useState("");
  const [, setVersion] = useState(0);

  const list = leads.filter(
    (l) =>
      (status === "todos" || l.status === status) &&
      (!q || `${l.nome} ${l.telefone} ${getProperty(l.imovelId ?? "")?.titulo ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [list.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = async (l: Lead, s: StatusLead) => {
    await api.admin.updateLeadStatus(l.id, s);
    setVersion((v) => v + 1);
  };

  return (
    <>
      <AdminPageHeader title="Leads" description="Interesses enviados pelo site, pelos portais e pelo WhatsApp." />
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented
          layoutId="lead-status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "todos", label: "Todos" },
            ...(Object.keys(leadMeta) as StatusLead[]).map((s) => ({ value: s, label: `${leadMeta[s].label}${counts[s] ? ` · ${counts[s]}` : ""}` })),
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="Nome, telefone ou imóvel" />
      </div>
      <Panel bodyClassName="p-2">
        {list.length === 0 ? (
          <EmptyState title="Nenhum lead encontrado" />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((l, i) => {
              const imv = l.imovelId ? getProperty(l.imovelId) : undefined;
              return (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 10) * 0.025 }}
                  className="grid gap-3 px-3 py-4 md:grid-cols-[1.1fr_1.4fr_auto] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={l.nome} size={38} />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">{l.nome}</p>
                      <p className="truncate text-[12px] text-ash tabular">
                        {l.telefone} · {l.origem} · {ago(l.criadoEm)}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    {imv ? (
                      <Link href={`/imoveis/${imv.slug}`} target="_blank" className="block truncate text-[13px] text-mist hover:text-porcelain">
                        {imv.codigo} · {imv.titulo}
                      </Link>
                    ) : (
                      <p className="text-[13px] text-mist">Contato geral</p>
                    )}
                    {l.mensagem && <p className="mt-0.5 truncate text-[12px] text-ash">“{l.mensagem}”</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <LeadBadge status={l.status} />
                    <select
                      value={l.status}
                      onChange={(e) => update(l, e.target.value as StatusLead)}
                      aria-label={`Status de ${l.nome}`}
                      className="h-9 rounded-full bg-white/[0.04] px-3 text-[12px] outline-none shadow-[inset_0_0_0_1px_var(--color-line)]"
                    >
                      {(Object.keys(leadMeta) as StatusLead[]).map((s) => (
                        <option key={s} value={s} className="bg-graphite">{leadMeta[s].label}</option>
                      ))}
                    </select>
                    <a
                      href={whatsappLink(
                        `Olá, ${l.nome.split(" ")[0]}! Aqui é da Prime Imóveis. Recebemos seu interesse${imv ? ` no imóvel ${imv.titulo}` : ""}. Posso te ajudar?`,
                        "55" + l.telefone.replace(/\D/g, ""),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Responder ${l.nome} no WhatsApp`}
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366]/15 text-[#4be08a] hover:bg-[#25D366]/25"
                    >
                      <WhatsAppIcon size={16} />
                    </a>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
