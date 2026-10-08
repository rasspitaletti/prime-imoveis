import {
  BadgeCheck,
  Building,
  FileCheck2,
  Handshake,
  HeartHandshake,
  ChartLine,
  ShieldCheck,
  Sparkles,
  Award,
  Headset,
} from "lucide-react";
import { agency } from "@/config/agency";
import { images } from "@/config/images";
import { testimonialStats } from "@/data/testimonials";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";

const pillars = [
  { icon: Award, title: "Experiência", text: `Desde ${agency.fundacao} no mercado de São Paulo e região.` },
  { icon: HeartHandshake, title: "Atendimento personalizado", text: "Um corretor dedicado que entende a sua rotina." },
  { icon: ChartLine, title: "Conhecimento do mercado", text: "Preços embasados em vendas reais de cada bairro." },
  { icon: ShieldCheck, title: "Segurança na negociação", text: "Análise jurídica e documental antes de qualquer assinatura." },
  { icon: Handshake, title: "Acompanhamento completo", text: "Da primeira visita à entrega das chaves." },
];

export function AboutSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <Section id="sobre">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Composição fotográfica */}
          <Reveal className="relative">
            <SmartImage
              src={images.about}
              alt="Residência de alto padrão com piscina ao entardecer"
              className="aspect-[4/5] rounded-[28px] md:aspect-[5/6]"
              tone="none"
            />
            <div className="absolute -bottom-6 right-4 w-[46%] overflow-hidden rounded-[22px] shadow-[0_0_0_8px_var(--color-ink)] md:-right-8 md:bottom-10 md:w-[48%]">
              <SmartImage src={images.aboutDetail} alt="Living integrado com acabamento sofisticado" className="aspect-[4/5]" tone="none" />
            </div>
            <div className="glass absolute left-4 top-4 rounded-[18px] px-4 py-3 md:left-6 md:top-6">
              <p className="font-[family-name:var(--font-display)] text-[30px] font-light leading-none tabular">{testimonialStats.anosMercado}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-mist">anos de mercado</p>
            </div>
          </Reveal>

          <div className="flex flex-col justify-center pt-6 lg:pt-0">
            <Reveal>
              <p className="t-eyebrow mb-5">Sobre a {agency.nome}</p>
              <h2 className="t-h1 text-balance">Mais do que imóveis, encontramos o lugar certo para você.</h2>
              <p className="t-lead mt-6 max-w-xl">
                Somos uma imobiliária boutique: trabalhamos com uma carteira enxuta e criteriosa para indicar só o que faz sentido
                para cada cliente. Você fala com quem conhece o bairro, o prédio e os números — e tem segurança em cada etapa.
              </p>
            </Reveal>
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={0.05 * i} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.05] text-accent">
                      <p.icon size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="text-[16px] font-medium">{p.title}</h3>
                      <p className="mt-1 text-[14px] font-light leading-relaxed text-ash">{p.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            {showCta && (
              <Reveal delay={0.2}>
                <ButtonLink href="/sobre" variant="secondary" className="mt-10">
                  Conheça a imobiliária
                </ButtonLink>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

const differentials = [
  { icon: Headset, title: "Atendimento personalizado", text: "Entendemos seu momento antes de mostrar qualquer imóvel. Menos visitas, mais acertos." },
  { icon: BadgeCheck, title: "Imóveis selecionados", text: "Cada imóvel passa por vistoria, conferência de documentos e análise de preço antes de ser anunciado." },
  { icon: ShieldCheck, title: "Negociação segura", text: "Contratos revisados por assessoria jurídica e acompanhamento até o registro em cartório." },
  { icon: FileCheck2, title: "Avaliação especializada", text: "Laudo de avaliação com comparativos reais para vender ou alugar pelo preço certo." },
  { icon: Sparkles, title: "Suporte completo", text: "Financiamento, FGTS, seguro-fiança, vistoria e mudança: cuidamos dos detalhes." },
  { icon: Building, title: "Experiência no mercado", text: `Mais de ${testimonialStats.negociosFechados.toLocaleString("pt-BR")} negócios fechados em São Paulo e região.` },
];

export function Differentials() {
  return (
    <Section id="diferenciais" band>
      <div className="container-x">
        <SectionHeader
          eyebrow="Por que a Prime"
          title="Tranquilidade em cada etapa da negociação."
          lead="Comprar, vender ou alugar exige confiança. Esse é o nosso trabalho."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((d, i) => (
            <Reveal key={d.title} delay={(i % 3) * 0.07}>
              <article className="group h-full rounded-[28px] bg-graphite p-7 shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors duration-500 hover:bg-[#151513] md:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-accent transition-all duration-500 group-hover:-translate-y-0.5 group-hover:bg-accent group-hover:text-ink">
                  <d.icon size={22} strokeWidth={1.4} />
                </span>
                <h3 className="mt-8 font-[family-name:var(--font-display)] text-[22px] font-normal tracking-[-0.015em]">{d.title}</h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ash">{d.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
