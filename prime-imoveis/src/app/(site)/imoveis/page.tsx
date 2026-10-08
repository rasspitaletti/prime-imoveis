import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { PropertySearch } from "@/components/property/property-search";
import { filtersFromParams } from "@/services/search";

export const metadata: Metadata = {
  title: "Imóveis à venda e para alugar",
  description: "Busque apartamentos, casas, coberturas, terrenos e imóveis comerciais selecionados em São Paulo e região.",
  alternates: { canonical: "/imoveis" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ImoveisPage({ searchParams }: { searchParams: SP }) {
  const initial = filtersFromParams(await searchParams);
  return (
    <>
      <PageIntro compact eyebrow="Imóveis" title="Encontre o seu próximo endereço." lead="Filtre por finalidade, tipo, região, preço e características." />
      <section className="pb-24 md:pb-36">
        <div className="container-x">
          <PropertySearch initial={initial} />
        </div>
      </section>
    </>
  );
}
