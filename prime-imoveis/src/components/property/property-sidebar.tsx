"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, LoaderCircle, Mail, MessageSquare, Phone, User } from "lucide-react";
import { whatsappPropertyMessage } from "@/config/agency";
import { getBroker } from "@/data/brokers";
import { formatBRL, formatPrice } from "@/lib/format";
import { cn, isValidPhone, maskPhone, whatsappLink } from "@/lib/utils";
import { api } from "@/services/api";
import type { Imovel } from "@/types/entities";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { SmartImage } from "@/components/ui/smart-image";
import { BookingFlow, Field } from "@/components/booking/booking-flow";
import { Segmented } from "@/components/admin/ui";

/** Card de preço + conversão (WhatsApp, formulário de interesse e agendamento de visita). */
export function PropertySidebar({ property: p }: { property: Imovel }) {
  const [tab, setTab] = useState<"interesse" | "visita">("interesse");
  const broker = getBroker(p.corretorId);

  return (
    <div className="space-y-3">
      <div className="rounded-[28px] bg-graphite p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ash">{p.finalidade === "venda" ? "Valor de venda" : "Aluguel mensal"}</p>
        <p className="t-price mt-2 text-[34px] leading-none">{formatPrice(p)}</p>
        {(p.condominio || p.iptu) && (
          <dl className="mt-5 grid grid-cols-2 gap-2 text-[13px]">
            {p.condominio ? (
              <div className="rounded-2xl bg-white/[0.03] px-3.5 py-3">
                <dt className="text-ash">Condomínio</dt>
                <dd className="mt-0.5 tabular">{formatBRL(p.condominio)}/mês</dd>
              </div>
            ) : null}
            {p.iptu ? (
              <div className="rounded-2xl bg-white/[0.03] px-3.5 py-3">
                <dt className="text-ash">IPTU</dt>
                <dd className="mt-0.5 tabular">{formatBRL(p.iptu)}/ano</dd>
              </div>
            ) : null}
          </dl>
        )}
        <a
          href={whatsappLink(whatsappPropertyMessage(p.titulo, p.codigo))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#25D366] text-[15px] font-semibold text-[#05290f] transition-transform active:scale-[0.98]"
        >
          <WhatsAppIcon size={19} /> Tenho interesse neste imóvel
        </a>
        {broker && (
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
            <SmartImage src={broker.foto} alt={broker.nome} tone="none" className="h-12 w-12 shrink-0 rounded-full" imgClassName="object-top" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium">{broker.nome}</p>
              <p className="truncate text-[12px] text-ash">{broker.creci}</p>
            </div>
            <a
              href={`tel:+55${broker.telefone.replace(/\D/g, "")}`}
              aria-label={`Ligar para ${broker.nome}`}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-mist hover:bg-white/[0.12] hover:text-porcelain"
            >
              <Phone size={16} />
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Segmented
          layoutId="pp-tab"
          value={tab}
          onChange={setTab}
          options={[
            { value: "interesse", label: "Receber informações" },
            { value: "visita", label: "Agendar visita" },
          ]}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tab === "interesse" ? <InterestForm property={p} /> : <BookingFlow propertyId={p.id} compact />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function InterestForm({ property: p, className }: { property?: Imovel; className?: string }) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(p ? `Olá, tenho interesse no imóvel ${p.titulo} (${p.codigo}). Gostaria de receber mais informações.` : "");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const nomeOk = nome.trim().length >= 3;
  const telOk = isValidPhone(tel);
  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async () => {
    setTouched(true);
    if (!nomeOk || !telOk || !emailOk) return;
    setStatus("sending");
    try {
      await api.leads.create({ imovelId: p?.id, nome: nome.trim(), telefone: tel, email: email || undefined, mensagem: msg || undefined });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("rounded-[28px] bg-graphite p-8 text-center shadow-[inset_0_0_0_1px_var(--color-line)]", className)}
        role="status"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint/15 text-mint">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <p className="t-h3 mt-5">Recebemos seu interesse.</p>
        <p className="mt-3 text-[14px] font-light leading-relaxed text-ash">Um corretor entra em contato em até 1 hora útil pelo telefone informado.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn("space-y-4 rounded-[28px] bg-graphite p-6 shadow-[inset_0_0_0_1px_var(--color-line)]", className)}
      noValidate
    >
      <div>
        <p className="t-h3">Receba mais informações</p>
        <p className="mt-1.5 text-[13px] font-light text-ash">Fotos extras, documentação e condições de negociação.</p>
      </div>
      <Field id="lead-nome" label="Nome" icon={<User size={16} />} value={nome} onChange={setNome} autoComplete="name" placeholder="Seu nome" error={touched && !nomeOk ? "Informe seu nome." : undefined} />
      <Field
        id="lead-tel"
        label="Telefone / WhatsApp"
        icon={<Phone size={16} />}
        value={tel}
        onChange={(v) => setTel(maskPhone(v))}
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(11) 99999-9999"
        error={touched && !telOk ? "Telefone incompleto." : undefined}
      />
      <Field id="lead-email" label="E-mail (opcional)" icon={<Mail size={16} />} value={email} onChange={setEmail} type="email" autoComplete="email" placeholder="voce@email.com" error={touched && !emailOk ? "E-mail inválido." : undefined} />
      <div>
        <label htmlFor="lead-msg" className="mb-2 flex items-center gap-1.5 text-[13px] text-ash">
          <MessageSquare size={14} /> Mensagem
        </label>
        <textarea
          id="lead-msg"
          rows={3}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full resize-none rounded-[20px] bg-white/[0.04] px-5 py-4 text-[15px] text-porcelain outline-none shadow-[inset_0_0_0_1px_var(--color-slate)] focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]"
        />
      </div>
      {status === "error" && <p className="text-[13px] text-danger">Não foi possível enviar. Tente novamente ou chame no WhatsApp.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-medium text-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "sending" ? <LoaderCircle size={16} className="animate-spin" /> : null}
        {status === "sending" ? "Enviando…" : "Quero receber informações"}
      </button>
      <p className="text-center text-[11px] text-slate">Seus dados são protegidos conforme a LGPD.</p>
    </form>
  );
}
