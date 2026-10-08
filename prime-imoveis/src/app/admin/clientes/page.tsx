"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, X } from "lucide-react";
import { clients, visits } from "@/data/operations";
import { getBroker } from "@/data/brokers";
import { getProperty } from "@/data/properties";
import { formatShortDate, toISODate } from "@/lib/date";
import { whatsappLink } from "@/lib/utils";
import type { Cliente } from "@/types/entities";
import { AdminPageHeader, Avatar, EmptyState, Panel, SearchInput, Segmented, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

type Perfil = "todos" | Cliente["perfil"];

export default function ClientesPage() {
  const [q, setQ] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("todos");
  const [selected, setSelected] = useState<Cliente | null>(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return clients
      .filter((c) => (perfil === "todos" || c.perfil === perfil) && (!t || c.nome.toLowerCase().includes(t) || c.telefone.includes(t)))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [q, perfil]);

  const history = useMemo(() => (selected ? visits.filter((v) => v.clienteId === selected.id).sort((a, b) => b.data.localeCompare(a.data)) : []), [selected]);

  return (
    <>
      <AdminPageHeader
        title="Clientes"
        description={`${clients.length} clientes cadastrados. Dados fictícios para demonstração.`}
        actions={
          <Button size="sm" className="h-10" icon={<UserPlus size={15} />} disabled title="Disponível com o backend">
            Novo cliente
          </Button>
        }
      />
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented
          layoutId="cli-perfil"
          value={perfil}
          onChange={setPerfil}
          options={[
            { value: "todos", label: "Todos" },
            { value: "Comprador", label: "Compradores" },
            { value: "Locatário", label: "Locatários" },
            { value: "Proprietário", label: "Proprietários" },
            { value: "Investidor", label: "Investidores" },
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nome ou telefone" />
      </div>
      <Panel bodyClassName="p-2">
        {list.length === 0 ? (
          <EmptyState title="Nenhum cliente encontrado" />
        ) : (
          <ul className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <li key={c.id}>
                <button onClick={() => setSelected(c)} className="flex w-full items-center gap-3 rounded-[18px] p-3 text-left transition-colors hover:bg-white/[0.04]">
                  <Avatar name={c.nome} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{c.nome}</p>
                    <p className="truncate text-[12px] text-ash tabular">
                      {c.telefone} · {c.totalVisitas} visitas
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-ash">{c.perfil}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-50 bg-black/60" />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`Cliente ${selected.nome}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-graphite"
            >
              <header className="flex items-center justify-between border-b border-line px-6 py-4">
                <p className="text-[13px] text-ash">Ficha do cliente</p>
                <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.06]" aria-label="Fechar">
                  <X size={18} />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-4">
                  <Avatar name={selected.nome} size={56} />
                  <div>
                    <p className="text-[20px] font-medium tracking-[-0.015em]">{selected.nome}</p>
                    <p className="text-[13px] text-ash">
                      {selected.perfil} · desde {formatShortDate(toISODate(new Date(selected.criadoEm)))}
                    </p>
                  </div>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-2 text-[13px]">
                  {[
                    ["Telefone", selected.telefone],
                    ["E-mail", selected.email ?? "—"],
                    ["Origem", selected.origem],
                    ["Última visita", selected.ultimaVisita ? formatShortDate(selected.ultimaVisita) : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[16px] bg-white/[0.03] p-3">
                      <dt className="text-ash">{k}</dt>
                      <dd className="mt-0.5 truncate">{v}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={whatsappLink(`Olá, ${selected.nome.split(" ")[0]}! Tudo bem?`, "55" + selected.telefone.replace(/\D/g, ""))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366]/15 text-[14px] font-medium text-[#4be08a] hover:bg-[#25D366]/25"
                >
                  <WhatsAppIcon size={17} /> Conversar no WhatsApp
                </a>
                <h3 className="mb-3 mt-8 text-[14px] font-medium">Histórico de visitas</h3>
                {history.length === 0 ? (
                  <EmptyState title="Sem visitas registradas" />
                ) : (
                  <ul className="space-y-2">
                    {history.map((v) => (
                      <li key={v.id} className="flex items-center justify-between gap-3 rounded-[16px] bg-white/[0.03] p-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px]">{getProperty(v.imovelId)?.titulo}</p>
                          <p className="truncate text-[12px] text-ash">
                            {formatShortDate(v.data)} · {v.hora} · {getBroker(v.corretorId)?.nome}
                          </p>
                        </div>
                        <StatusBadge status={v.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
