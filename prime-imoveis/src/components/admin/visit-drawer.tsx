"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Check, Clock, House, Phone, X } from "lucide-react";
import { getBroker } from "@/data/brokers";
import { getProperty } from "@/data/properties";
import { formatLongDate } from "@/lib/date";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/utils";
import { api } from "@/services/api";
import type { StatusVisita, Visita } from "@/types/entities";
import { Avatar, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

export function VisitDrawer({ visit, onClose, onChange }: { visit: Visita | null; onClose: () => void; onChange: (v: Visita) => void }) {
  const [busy, setBusy] = useState<StatusVisita | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setStatus = async (status: StatusVisita) => {
    if (!visit) return;
    setBusy(status);
    const updated = await api.admin.updateVisitStatus(visit.id, status);
    setBusy(null);
    onChange(updated);
  };

  const v = visit;
  const imovel = v ? getProperty(v.imovelId) : undefined;
  const broker = v ? getBroker(v.corretorId) : undefined;

  return (
    <AnimatePresence>
      {v && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/60" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Detalhes da visita"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-graphite shadow-[inset_1px_0_0_var(--color-line)]"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="text-[13px] text-ash tabular">Visita #{v.id.toUpperCase()}</p>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.06]" aria-label="Fechar">
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-center gap-4">
                <Avatar name={v.clienteNome} size={52} />
                <div>
                  <p className="text-[19px] font-medium tracking-[-0.01em]">{v.clienteNome}</p>
                  <p className="text-[13px] text-ash">Origem: {v.origem}</p>
                </div>
              </div>
              <div className="mt-5">
                <StatusBadge status={v.status} />
              </div>

              {imovel && (
                <Link href={`/imoveis/${imovel.slug}`} target="_blank" className="mt-6 flex gap-3 rounded-[20px] bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imovel.imagens[0]} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{imovel.titulo}</p>
                    <p className="truncate text-[12px] text-ash">
                      {imovel.codigo} · {imovel.endereco.bairro} · {formatPrice(imovel)}
                    </p>
                  </div>
                  <ArrowUpRight size={15} className="shrink-0 text-slate" />
                </Link>
              )}

              <dl className="mt-3 space-y-4 rounded-[20px] bg-white/[0.03] p-5 text-[14px]">
                <Item icon={<CalendarDays size={15} />} label="Data" value={<span className="capitalize">{formatLongDate(v.data)}</span>} />
                <Item icon={<Clock size={15} />} label="Horário" value={`${v.hora} · ${v.duracaoMin} min`} />
                <Item icon={<House size={15} />} label="Corretor" value={broker?.nome} />
                <Item icon={<Phone size={15} />} label="Telefone" value={v.clienteTelefone} />
              </dl>
              <a
                href={whatsappLink(
                  `Olá, ${v.clienteNome.split(" ")[0]}! Aqui é ${broker?.nome.split(" ")[0] ?? "da imobiliária"}. Confirmando sua visita ao imóvel ${imovel?.titulo ?? ""} em ${formatLongDate(v.data)} às ${v.hora}. Podemos confirmar?`,
                  "55" + v.clienteTelefone.replace(/\D/g, ""),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366]/15 text-[14px] font-medium text-[#4be08a] hover:bg-[#25D366]/25"
              >
                <WhatsAppIcon size={18} /> Enviar confirmação ao cliente
              </a>
            </div>
            <footer className="grid grid-cols-2 gap-2 border-t border-line p-4">
              {v.status !== "confirmada" && v.status !== "realizada" && (
                <Button onClick={() => setStatus("confirmada")} disabled={!!busy} icon={<Check size={16} />}>
                  {busy === "confirmada" ? "Salvando…" : "Confirmar"}
                </Button>
              )}
              {v.status === "confirmada" && (
                <Button onClick={() => setStatus("realizada")} disabled={!!busy} variant="light">
                  {busy === "realizada" ? "Salvando…" : "Marcar realizada"}
                </Button>
              )}
              {v.status !== "cancelada" && v.status !== "realizada" && (
                <Button onClick={() => setStatus("cancelada")} disabled={!!busy} variant="secondary">
                  {busy === "cancelada" ? "Salvando…" : "Cancelar"}
                </Button>
              )}
              {(v.status === "cancelada" || v.status === "realizada") && (
                <Button onClick={() => setStatus("pendente")} disabled={!!busy} variant="secondary" className="col-span-2">
                  Reabrir
                </Button>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Item({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate">{icon}</span>
      <div>
        <dt className="text-[12px] text-ash">{label}</dt>
        <dd className="mt-0.5">{value}</dd>
      </div>
    </div>
  );
}
