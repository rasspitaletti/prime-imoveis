import type { Metadata } from "next";
import { images } from "@/config/images";
import { PageIntro } from "@/components/layout/page-intro";
import { PropertySearch } from "@/components/property/property-search";
import { filtersFromParams } from "@/services/search";

export const metadata: Metadata = {
  title: "Imóveis para alugar",
  description: "Apartamentos, casas e salas comerciais para alugar, com opções sem fiador.",
  alternates: { canonical: "/alugar" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AlugarPage({ searchParams }: { searchParams: SP }) {
  const initial = filtersFromParams(await searchParams);
  return (
    <>
      <PageIntro
        compact
        image={images.aboutDetail}
        eyebrow="Alugar"
        title="Alugue sem burocracia e sem fiador."
        lead="Seguro-fiança, título de capitalização ou caução — e vistoria com fotos na entrada."
      />
      <section className="py-14 md:py-20">
        <div className="container-x">
          <PropertySearch initial={initial} lock={{ finalidade: "aluguel" }} />
        </div>
      </section>
    </>
  );
}
