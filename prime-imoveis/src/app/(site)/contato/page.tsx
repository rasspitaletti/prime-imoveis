import type { Metadata } from "next";
import { agency } from "@/config/agency";
import { images } from "@/config/images";
import { PageIntro } from "@/components/layout/page-intro";
import { ContactSection } from "@/components/home/contact";
import { InterestForm } from "@/components/property/property-sidebar";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contato",
  description: `Endereço, telefone, WhatsApp e redes sociais da ${agency.nome} em ${agency.endereco.cidade}/${agency.endereco.uf}.`,
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <PageIntro compact image={images.office} eyebrow="Contato" title="Fale com um corretor." lead="Respondemos pelo WhatsApp em horário comercial e aos sábados pela manhã." />
      <div className="-mb-12 md:-mb-20">
        <ContactSection withHeader={false} />
      </div>
      <section className="pb-24 md:pb-36">
        <div className="container-x grid gap-3 lg:grid-cols-[1fr_1.25fr]">
          <Reveal className="flex flex-col justify-center py-6">
            <p className="t-eyebrow mb-4">Prefere que a gente ligue?</p>
            <h2 className="t-h2 max-w-[16ch]">Deixe seu contato e conte o que procura.</h2>
            <p className="t-lead mt-4 max-w-md">Também avaliamos seu imóvel gratuitamente para venda ou locação.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <InterestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
