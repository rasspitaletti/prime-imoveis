"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BarDatum = { label: string; value: number; sub?: string; highlight?: boolean };

/** Gráfico de barras leve (sem dependências). */
export function BarChart({ data, height = 200, unit = "visitas" }: { data: BarDatum[]; height?: number; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const [hover, setHover] = useState<number | null>(null);
  const gridLines = 4;

  return (
    <div className="relative">
      <div className="relative" style={{ height }}>
        {Array.from({ length: gridLines + 1 }, (_, i) => (
          <div key={i} className="absolute inset-x-0 border-t border-dashed border-white/[0.05]" style={{ bottom: `${(i / gridLines) * 100}%` }} />
        ))}
        <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
          {data.map((d, i) => (
            <div
              key={d.label + i}
              className="relative flex h-full flex-1 items-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.value / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "w-full rounded-t-[8px] rounded-b-[3px] transition-colors",
                  d.highlight ? "bg-accent" : hover === i ? "bg-mist" : "bg-steel",
                )}
              />
              {hover === i && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-porcelain px-2.5 py-1.5 text-[12px] text-ink">
                  <span className="font-semibold tabular">{d.value}</span> {unit}
                  {d.sub && <span className="block text-ink/60">{d.sub}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {data.map((d, i) => (
          <span key={d.label + i} className={cn("flex-1 text-center text-[11px] tabular", d.highlight ? "text-porcelain" : "text-slate")}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Barra empilhada horizontal para distribuição de status. */
export function StackedBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = Math.max(1, parts.reduce((a, p) => a + p.value, 0));
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
        {parts.map((p, i) => (
          <motion.span
            key={p.label}
            initial={{ width: 0 }}
            animate={{ width: `${(p.value / total) * 100}%` }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ background: p.color }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center justify-between rounded-[14px] bg-white/[0.03] px-3 py-2.5">
            <span className="flex items-center gap-2 text-[13px] text-ash">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.label}
            </span>
            <span className="text-[14px] font-semibold tabular">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Anel de progresso (ocupação da agenda). */
export function Ring({ value, size = 120, label }: { value: number; size?: number; label: string }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-steel)" strokeWidth="10" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-accent)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-[family-name:var(--font-display)] text-[26px] font-light leading-none tabular">{value}%</p>
        <p className="mt-1 text-[11px] text-ash">{label}</p>
      </div>
    </div>
  );
}
