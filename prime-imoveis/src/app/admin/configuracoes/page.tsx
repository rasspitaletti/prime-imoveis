"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Building2, CalendarClock, Check, Bell, Palette, PlugZap, Database, CalendarDays } from "lucide-react";
import { agency, settings as seed } from "@/config/agency";
import type { Configuracao } from "@/types/entities";
import { AdminPageHeader, Panel, Toggle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

const input =
  "h-11 w-full rounded-full bg-white/[0.04] px-4 text-[14px] outline-none shadow-[inset_0_0_0_1px_var(--color-slate)] focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]";

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-ash">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block pl-4 text-[11px] text-slate">{hint}</span>}
    </label>
  );
}

function Row({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[14px] font-medium">{title}</p>
        <p className="text-[12px] text-ash">{text}</p>
      </div>
      {children}
    </div>
  );
}

const Title = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <span className="inline-flex items-center gap-2">
    <span className="text-ash">{icon}</span>
    {children}
  </span>
);

export default function ConfiguracoesPage() {
  const [cfg, setCfg] = useState<Configuracao>(() => structuredClone(seed));
  const [info, setInfo] = useState({
    nome: agency.nome,
    telefone: agency.contato.telefone,
    whatsapp: agency.contato.whatsapp,
    email: agency.contato.email,
    endereco: `${agency.endereco.logradouro} — ${agency.endereco.bairro}, ${agency.endereco.cidade}/${agency.endereco.uf}`,
    instagram: agency.redes.instagram.url,
    facebook: agency.redes.facebook.url,
    tiktok: agency.redes.tiktok.url,
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    // Com o backend: PUT /admin/configuracoes
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  const ag = cfg.agenda;
  const setAg = (patch: Partial<Configuracao["agenda"]>) => setCfg((c) => ({ ...c, agenda: { ...c.agenda, ...patch } }));
  const setNot = (patch: Partial<Configuracao["notificacoes"]>) => setCfg((c) => ({ ...c, notificacoes: { ...c.notificacoes, ...patch } }));

  return (
    <>
      <AdminPageHeader
        title="Configurações"
        description="Dados da imobiliária, agenda, notificações e integrações."
        actions={
          <Button size="sm" className="h-10" onClick={save} icon={<Check size={15} />}>
            Salvar alterações
          </Button>
        }
      />

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title={(<Title icon={<Building2 size={15} />}>Dados da imobiliária</Title>)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da imobiliária">
              <input className={input} value={info.nome} onChange={(e) => setInfo({ ...info, nome: e.target.value })} />
            </Field>
            <Field label="Telefone">
              <input className={input} value={info.telefone} onChange={(e) => setInfo({ ...info, telefone: e.target.value })} />
            </Field>
            <Field label="WhatsApp (com DDI)" hint="Somente números. Ex.: 5511999999999">
              <input className={input} value={info.whatsapp} onChange={(e) => setInfo({ ...info, whatsapp: e.target.value.replace(/\D/g, "") })} />
            </Field>
            <Field label="E-mail">
              <input className={input} type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Endereço">
                <input className={input} value={info.endereco} onChange={(e) => setInfo({ ...info, endereco: e.target.value })} />
              </Field>
            </div>
            <Field label="Instagram">
              <input className={input} value={info.instagram} onChange={(e) => setInfo({ ...info, instagram: e.target.value })} />
            </Field>
            <Field label="Facebook">
              <input className={input} value={info.facebook} onChange={(e) => setInfo({ ...info, facebook: e.target.value })} />
            </Field>
            <Field label="TikTok">
              <input className={input} value={info.tiktok} onChange={(e) => setInfo({ ...info, tiktok: e.target.value })} />
            </Field>
          </div>
        </Panel>

        <div className="grid gap-3">
          <Panel title={(<Title icon={<CalendarClock size={15} />}>Agenda de visitas</Title>)}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Abertura">
                <input type="time" className={`${input} [color-scheme:dark]`} value={ag.abertura} onChange={(e) => setAg({ abertura: e.target.value })} />
              </Field>
              <Field label="Fechamento">
                <input type="time" className={`${input} [color-scheme:dark]`} value={ag.fechamento} onChange={(e) => setAg({ fechamento: e.target.value })} />
              </Field>
              <Field label="Duração da visita">
                <select className={input} value={ag.duracaoVisitaMin} onChange={(e) => setAg({ duracaoVisitaMin: Number(e.target.value), intervaloMin: Number(e.target.value) })}>
                  {[30, 45, 60, 90].map((m) => (
                    <option key={m} value={m} className="bg-graphite">{m} min</option>
                  ))}
                </select>
              </Field>
              <Field label="Pausa início">
                <input type="time" className={`${input} [color-scheme:dark]`} value={ag.pausaInicio} onChange={(e) => setAg({ pausaInicio: e.target.value })} />
              </Field>
              <Field label="Pausa fim">
                <input type="time" className={`${input} [color-scheme:dark]`} value={ag.pausaFim} onChange={(e) => setAg({ pausaFim: e.target.value })} />
              </Field>
              <Field label="Antecedência mín.">
                <select className={input} value={ag.antecedenciaMinimaHoras} onChange={(e) => setAg({ antecedenciaMinimaHoras: Number(e.target.value) })}>
                  {[0, 1, 2, 4, 12, 24].map((h) => (
                    <option key={h} value={h} className="bg-graphite">{h}h</option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title={(<Title icon={<Bell size={15} />}>Notificações</Title>)} bodyClassName="px-5 py-2 md:px-6">
            <div className="divide-y divide-line">
              <Row title="Confirmação por WhatsApp" text="Mensagem automática ao receber uma solicitação de visita.">
                <Toggle checked={cfg.notificacoes.whatsappConfirmacao} onChange={(v) => setNot({ whatsappConfirmacao: v })} label="Confirmação por WhatsApp" />
              </Row>
              <Row title="Lembrete 24h antes" text="Reduz ausências com um lembrete no dia anterior.">
                <Toggle checked={cfg.notificacoes.lembrete24h} onChange={(v) => setNot({ lembrete24h: v })} label="Lembrete 24h" />
              </Row>
              <Row title="E-mail a cada novo lead" text="Avisa o corretor responsável na hora.">
                <Toggle checked={cfg.notificacoes.emailNovoLead} onChange={(v) => setNot({ emailNovoLead: v })} label="E-mail de novo lead" />
              </Row>
            </div>
          </Panel>
        </div>

        <Panel title={(<Title icon={<Bot size={15} />}>Assistente virtual</Title>)}>
          <Row title="Assistente ativo no site" text="Exibe o chat nas páginas públicas.">
            <Toggle checked={cfg.assistente.ativo} onChange={(v) => setCfg((c) => ({ ...c, assistente: { ...c.assistente, ativo: v } }))} label="Assistente ativo" />
          </Row>
          <Field label="Mensagem de boas-vindas">
            <textarea
              rows={3}
              className="w-full resize-none rounded-[20px] bg-white/[0.04] px-4 py-3 text-[14px] outline-none shadow-[inset_0_0_0_1px_var(--color-slate)] focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]"
              value={cfg.assistente.mensagemBoasVindas}
              onChange={(e) => setCfg((c) => ({ ...c, assistente: { ...c.assistente, mensagemBoasVindas: e.target.value } }))}
            />
          </Field>
          <p className="mt-3 text-[12px] text-slate">A chave do provedor de IA fica apenas no backend. Nunca a coloque no frontend.</p>
        </Panel>

        <div className="grid gap-3">
          <Panel title={(<Title icon={<Palette size={15} />}>Aparência</Title>)}>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="color"
                  value={cfg.aparencia.corPrimaria}
                  onChange={(e) => setCfg((c) => ({ ...c, aparencia: { ...c.aparencia, corPrimaria: e.target.value } }))}
                  className="h-11 w-11 cursor-pointer rounded-full border-0 bg-transparent"
                  aria-label="Cor primária"
                />
                <span className="text-[13px] text-ash">
                  Cor de destaque <span className="tabular text-porcelain">{cfg.aparencia.corPrimaria}</span>
                </span>
              </label>
              <span className="rounded-full px-4 py-2 text-[13px] font-medium" style={{ background: cfg.aparencia.corPrimaria, color: "#080807" }}>
                Buscar imóveis
              </span>
            </div>
            <p className="mt-4 text-[12px] text-slate">No modo SaaS, a cor é aplicada por tenant sobrescrevendo --color-accent.</p>
          </Panel>

          <Panel title={(<Title icon={<PlugZap size={15} />}>Integrações</Title>)} bodyClassName="px-5 py-2 md:px-6">
            <div className="divide-y divide-line">
              {[
                { icon: <Database size={16} />, name: "API FastAPI + PostgreSQL", status: "Aguardando backend" },
                { icon: <WhatsAppIcon size={16} />, name: "WhatsApp Business API", status: "Em breve" },
                { icon: <CalendarDays size={16} />, name: "Google Agenda", status: "Em breve" },
                { icon: <Building2 size={16} />, name: "Portais (ZAP, VivaReal, OLX)", status: "Em breve" },
                { icon: <Bot size={16} />, name: "Provedor de IA (via backend)", status: "Em breve" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-3 text-[14px]">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.05] text-mist">{i.icon}</span>
                    {i.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-ash">{i.status}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-porcelain px-5 py-3 text-[14px] font-medium text-ink"
            role="status"
          >
            <Check size={16} /> Alterações salvas (demonstração)
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
