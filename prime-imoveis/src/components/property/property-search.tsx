"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { propertyTypes } from "@/data/properties";
import { regions } from "@/data/regions";
import { formatPriceShort } from "@/lib/format";
import { cn, whatsappLink } from "@/lib/utils";
import { filtersToQuery, searchProperties } from "@/services/search";
import type { Finalidade, FiltrosBusca, TipoImovel } from "@/types/entities";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";

const PRICE_STEPS: Record<Finalidade | "todos", number[]> = {
  venda: [500_000, 800_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000, 8_000_000],
  aluguel: [2_000, 4_000, 6_000, 8_000, 10_000, 15_000, 20_000, 30_000],
  todos: [5_000, 20_000, 500_000, 1_000_000, 2_000_000, 5_000_000],
};
const AREA_STEPS = [40, 60, 80, 100, 150, 200, 300, 500, 1000];

type Props = {
  initial: FiltrosBusca;
  /** Filtros fixos da página (ex.: /alugar fixa finalidade=aluguel). */
  lock?: Partial<FiltrosBusca>;
};

export function PropertySearch({ initial, lock = {} }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [f, setF] = useState<FiltrosBusca>({ ...initial, ...lock });
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => searchProperties(f), [f]);

  // Mantém a URL sincronizada (links compartilháveis) sem recarregar a página.
  useEffect(() => {
    const own: FiltrosBusca = { ...f };
    for (const k of Object.keys(lock) as (keyof FiltrosBusca)[]) delete own[k];
    router.replace(`${pathname}${filtersToQuery(own)}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const set = (patch: Partial<FiltrosBusca>) => setF((cur) => ({ ...cur, ...patch }));
  const clear = () => setF({ ...lock, ordem: f.ordem });
  const activeCount = (Object.keys(f) as (keyof FiltrosBusca)[]).filter(
    (k) => k !== "ordem" && !(k in lock) && f[k] !== undefined && f[k] !== false,
  ).length;

  const filters = (
    <FiltersPanel f={f} set={set} lock={lock} />
  );

  return (
    <div>
      {/* Barra de topo */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-ash" aria-live="polite">
          <span className="font-[family-name:var(--font-display)] text-[22px] font-light text-porcelain tabular">{results.length}</span>{" "}
          {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawer(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.06] px-4 text-[13px] text-porcelain hover:bg-white/[0.1] lg:hidden"
          >
            <SlidersHorizontal size={15} /> Filtros
            {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] text-ink">{activeCount}</span>}
          </button>
          <label className="relative inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.06] pl-4 pr-3 text-[13px] text-porcelain">
            <ArrowUpDown size={14} className="text-ash" />
            <span className="sr-only">Ordenar por</span>
            <select
              value={f.ordem ?? "recentes"}
              onChange={(e) => set({ ordem: e.target.value as FiltrosBusca["ordem"] })}
              className="cursor-pointer appearance-none bg-transparent pr-1 outline-none"
            >
              <option value="recentes" className="bg-graphite">Mais recentes</option>
              <option value="menor-preco" className="bg-graphite">Menor preço</option>
              <option value="maior-preco" className="bg-graphite">Maior preço</option>
              <option value="maior-area" className="bg-graphite">Maior área</option>
            </select>
          </label>
          {activeCount > 0 && (
            <button onClick={clear} className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-[13px] text-link hover:bg-white/[0.05] sm:inline-flex">
              <RotateCcw size={14} /> Limpar
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
        {/* Filtros desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[28px] bg-graphite p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
            {filters}
            {activeCount > 0 && (
              <button onClick={clear} className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-link hover:underline">
                <RotateCcw size={13} /> Limpar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Resultados */}
        <div>
          {results.length === 0 ? (
            <div className="rounded-[28px] bg-graphite px-6 py-16 text-center shadow-[inset_0_0_0_1px_var(--color-line)]">
              <p className="t-h3">Nenhum imóvel com esses filtros.</p>
              <p className="mx-auto mt-3 max-w-md text-[15px] font-light text-ash">
                Muitos imóveis chegam antes de ir para o site. Conte o que procura e um corretor faz a busca por você.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
                <ButtonLink href={whatsappLink("Olá! Não encontrei no site o imóvel que procuro. Podem me ajudar?")} variant="whatsapp" icon={<WhatsAppIcon size={18} />}>
                  Pedir ajuda a um corretor
                </ButtonLink>
                <button onClick={clear} className="inline-flex h-11 items-center justify-center rounded-full px-5 text-[15px] text-porcelain shadow-[inset_0_0_0_1px_var(--color-slate)]">
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PropertyCard property={p} priority={i < 3} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Drawer de filtros (mobile/tablet) */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-[60] bg-black/70 lg:hidden" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[88svh] flex-col rounded-t-[28px] bg-graphite lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="text-[16px] font-medium">Filtros</p>
                <button onClick={() => setDrawer(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.06]" aria-label="Fechar filtros">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
              <div className="grid grid-cols-[auto_1fr] gap-2 border-t border-line p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                <button onClick={clear} className="h-12 rounded-full px-5 text-[14px] text-mist shadow-[inset_0_0_0_1px_var(--color-slate)]">
                  Limpar
                </button>
                <button onClick={() => setDrawer(false)} className="h-12 rounded-full bg-accent text-[15px] font-medium text-ink">
                  Ver {results.length} {results.length === 1 ? "imóvel" : "imóveis"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- Painel de filtros ----------------------------- */

function FiltersPanel({
  f,
  set,
  lock,
}: {
  f: FiltrosBusca;
  set: (p: Partial<FiltrosBusca>) => void;
  lock: Partial<FiltrosBusca>;
}) {
  const steps = PRICE_STEPS[f.finalidade ?? "todos"];
  return (
    <div className="space-y-7">
      {!("finalidade" in lock) && (
        <Group label="Finalidade">
          <Pills
            value={f.finalidade ?? ""}
            onChange={(v) => set({ finalidade: (v || undefined) as Finalidade | undefined, precoMin: undefined, precoMax: undefined })}
            options={[
              { value: "", label: "Todas" },
              { value: "venda", label: "Comprar" },
              { value: "aluguel", label: "Alugar" },
            ]}
          />
        </Group>
      )}

      {!("tipo" in lock) && (
        <Group label="Tipo de imóvel">
          <Pills
            value={f.tipo ?? ""}
            onChange={(v) => set({ tipo: (v || undefined) as TipoImovel | undefined })}
            options={[{ value: "", label: "Todos" }, ...propertyTypes.map((t) => ({ value: t, label: t }))]}
          />
        </Group>
      )}

      <Group label="Localização">
        <Select value={f.local ?? ""} onChange={(v) => set({ local: v || undefined })}>
          <option value="" className="bg-graphite">Todas as regiões</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id} className="bg-graphite">
              {r.nome}
              {r.cidade !== "São Paulo" && r.cidade !== r.nome ? ` · ${r.cidade}` : ""}
            </option>
          ))}
        </Select>
      </Group>

      <Group label={f.finalidade === "aluguel" ? "Aluguel mensal" : "Preço"}>
        <div className="grid grid-cols-2 gap-2">
          <Select value={f.precoMin ?? ""} onChange={(v) => set({ precoMin: v ? Number(v) : undefined })} aria-label="Preço mínimo">
            <option value="" className="bg-graphite">Mínimo</option>
            {steps.map((s) => (
              <option key={s} value={s} className="bg-graphite">{formatPriceShort(s)}</option>
            ))}
          </Select>
          <Select value={f.precoMax ?? ""} onChange={(v) => set({ precoMax: v ? Number(v) : undefined })} aria-label="Preço máximo">
            <option value="" className="bg-graphite">Máximo</option>
            {steps.map((s) => (
              <option key={s} value={s} className="bg-graphite">{formatPriceShort(s)}</option>
            ))}
          </Select>
        </div>
      </Group>

      <Group label="Quartos">
        <CountPills value={f.quartos} onChange={(v) => set({ quartos: v })} />
      </Group>
      <Group label="Banheiros">
        <CountPills value={f.banheiros} onChange={(v) => set({ banheiros: v })} />
      </Group>
      <Group label="Vagas">
        <CountPills value={f.vagas} onChange={(v) => set({ vagas: v })} />
      </Group>

      <Group label="Metragem (m²)">
        <div className="grid grid-cols-2 gap-2">
          <Select value={f.areaMin ?? ""} onChange={(v) => set({ areaMin: v ? Number(v) : undefined })} aria-label="Área mínima">
            <option value="" className="bg-graphite">Mínima</option>
            {AREA_STEPS.map((s) => (
              <option key={s} value={s} className="bg-graphite">{s} m²</option>
            ))}
          </Select>
          <Select value={f.areaMax ?? ""} onChange={(v) => set({ areaMax: v ? Number(v) : undefined })} aria-label="Área máxima">
            <option value="" className="bg-graphite">Máxima</option>
            {AREA_STEPS.map((s) => (
              <option key={s} value={s} className="bg-graphite">{s} m²</option>
            ))}
          </Select>
        </div>
      </Group>

      {!("condominio" in lock) && (
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-[14px] text-mist">Somente em condomínio</span>
          <input
            type="checkbox"
            checked={!!f.condominio}
            onChange={(e) => set({ condominio: e.target.checked || undefined })}
            className="h-5 w-5 cursor-pointer accent-[var(--color-accent)]"
          />
        </label>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.2em] text-ash">{label}</legend>
      {children}
    </fieldset>
  );
}

function Pills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "rounded-full px-3.5 py-2 text-[13px] transition-colors",
            value === o.value ? "bg-porcelain text-ink" : "bg-white/[0.05] text-mist hover:bg-white/[0.1]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CountPills({ value, onChange }: { value?: number; onChange: (v?: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {[undefined, 1, 2, 3, 4].map((n) => (
        <button
          key={n ?? "any"}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          className={cn(
            "h-10 rounded-full text-[13px] tabular transition-colors",
            value === n ? "bg-porcelain text-ink" : "bg-white/[0.05] text-mist hover:bg-white/[0.1]",
          )}
        >
          {n === undefined ? "Todos" : `${n}+`}
        </button>
      ))}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  ...rest
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full cursor-pointer rounded-full bg-white/[0.04] px-4 text-[14px] text-porcelain outline-none shadow-[inset_0_0_0_1px_var(--color-steel)] focus:shadow-[inset_0_0_0_1.5px_var(--color-accent)]"
      {...rest}
    >
      {children}
    </select>
  );
}
