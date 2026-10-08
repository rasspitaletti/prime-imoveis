import type { Metadata } from "next";
import { images } from "@/config/images";
import { PageIntro } from "@/components/layout/page-intro";
import { PropertySearch } from "@/components/property/property-search";
import { filtersFromParams } from "@/services/search";

export const metadata: Metadata = {
  title: "Lançamentos",
  description: "Lançamentos imobiliários com tabela de pré-venda e condições especiais.",
  alternates: { canonical: "/lancamentos" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function LancamentosPage({ searchParams }: { searchParams: SP }) {
  const initial = filtersFromParams(await searchParams);
  return (
    <>
      <PageIntro
        compact
        image={images.catApartamentos}
        eyebrow="Lançamentos"
        title="Seja o primeiro a escolher a sua unidade."
        lead="Tabela de lançamento, entrada facilitada e personalização de planta nas primeiras fases."
      />
      <section className="py-14 md:py-20">
        <div className="container-x">
          <PropertySearch initial={initial} lock={{ selo: "Lançamento" }} />
        </div>
      </section>
    </>
  );
}
