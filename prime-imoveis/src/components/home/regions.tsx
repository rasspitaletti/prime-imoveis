import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { properties } from "@/data/properties";
import { regions } from "@/data/regions";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";

export function RegionsSection() {
  return (
    <Section id="regioes" band>
      <div className="container-x">
        <SectionHeader
          eyebrow="Regiões atendidas"
          title="Encontre seu próximo endereço"
          lead="Atuamos onde conhecemos cada rua: Zona Oeste de São Paulo, Jardins e a região de Alphaville, Cotia e Osasco."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {regions.map((r, i) => {
            const n = properties.filter((p) => p.ativo && p.regiaoId === r.id).length;
            const big = i === 0;
            const wide = i === regions.length - 1;
            return (
              <Reveal key={r.id} delay={(i % 4) * 0.06} className={cn("h-full", big && "col-span-2 md:row-span-2", wide && "md:col-span-3")}>
                <Link
                  href={`/imoveis?local=${r.id}`}
                  className={cn("group relative block overflow-hidden rounded-[28px]", big ? "aspect-[4/3] md:aspect-auto md:h-full" : wide ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/5] md:aspect-square")}
                >
                  <SmartImage
                    src={r.imagem}
                    alt={`${r.nome}, ${r.cidade}`}
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                    tone="deep"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-mist">{r.cidade}</p>
                    <h3 className={cn("mt-1 font-[family-name:var(--font-display)] font-light tracking-[-0.02em]", big ? "text-[34px] md:text-[48px]" : "text-[22px] md:text-[26px]")}>
                      {r.nome}
                    </h3>
                    {big && <p className="mt-2 max-w-sm text-[14px] font-light text-mist">{r.resumo}</p>}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[12px] text-mist">
                        {n} {n === 1 ? "imóvel" : "imóveis"}
                      </span>
                      <ArrowUpRight size={18} className="text-mist transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-porcelain" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
