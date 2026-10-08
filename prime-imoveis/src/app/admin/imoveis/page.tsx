"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Plus, Star } from "lucide-react";
import { leads, visits } from "@/data/operations";
import { getBroker } from "@/data/brokers";
import { properties as seed } from "@/data/properties";
import { finalidadeLabel, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Imovel } from "@/types/entities";
import { AdminPageHeader, Panel, SearchInput, Segmented, Toggle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";

export default function ImoveisAdminPage() {
  const [items, setItems] = useState<Imovel[]>(() => seed.map((p) => ({ ...p })));
  const [q, setQ] = useState("");
  const [fin, setFin] = useState<"todos" | "venda" | "aluguel">("todos");

  const usage = useMemo(() => {
    const m: Record<string, { v: number; l: number }> = {};
    for (const v of visits) (m[v.imovelId] ??= { v: 0, l: 0 }).v++;
    for (const l of leads) if (l.imovelId) (m[l.imovelId] ??= { v: 0, l: 0 }).l++;
    return m;
  }, []);

  const list = items.filter(
    (p) => (fin === "todos" || p.finalidade === fin) && `${p.titulo} ${p.codigo} ${p.endereco.bairro}`.toLowerCase().includes(q.toLowerCase()),
  );
  const update = (id: string, patch: Partial<Imovel>) => setItems((arr) => arr.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <>
      <AdminPageHeader
        title="Imóveis"
        description="Carteira publicada no site. Ative, desative e escolha os destaques da home."
        actions={
          <Button size="sm" className="h-10" icon={<Plus size={15} />} disabled title="Disponível com o backend">
            Cadastrar imóvel
          </Button>
        }
      />
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          layoutId="imv-fin"
          value={fin}
          onChange={setFin}
          options={[
            { value: "todos", label: `Todos · ${items.length}` },
            { value: "venda", label: "Venda" },
            { value: "aluguel", label: "Aluguel" },
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="Título, código ou bairro" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <Panel key={p.id} className={cn(!p.ativo && "opacity-60")} bodyClassName="p-0">
            <div className="flex gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imagens[0]} alt="" className="h-20 w-24 shrink-0 rounded-[16px] object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-ash">
                      {p.codigo} · {p.tipo} · {finalidadeLabel[p.finalidade]}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] font-medium leading-snug">{p.titulo}</p>
                  </div>
                  <Toggle checked={p.ativo} onChange={(v) => update(p.id, { ativo: v })} label={`Publicar ${p.titulo}`} />
                </div>
                <p className="t-price mt-2 text-[16px]">{formatPrice(p)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[12px] text-ash">
              <button
                onClick={() => update(p.id, { destaque: !p.destaque })}
                aria-pressed={p.destaque}
                className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors", p.destaque ? "bg-accent-soft text-accent" : "bg-white/[0.04] hover:text-porcelain")}
              >
                <Star size={12} className={p.destaque ? "fill-accent" : ""} /> Destaque
              </button>
              <span>{getBroker(p.corretorId)?.nome.split(" ")[0]}</span>
              <span className="tabular">
                {usage[p.id]?.v ?? 0} visitas · {usage[p.id]?.l ?? 0} leads
              </span>
              <Link href={`/imoveis/${p.slug}`} target="_blank" aria-label="Ver no site" className="text-slate hover:text-porcelain">
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Panel>
        ))}
      </div>
      <p className="mt-6 text-[12px] text-slate">Alterações locais (demonstração). Com o backend: PATCH /admin/imoveis/{"{id}"}.</p>
    </>
  );
}
