"use client";

import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarCheck2, Check, LoaderCircle, Lock, MapPin, Phone, RotateCcw, User } from "lucide-react";
import { settings, whatsappPropertyMessage } from "@/config/agency";
import { getBroker } from "@/data/brokers";
import { getProperty, properties } from "@/data/properties";
import { addDays, formatLongDate, startOfDay, toISODate, weekdayShort } from "@/lib/date";
import { formatPrice } from "@/lib/format";
import { cn, isValidPhone, maskPhone, whatsappLink } from "@/lib/utils";
import { api, ApiError } from "@/services/api";
import type { Horario, ID, ISODate } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { SmartImage } from "@/components/ui/smart-image";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Agendamento de visita (sem login): imóvel → data e horário → dados → confirmação.
 * O corretor é o responsável pelo imóvel.
 * - `propertyId`: pula a escolha do imóvel (usado na página do imóvel)
 * - `compact`: versão para a barra lateral (sem resumo ao lado)
 */
export function BookingFlow({ propertyId, compact = false, className }: { propertyId?: ID; compact?: boolean; className?: string }) {
  const preset = propertyId && getProperty(propertyId) ? propertyId : undefined;
  const STEPS = preset ? (["Data e horário", "Seus dados", "Confirmação"] as const) : (["Imóvel", "Data e horário", "Seus dados", "Confirmação"] as const);
  const offset = preset ? 1 : 0; // índice lógico: 0 imóvel, 1 data, 2 dados, 3 confirmação

  const [logical, setLogical] = useState(preset ? 1 : 0);
  const [dir, setDir] = useState(1);
  const [imovelId, setImovelId] = useState<ID | undefined>(preset);
  const [date, setDate] = useState<ISODate | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [slots, setSlots] = useState<Horario[] | null>(null);
  const [slotHint, setSlotHint] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const imovel = imovelId ? getProperty(imovelId) : undefined;
  const broker = imovel ? getBroker(imovel.corretorId) : undefined;

  // Datas no cliente (fuso do visitante)
  const [days, setDays] = useState<Date[]>([]);
  useEffect(() => {
    const today = startOfDay();
    setDays(Array.from({ length: settings.agenda.diasFuturosVisiveis }, (_, i) => addDays(today, i)));
  }, []);

  useEffect(() => {
    if (!broker || !days.length) return;
    const first = days.find((d) => broker.diasAtendimento.includes(d.getDay()));
    setDate((cur) => (cur && broker.diasAtendimento.includes(new Date(cur + "T12:00").getDay()) ? cur : first ? toISODate(first) : undefined));
    setTime(undefined);
  }, [broker, days]);

  useEffect(() => {
    if (!broker || !date) return;
    let cancel = false;
    setSlots(null);
    api.brokers.slots(broker.id, date).then((s) => !cancel && setSlots(s));
    return () => {
      cancel = true;
    };
  }, [broker, date]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => p.ativo && (!q || `${p.titulo} ${p.endereco.bairro} ${p.codigo}`.toLowerCase().includes(q)));
  }, [query]);

  const go = (to: number) => {
    setDir(to > logical ? 1 : -1);
    setLogical(to);
    setSlotHint(null);
  };

  const nameOk = name.trim().split(/\s+/).length >= 2 && name.trim().length >= 5;
  const phoneOk = isValidPhone(phone);
  const canAdvance = [!!imovelId, !!date && !!time, nameOk && phoneOk, true][logical];

  const submit = async () => {
    if (!imovel || !broker || !date || !time) return;
    setStatus("submitting");
    setError(null);
    try {
      const r = await api.visits.request({ imovelId: imovel.id, corretorId: broker.id, data: date, hora: time, nome: name.trim(), telefone: phone });
      setProtocol(r.protocolo);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof ApiError ? e.message : "Não foi possível enviar agora. Verifique sua conexão e tente novamente.");
    }
  };

  const reset = () => {
    setLogical(preset ? 1 : 0);
    if (!preset) setImovelId(undefined);
    setTime(undefined);
    setName("");
    setPhone("");
    setTouched({ name: false, phone: false });
    setStatus("idle");
    setProtocol(null);
  };

  if (status === "success" && imovel && broker && date && time) {
    const msg = `Olá! Acabei de agendar uma visita pelo site.\nProtocolo: ${protocol}\nImóvel: ${imovel.titulo} (${imovel.codigo})\n${formatLongDate(date)} às ${time}\nNome: ${name}`;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn("rounded-[28px] bg-graphite p-8 text-center shadow-[inset_0_0_0_1px_var(--color-line)]", !compact && "md:p-14", className)}
        role="status"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-mint"
        >
          <Check size={30} strokeWidth={2.5} />
        </motion.span>
        <h3 className={cn(compact ? "t-h3" : "t-h2", "mt-6")}>Visita solicitada.</h3>
        <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-relaxed text-ash">
          {name.split(" ")[0]}, {broker.nome.split(" ")[0]} vai confirmar sua visita ao imóvel <span className="text-porcelain">{imovel.titulo}</span> em{" "}
          <span className="capitalize text-porcelain">{formatLongDate(date)}</span> às <span className="text-porcelain">{time}</span> pelo WhatsApp.
        </p>
        <p className="mt-6 inline-flex rounded-full bg-white/[0.05] px-4 py-2 text-[13px] text-mist tabular">Protocolo {protocol}</p>
        <div className={cn("mt-8 flex flex-col justify-center gap-2", !compact && "sm:flex-row")}>
          <a
            href={whatsappLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-[#05290f]"
          >
            <WhatsAppIcon size={18} /> Enviar comprovante
          </a>
          <Button variant="secondary" className="h-12" onClick={reset} icon={<RotateCcw size={16} />}>
            Nova visita
          </Button>
        </div>
      </motion.div>
    );
  }

  const visibleStep = logical - offset;

  return (
    <div className={cn("grid gap-3", !compact && "lg:grid-cols-[1fr_340px]", className)}>
      <div className={cn("relative overflow-hidden rounded-[28px] bg-graphite shadow-[inset_0_0_0_1px_var(--color-line)]", compact ? "min-h-[500px]" : "min-h-[560px]")}>
        {/* Stepper */}
        <div className={cn("border-b border-line pb-5 pt-6", compact ? "px-5" : "px-5 md:px-8")}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-ash">
              Etapa <span className="text-porcelain tabular">{visibleStep + 1}</span> de {STEPS.length}
            </p>
            <p className="inline-flex items-center gap-1.5 text-[12px] text-slate">
              <Lock size={12} /> Sem cadastro
            </p>
          </div>
          <ol className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }} aria-label="Progresso do agendamento">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-col gap-2">
                <span className="relative h-1 overflow-hidden rounded-full bg-steel">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    initial={false}
                    animate={{ width: i < visibleStep ? "100%" : i === visibleStep ? "50%" : "0%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <button
                  type="button"
                  disabled={i > visibleStep}
                  onClick={() => i < visibleStep && go(i + offset)}
                  className={cn("hidden text-left text-[12px] transition-colors", !compact && "sm:block", i === visibleStep ? "text-porcelain" : i < visibleStep ? "text-ash hover:text-porcelain" : "text-slate")}
                  aria-current={i === visibleStep ? "step" : undefined}
                >
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={cn("relative pb-28 pt-7", compact ? "px-5" : "px-5 md:px-8")}>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={logical}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {logical === 0 && (
                <StepWrap title="Qual imóvel você quer visitar?" hint="Busque pelo nome, bairro ou código.">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex.: Pinheiros, cobertura, PR-1001"
                    className="mb-4 h-12 w-full rounded-full bg-white/[0.04] px-5 text-[15px] outline-none shadow-[inset_0_0_0_1px_var(--color-slate)] placeholder:text-slate focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]"
                  />
                  <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {list.map((p) => (
                      <Choice
                        key={p.id}
                        selected={imovelId === p.id}
                        onClick={() => {
                          setImovelId(p.id);
                          setTimeout(() => go(1), 180);
                        }}
                      >
                        <span className="flex min-w-0 items-center gap-3 text-left">
                          <SmartImage src={p.imagens[0]} alt="" tone="none" className="h-14 w-16 shrink-0 rounded-xl" />
                          <span className="min-w-0">
                            <span className="block truncate text-[14px] font-medium">{p.titulo}</span>
                            <span className="block truncate text-[12px] text-ash">
                              {p.endereco.bairro} · {formatPrice(p)}
                            </span>
                          </span>
                        </span>
                      </Choice>
                    ))}
                  </div>
                </StepWrap>
              )}

              {logical === 1 && broker && (
                <StepWrap title="Escolha a data e o horário" hint={`Visita acompanhada por ${broker.nome}. Horários atualizados em tempo real.`}>
                  <div className={cn("no-scrollbar flex gap-2 overflow-x-auto pb-1", compact ? "-mx-5 px-5" : "-mx-5 px-5 md:-mx-8 md:px-8")} role="listbox" aria-label="Datas">
                    {days.length === 0 &&
                      Array.from({ length: 7 }, (_, i) => <span key={i} className="h-[76px] w-[62px] shrink-0 animate-pulse rounded-2xl bg-white/[0.04]" />)}
                    {days.map((d) => {
                      const iso = toISODate(d);
                      const works = broker.diasAtendimento.includes(d.getDay());
                      const active = iso === date;
                      return (
                        <button
                          key={iso}
                          type="button"
                          role="option"
                          aria-selected={active}
                          disabled={!works}
                          onClick={() => {
                            setDate(iso);
                            setTime(undefined);
                            setSlotHint(null);
                          }}
                          className={cn(
                            "flex h-[76px] w-[62px] shrink-0 flex-col items-center justify-center rounded-2xl transition-all duration-200",
                            active ? "bg-porcelain text-ink" : works ? "bg-white/[0.05] text-porcelain hover:bg-white/[0.1]" : "cursor-not-allowed text-slate/60 shadow-[inset_0_0_0_1px_var(--color-line)]",
                          )}
                        >
                          <span className={cn("text-[11px] uppercase tracking-wide", active ? "text-ink/60" : "text-ash")}>{weekdayShort(d)}</span>
                          <span className="mt-1 text-[20px] font-medium tabular">{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    {!slots ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {Array.from({ length: 8 }, (_, i) => (
                          <span key={i} className="h-11 animate-pulse rounded-full bg-white/[0.04]" />
                        ))}
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="rounded-2xl bg-white/[0.03] p-5 text-[14px] text-ash">Sem visitas nesta data. Escolha outro dia.</p>
                    ) : slots.every((s) => !s.disponivel) ? (
                      <p className="rounded-2xl bg-white/[0.03] p-5 text-[14px] text-ash">Agenda completa neste dia. Tente a próxima data ou fale pelo WhatsApp.</p>
                    ) : (
                      <>
                        <div className={cn("grid grid-cols-3 gap-2", compact ? "sm:grid-cols-4" : "sm:grid-cols-4 md:grid-cols-5")} role="listbox" aria-label="Horários">
                          {slots.map((s) => {
                            const active = s.hora === time;
                            return (
                              <motion.button
                                key={s.hora}
                                type="button"
                                role="option"
                                aria-selected={active}
                                aria-disabled={!s.disponivel}
                                whileTap={s.disponivel ? { scale: 0.95 } : { x: [0, -3, 3, -2, 0] }}
                                onClick={() => {
                                  if (!s.disponivel) {
                                    setSlotHint(`${s.hora} já está reservado. Escolha outro horário.`);
                                    return;
                                  }
                                  setTime(s.hora);
                                  setSlotHint(null);
                                }}
                                className={cn(
                                  "relative h-11 rounded-full text-[14px] font-medium tabular transition-colors duration-200",
                                  active ? "bg-accent text-ink" : s.disponivel ? "bg-white/[0.05] text-porcelain hover:bg-white/[0.1]" : "cursor-not-allowed text-slate line-through decoration-slate/60",
                                )}
                              >
                                {s.hora}
                                {active && (
                                  <motion.span layoutId="slot-check" className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-porcelain text-ink">
                                    <Check size={12} strokeWidth={3} />
                                  </motion.span>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-ash">
                          <Legend className="bg-white/[0.08]" label="Disponível" />
                          <Legend className="bg-accent" label="Selecionado" />
                          <Legend className="shadow-[inset_0_0_0_1px_var(--color-slate)]" label="Indisponível" />
                        </div>
                      </>
                    )}
                    <AnimatePresence>
                      {slotHint && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 flex items-center gap-2 rounded-2xl bg-amber/10 px-4 py-3 text-[13px] text-amber"
                          role="status"
                        >
                          <AlertCircle size={15} /> {slotHint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </StepWrap>
              )}

              {logical === 2 && (
                <StepWrap title="Informe seus dados" hint="Usamos apenas para confirmar a visita pelo WhatsApp.">
                  <div className="grid gap-4">
                    <Field
                      id={`bk-name-${compact ? "c" : "f"}`}
                      label="Nome completo"
                      icon={<User size={16} />}
                      value={name}
                      onChange={setName}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="Como devemos te chamar?"
                      autoComplete="name"
                      error={touched.name && !nameOk ? "Informe nome e sobrenome." : undefined}
                      ok={nameOk}
                    />
                    <Field
                      id={`bk-phone-${compact ? "c" : "f"}`}
                      label="Telefone / WhatsApp"
                      icon={<Phone size={16} />}
                      value={phone}
                      onChange={(v) => setPhone(maskPhone(v))}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      placeholder="(11) 99999-9999"
                      inputMode="tel"
                      autoComplete="tel-national"
                      error={touched.phone && !phoneOk ? "Telefone incompleto." : undefined}
                      ok={phoneOk}
                    />
                    <p className="text-[12px] leading-relaxed text-slate">
                      Seus dados são tratados conforme a LGPD e usados apenas para este atendimento.
                    </p>
                  </div>
                </StepWrap>
              )}

              {logical === 3 && imovel && broker && date && time && (
                <StepWrap title="Confira e confirme" hint="Revise as informações antes de enviar.">
                  <dl className="divide-y divide-line overflow-hidden rounded-[22px] bg-white/[0.03]">
                    <Row label="Imóvel" value={`${imovel.titulo} · ${imovel.codigo}`} onEdit={preset ? undefined : () => go(0)} />
                    <Row label="Endereço" value={`${imovel.endereco.bairro}, ${imovel.endereco.cidade}`} />
                    <Row label="Data" value={<span className="capitalize">{formatLongDate(date)}</span>} onEdit={() => go(1)} />
                    <Row label="Horário" value={time} onEdit={() => go(1)} />
                    <Row label="Corretor" value={broker.nome} />
                    <Row label="Seus dados" value={`${name} · ${phone}`} onEdit={() => go(2)} />
                  </dl>
                  <AnimatePresence>
                    {status === "error" && error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 flex items-start gap-3 rounded-2xl bg-danger/10 p-4 text-[14px] text-danger"
                        role="alert"
                      >
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div>
                          <p>{error}</p>
                          <button onClick={() => go(1)} className="mt-1.5 text-[13px] font-medium underline underline-offset-4">
                            Escolher outro horário
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </StepWrap>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navegação */}
        <div className={cn("absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-line bg-graphite/95 py-4 backdrop-blur", compact ? "px-5" : "px-5 md:px-8")}>
          <Button variant="ghost" onClick={() => go(Math.max(offset, logical - 1))} disabled={logical === offset} icon={<ArrowLeft size={16} />}>
            Voltar
          </Button>
          {logical < 3 ? (
            <Button
              onClick={() => {
                if (logical === 2) setTouched({ name: true, phone: true });
                if (canAdvance) go(logical + 1);
              }}
              disabled={logical !== 2 && !canAdvance}
              iconRight={<ArrowRight size={16} />}
            >
              Continuar
            </Button>
          ) : (
            <Button onClick={submit} disabled={status === "submitting"} icon={status === "submitting" ? <LoaderCircle size={16} className="animate-spin" /> : <CalendarCheck2 size={16} />}>
              {status === "submitting" ? "Enviando…" : "Agendar visita"}
            </Button>
          )}
        </div>
      </div>

      {/* Resumo lateral */}
      {!compact && (
        <aside className="hidden flex-col gap-3 lg:flex">
          {imovel ? (
            <div className="overflow-hidden rounded-[28px] bg-carbon">
              <SmartImage src={imovel.imagens[0]} alt="" className="aspect-[4/3]" tone="none" />
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ash">{imovel.tipo} · {imovel.codigo}</p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-[18px] leading-snug">{imovel.titulo}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-ash">
                  <MapPin size={13} /> {imovel.endereco.bairro}, {imovel.endereco.cidade}
                </p>
                <p className="t-price mt-4 text-[22px]">{formatPrice(imovel)}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] bg-carbon p-6 text-[14px] font-light text-ash">Escolha um imóvel para ver o resumo da visita.</div>
          )}
          {broker && (
            <div className="flex items-center gap-3 rounded-[28px] bg-graphite p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <SmartImage src={broker.foto} alt="" tone="none" className="h-12 w-12 shrink-0 rounded-full" imgClassName="object-top" />
              <div className="min-w-0">
                <p className="text-[14px] font-medium">{broker.nome}</p>
                <p className="truncate text-[12px] text-ash">{broker.cargo}</p>
              </div>
            </div>
          )}
          <a
            href={whatsappLink(imovel ? whatsappPropertyMessage(imovel.titulo, imovel.codigo) : undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-[28px] bg-graphite p-5 text-[14px] text-mist shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors hover:text-porcelain"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-[#05290f]">
              <WhatsAppIcon size={20} />
            </span>
            Prefere combinar direto com o corretor? Chame no WhatsApp.
          </a>
        </aside>
      )}
    </div>
  );
}

/* ----------------------------- Subcomponentes ----------------------------- */

function StepWrap({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="t-h3">{title}</h3>
      {hint && <p className="mt-2 text-[14px] font-light text-ash">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-[64px] w-full items-center justify-between gap-3 rounded-[20px] p-3 transition-all duration-200",
        selected ? "bg-accent-soft shadow-[inset_0_0_0_1.5px_var(--color-accent)]" : "bg-white/[0.03] shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-white/[0.06]",
      )}
    >
      {children}
      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all", selected ? "bg-accent text-ink" : "shadow-[inset_0_0_0_1.5px_var(--color-steel)]")}>
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  );
}

export function Field({
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
  ok,
  ...rest
}: {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  ok?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur" | "value">) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] text-ash">
        {label}
      </label>
      <div
        className={cn(
          "flex h-[54px] items-center gap-3 rounded-full bg-white/[0.04] px-5 transition-shadow",
          error ? "shadow-[inset_0_0_0_1px_var(--color-danger)]" : "shadow-[inset_0_0_0_1px_var(--color-slate)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-accent)]",
        )}
      >
        <span className="text-slate">{icon}</span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-porcelain outline-none placeholder:text-slate"
          {...rest}
        />
        {ok && <Check size={16} className="text-mint" />}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-2 pl-5 text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function Row({ label, value, onEdit }: { label: string; value: ReactNode; onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <dt className="text-[12px] text-ash">{label}</dt>
        <dd className="mt-0.5 truncate text-[15px] font-medium">{value}</dd>
      </div>
      {onEdit && (
        <button onClick={onEdit} className="shrink-0 text-[13px] text-link hover:underline">
          Alterar
        </button>
      )}
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-3 w-3 rounded-full", className)} />
      {label}
    </span>
  );
}
