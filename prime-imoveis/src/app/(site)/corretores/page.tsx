import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { BrokersGrid } from "@/components/home/brokers";
import { FinalCTA } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Corretores",
  description: "Conheça os corretores da Prime Imóveis e fale diretamente com quem conhece o seu bairro.",
  alternates: { canonical: "/corretores" },
};

export default function CorretoresPage() {
  return (
    <>
      <PageIntro compact eyebrow="Corretores" title="Fale direto com quem conhece o bairro." lead="Cada corretor atende regiões e perfis específicos de imóvel." />
      <section className="pb-24 md:pb-36">
        <div className="container-x">
          <BrokersGrid detailed />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
