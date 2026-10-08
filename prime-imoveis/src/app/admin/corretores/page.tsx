"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { leads, visits } from "@/data/operations";
import { brokers as seed } from "@/data/brokers";
import { properties } from "@/data/properties";
import { getRegion } from "@/data/regions";
import { startOfDay, toISODate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Corretor } from "@/types/entities";
import { AdminPageHeader, Panel, Toggle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CorretoresAdminPage() {
  const [items, setItems] = useState<Corretor[]>(() => seed.map((b) => ({ ...b, diasAtendimento: [...b.diasAtendimento] })));
  const update = (id: string, patch: Partial<Corretor>) => setItems((arr) => arr.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const stats = useMemo(() => {
    const today = toISODate(startOfDay());
    return Object.fromEntries(
      seed.map((b) => {
        const mine = visits.filter((v) => v.corretorId === b.id);
        const myProps = properties.filter((p) => p.corretorId === b.id).map((p) => p.id);
        return [
          b.id,
          {
            imoveis: myProps.length,
            proximas: mine.filter((v) => v.data >= today && v.status !== "cancelada").length,
            leads: leads.filter((l) => l.imovelId && myProps.includes(l.imovelId)).length,
          },
        ];
      }),
    );
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Corretores"
        description="Equipe, regiões de atuação e dias de atendimento para visitas."
        actions={
          <Button size="sm" className="h-10" icon={<Plus size={15} />} disabled title="Disponível com o backend">
            Adicionar corretor
          </Button>
        }
      />
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((b) => (
          <Panel key={b.id} bodyClassName="p-0" className={cn(!b.ativo && "opacity-60")}>
            <div className="flex items-center gap-4 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.foto} alt="" className="h-16 w-16 rounded-[18px] object-cover object-top" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-medium">{b.nome}</p>
                <p className="truncate text-[13px] text-ash">{b.creci}</p>
              </div>
              <Toggle checked={b.ativo} onChange={(v) => update(b.id, { ativo: v })} label={`Ativar ${b.nome}`} />
            </div>
            <div className="grid grid-cols-3 border-y border-line text-center">
              {[
                ["Imóveis", stats[b.id].imoveis],
                ["Visitas", stats[b.id].proximas],
                ["Leads", stats[b.id].leads],
              ].map(([k, v]) => (
                <div key={k as string} className="border-l border-line py-3 first:border-l-0">
                  <p className="font-[family-name:var(--font-display)] text-[22px] font-light tabular">{v}</p>
                  <p className="text-[11px] text-ash">{k}</p>
                </div>
              ))}
            </div>
            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-[12px] text-ash">Dias de visita</p>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((d, i) => {
                    const on = b.diasAtendimento.includes(i);
                    return (
                      <button
                        key={d}
                        onClick={() => update(b.id, { diasAtendimento: on ? b.diasAtendimento.filter((x) => x !== i) : [...b.diasAtendimento, i].sort() })}
                        aria-pressed={on}
                        className={cn("h-9 w-11 rounded-full text-[12px] transition-colors", on ? "bg-porcelain text-ink" : "bg-white/[0.04] text-ash hover:bg-white/[0.08]")}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[12px] text-ash">Regiões</p>
                <div className="flex flex-wrap gap-1.5">
                  {b.regiaoIds.map((r) => (
                    <span key={r} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[12px] text-mist">
                      {getRegion(r)?.nome}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[12px] text-ash">Especialidades</p>
                <p className="text-[13px] leading-relaxed text-mist">{b.especialidades.join(" · ")}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <p className="mt-6 text-[12px] text-slate">Alterações locais (demonstração). Com o backend: PATCH /admin/corretores/{"{id}"}.</p>
    </>
  );
}
