"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { StatusLead, StatusVisita } from "@/types/entities";

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[30px] font-light tracking-[-0.025em] md:text-[38px]">{title}</h1>
        {description && <p className="mt-1.5 text-[14px] text-ash">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("rounded-[24px] bg-graphite shadow-[inset_0_0_0_1px_var(--color-line)]", className)}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-5 pb-1 pt-5 md:px-6">
          {title && <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn("p-5 md:p-6", bodyClassName)}>{children}</div>
    </motion.section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon,
  delay = 0,
  accent,
}: {
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  icon: ReactNode;
  delay?: number;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[24px] bg-graphite p-5 shadow-[inset_0_0_0_1px_var(--color-line)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ash">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.05]" style={accent ? { color: accent } : undefined}>
          {icon}
        </span>
      </div>
      <p className="mt-4 font-[family-name:var(--font-display)] text-[36px] font-light leading-none tracking-[-0.03em] tabular">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-[12px]">
        {typeof delta === "number" && (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5", delta >= 0 ? "bg-mint/10 text-mint" : "bg-danger/10 text-danger")}>
            {delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-slate">{hint}</span>}
      </div>
    </motion.div>
  );
}

export const statusMeta: Record<StatusVisita, { label: string; cls: string; dot: string; color: string }> = {
  confirmada: { label: "Confirmada", cls: "bg-mint/10 text-mint", dot: "bg-mint", color: "var(--color-mint)" },
  pendente: { label: "Pendente", cls: "bg-amber/10 text-amber", dot: "bg-amber", color: "var(--color-amber)" },
  realizada: { label: "Realizada", cls: "bg-white/[0.06] text-mist", dot: "bg-mist", color: "var(--color-slate)" },
  cancelada: { label: "Cancelada", cls: "bg-danger/10 text-danger", dot: "bg-danger", color: "var(--color-danger)" },
  nao_compareceu: { label: "Não compareceu", cls: "bg-violet/10 text-violet", dot: "bg-violet", color: "var(--color-violet)" },
};

export const leadMeta: Record<StatusLead, { label: string; cls: string; dot: string }> = {
  novo: { label: "Novo", cls: "bg-sky/10 text-sky", dot: "bg-sky" },
  em_atendimento: { label: "Em atendimento", cls: "bg-amber/10 text-amber", dot: "bg-amber" },
  proposta: { label: "Proposta", cls: "bg-accent-soft text-accent", dot: "bg-accent" },
  fechado: { label: "Fechado", cls: "bg-mint/10 text-mint", dot: "bg-mint" },
  perdido: { label: "Perdido", cls: "bg-white/[0.06] text-ash", dot: "bg-slate" },
};

export function LeadBadge({ status }: { status: StatusLead }) {
  const m = leadMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium", m.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: StatusVisita }) {
  const m = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium", m.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover object-top" style={{ width: size, height: size }} />
  ) : (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-white/[0.07] text-[12px] font-semibold text-mist"
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </span>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  layoutId,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  layoutId: string;
}) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white/[0.04] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn("relative shrink-0 rounded-full px-3.5 py-1.5 text-[13px] transition-colors", value === o.value ? "text-ink" : "text-ash hover:text-porcelain")}
        >
          {value === o.value && (
            <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full bg-porcelain" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-white/[0.04] px-4 shadow-[inset_0_0_0_1px_var(--color-line)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-accent)] md:max-w-xs">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="sr-only">{placeholder}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate" />
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", checked ? "bg-accent" : "bg-steel")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn("absolute top-1 h-5 w-5 rounded-full bg-white", checked ? "right-1" : "left-1")}
      />
    </button>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-[20px] bg-white/[0.02] px-6 py-12 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      {text && <p className="mt-1 text-[13px] text-ash">{text}</p>}
    </div>
  );
}
