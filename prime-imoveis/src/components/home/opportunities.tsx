"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { properties } from "@/data/properties";
import { formatPrice } from "@/lib/format";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { PropertyCard, PropertySpecs, SeloBadge } from "@/components/property/property-card";

const SELOS = ["Lançamento", "Oportunidade", "Condição especial"] as const;

export function Opportunities() {
  const rail = useRef<HTMLDivElement>(null);
  const list = properties.filter((p) => p.ativo && p.selo && (SELOS as readonly string[]).includes(p.selo));
  const [lead, ...rest] = list;
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * Math.min(rail.current.clientWidth * 0.8, 720), behavior: "smooth" });

  if (!lead) return null;

  return (
    <Section id="oportunidades">
      <div className="container-x">
        <SectionHeader
          eyebrow="Oportunidades"
          title="Não perca as melhores oportunidades"
          lead="Lançamentos com tabela de pré-venda, imóveis abaixo da média do bairro e proprietários abertos a negociar."
          action={
            <div className="flex items-center gap-2">
              <button onClick={() => scroll(-1)} aria-label="Anteriores" className="hidden h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-mist hover:bg-white/[0.12] hover:text-porcelain md:grid">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => scroll(1)} aria-label="Próximas" className="hidden h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-mist hover:bg-white/[0.12] hover:text-porcelain md:grid">
                <ArrowRight size={18} />
              </button>
              <ButtonLink href="/lancamentos" variant="secondary" className="ml-1">
                Lançamentos
              </ButtonLink>
            </div>
          }
        />

        {/* Oportunidade principal em formato editorial */}
        <Reveal>
          <Link href={`/imoveis/${lead.slug}`} className="group relative mb-4 block overflow-hidden rounded-[28px]">
            <SmartImage
              src={lead.imagens[0]}
              alt={lead.titulo}
              className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
              imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
              tone="none"
            />
            <div aria-hidden className="photo-scrim absolute inset-0" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <div className="flex flex-wrap gap-2">
                {lead.selo && <SeloBadge selo={lead.selo} />}
                <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-porcelain backdrop-blur-xl">
                  {lead.endereco.bairro}
                </span>
              </div>
              <h3 className="mt-4 max-w-[22ch] font-[family-name:var(--font-display)] text-[28px] font-light leading-tight tracking-[-0.02em] md:text-[44px]">
                {lead.titulo}
              </h3>
              <p className="mt-3 max-w-xl text-[15px] font-light text-mist">{lead.resumo}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p className="t-price text-[26px] md:text-[32px]">{formatPrice(lead)}</p>
                <PropertySpecs p={lead} size="md" className="text-porcelain" />
                <span className="ml-auto hidden items-center gap-2 rounded-full bg-porcelain px-5 py-3 text-[14px] font-medium text-ink transition-transform group-hover:translate-x-1 md:inline-flex">
                  Ver imóvel <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>

      <div
        ref={rail}
        role="list"
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:scroll-px-8 md:px-8 xl:px-[max(32px,calc((100vw-1240px)/2+32px))] xl:scroll-px-[max(32px,calc((100vw-1240px)/2+32px))]"
      >
        {rest.map((p) => (
          <div key={p.id} role="listitem" className="w-[84vw] max-w-[380px] shrink-0 snap-start sm:w-[360px]">
            <PropertyCard property={p} />
          </div>
        ))}
      </div>
    </Section>
  );
}
