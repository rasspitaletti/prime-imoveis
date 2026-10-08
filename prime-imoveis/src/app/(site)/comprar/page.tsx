import type { Metadata } from "next";
import { images } from "@/config/images";
import { PageIntro } from "@/components/layout/page-intro";
import { PropertySearch } from "@/components/property/property-search";
import { filtersFromParams } from "@/services/search";

export const metadata: Metadata = {
  title: "Imóveis à venda",
  description: "Apartamentos, casas, coberturas e terrenos à venda, selecionados e com documentação verificada.",
  alternates: { canonical: "/comprar" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ComprarPage({ searchParams }: { searchParams: SP }) {
  const initial = filtersFromParams(await searchParams);
  return (
    <>
      <PageIntro
        compact
        image={images.catCasas}
        eyebrow="Comprar"
        title="Imóveis à venda, com segurança do início ao fim."
        lead="Documentação verificada, preço embasado no mercado e assessoria no financiamento."
      />
      <section className="py-14 md:py-20">
        <div className="container-x">
          <PropertySearch initial={initial} lock={{ finalidade: "venda" }} />
        </div>
      </section>
    </>
  );
}
