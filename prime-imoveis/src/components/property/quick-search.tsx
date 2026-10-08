"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BedDouble, Building2, ChevronDown, MapPin, Search, Wallet } from "lucide-react";
import { propertyTypes } from "@/data/properties";
import { regions } from "@/data/regions";
import { cn } from "@/lib/utils";
import { filtersToQuery } from "@/services/search";
import type { Finalidade, FiltrosBusca, TipoImovel } from "@/types/entities";

export const PRICE_RANGES: Record<Finalidade, { label: string; min?: number; max?: number }[]> = {
  venda: [
    { label: "Até R$ 800 mil", max: 800_000 },
    { label: "R$ 800 mil – R$ 1,5 mi", min: 800_000, max: 1_500_000 },
    { label: "R$ 1,5 mi – R$ 3 mi", min: 1_500_000, max: 3_000_000 },
    { label: "R$ 3 mi – R$ 5 mi", min: 3_000_000, max: 5_000_000 },
    { label: "Acima de R$ 5 mi", min: 5_000_000 },
  ],
  aluguel: [
    { label: "Até R$ 5 mil", max: 5_000 },
    { label: "R$ 5 mil – R$ 10 mil", min: 5_000, max: 10_000 },
    { label: "R$ 10 mil – R$ 20 mil", min: 10_000, max: 20_000 },
    { label: "Acima de R$ 20 mil", min: 20_000 },
  ],
};

/** Campo de seleção nativo com aparência do design system (ótimo no mobile). */
export function FieldSelect({
  label,
  icon,
  value,
  onChange,
  children,
  className,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("group relative flex min-w-0 flex-col justify-center px-5 py-3 transition-colors hover:bg-white/[0.03]", className)}>
      <span className="mb-1 flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.2em] text-ash">
        {icon}
        {label}
      </span>
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-6 text-[15px] text-porcelain outline-none"
        >
          {children}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-0 text-slate" />
      </span>
    </label>
  );
}

const opt = "bg-graphite text-porcelain";
const cell = "border-b border-white/[0.08] lg:border-b-0";

/** Busca rápida integrada ao Hero. */
export function QuickSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [finalidade, setFinalidade] = useState<Finalidade>("venda");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [faixa, setFaixa] = useState("");
  const [quartos, setQuartos] = useState("");

  const submit = () => {
    const range = faixa !== "" ? PRICE_RANGES[finalidade][Number(faixa)] : undefined;
    const f: FiltrosBusca = {
      finalidade,
      tipo: (tipo || undefined) as TipoImovel | undefined,
      local: local || undefined,
      precoMin: range?.min,
      precoMax: range?.max,
      quartos: quartos ? Number(quartos) : undefined,
    };
    router.push(`/imoveis${filtersToQuery(f)}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      role="search"
      aria-label="Buscar imóveis"
      className={cn("w-full", className)}
    >
      {/* Comprar / Alugar */}
      <div className="mb-2 inline-flex rounded-full bg-black/35 p-1 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]" role="tablist">
        {(["venda", "aluguel"] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={finalidade === f}
            onClick={() => {
              setFinalidade(f);
              setFaixa("");
            }}
            className={cn("relative rounded-full px-5 py-2 text-[13px] font-medium transition-colors", finalidade === f ? "text-ink" : "text-mist hover:text-porcelain")}
          >
            {finalidade === f && (
              <motion.span layoutId="qs-fin" className="absolute inset-0 rounded-full bg-porcelain" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
            )}
            <span className="relative">{f === "venda" ? "Comprar" : "Alugar"}</span>
          </button>
        ))}
      </div>

      <div className="glass overflow-hidden rounded-[24px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.09)] lg:rounded-full">
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1.15fr_1.15fr_0.8fr_auto]">
          <FieldSelect label="Tipo" icon={<Building2 size={12} />} value={tipo} onChange={setTipo} className={cn(cell, "border-r lg:pl-7")}>
            <option value="" className={opt}>Todos os tipos</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t} className={opt}>{t}</option>
            ))}
          </FieldSelect>
          <FieldSelect label="Localização" icon={<MapPin size={12} />} value={local} onChange={setLocal} className={cn(cell, "lg:border-r")}>
            <option value="" className={opt}>Todas as regiões</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id} className={opt}>
                {r.nome}{r.cidade !== "São Paulo" && r.cidade !== r.nome ? ` · ${r.cidade}` : ""}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect label="Faixa de preço" icon={<Wallet size={12} />} value={faixa} onChange={setFaixa} className={cn(cell, "border-r")}>
            <option value="" className={opt}>Qualquer valor</option>
            {PRICE_RANGES[finalidade].map((r, i) => (
              <option key={r.label} value={i} className={opt}>{r.label}</option>
            ))}
          </FieldSelect>
          <FieldSelect label="Quartos" icon={<BedDouble size={12} />} value={quartos} onChange={setQuartos} className={cell}>
            <option value="" className={opt}>Qualquer</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n} className={opt}>{n}+ quartos</option>
            ))}
          </FieldSelect>
          <div className="col-span-2 p-2 lg:col-span-1">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-7 text-[15px] font-medium text-ink transition-colors hover:bg-accent-hover active:scale-[0.98] lg:h-[58px]"
            >
              <Search size={17} />
              Buscar imóveis
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
