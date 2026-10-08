import type { Metadata } from "next";
import { agency } from "@/config/agency";
import { images } from "@/config/images";
import { testimonialStats } from "@/data/testimonials";
import { PageIntro } from "@/components/layout/page-intro";
import { AboutSection, Differentials } from "@/components/home/about";
import { RegionsSection } from "@/components/home/regions";
import { TestimonialsSection } from "@/components/home/testimonials";
import { FinalCTA } from "@/components/home/final-cta";
import { BrokersGrid } from "@/components/home/brokers";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: `Conheça a ${agency.nome}: imobiliária boutique com atendimento personalizado em São Paulo e região desde ${agency.fundacao}.`,
  alternates: { canonical: "/sobre" },
};

const steps = [
  { n: "01", t: "Entendimento", d: "Conversamos sobre rotina, orçamento e prazos antes de mostrar imóveis." },
  { n: "02", t: "Curadoria", d: "Selecionamos opções que realmente fazem sentido — inclusive fora dos portais." },
  { n: "03", t: "Visitas e proposta", d: "Acompanhamos as visitas e conduzimos a negociação com dados de mercado." },
  { n: "04", t: "Documentação e chaves", d: "Análise jurídica, financiamento, escritura e entrega das chaves." },
];

export default function SobrePage() {
  const stats = [
    { v: `${testimonialStats.anosMercado}`, l: "anos de mercado" },
    { v: `+${testimonialStats.negociosFechados.toLocaleString("pt-BR")}`, l: "negócios fechados" },
    { v: testimonialStats.media.toFixed(1).replace(".", ","), l: "nota média dos clientes" },
    { v: "7", l: "regiões atendidas" },
  ];
  return (
    <>
      <PageIntro
        image={images.cityNight}
        eyebrow="Sobre nós"
        title="Uma imobiliária feita de pessoas que conhecem cada rua."
        lead={`Desde ${agency.fundacao}, ajudamos famílias, investidores e empresas a comprar, vender e alugar com segurança.`}
      />
      <section className="py-14 md:py-20">
        <div className="container-x grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-line md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06} className="bg-ink px-6 py-8 md:px-8 md:py-10">
              <p className="t-stat tabular">{s.v}</p>
              <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ash">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <AboutSection showCta={false} />
      <Section band>
        <div className="container-x">
          <SectionHeader eyebrow="Como trabalhamos" title="Do primeiro contato à entrega das chaves." />
          <ol className="grid gap-3 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n}>
                <Reveal delay={i * 0.08} className="h-full rounded-[28px] bg-graphite p-7 shadow-[inset_0_0_0_1px_var(--color-line)]">
                  <p className="text-[13px] text-accent tabular">{s.n}</p>
                  <h3 className="mt-10 font-[family-name:var(--font-display)] text-[22px] font-normal tracking-[-0.015em]">{s.t}</h3>
                  <p className="mt-2 text-[15px] font-light leading-relaxed text-ash">{s.d}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Differentials />
      <Section id="equipe">
        <div className="container-x">
          <SectionHeader eyebrow="Equipe" title="Corretores que explicam antes de vender." />
          <BrokersGrid />
        </div>
      </Section>
      <RegionsSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
