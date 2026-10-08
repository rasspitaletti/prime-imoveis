import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { AssistantChat } from "@/components/ai/assistant-chat";

export const metadata: Metadata = {
  title: "Assistente virtual",
  description: "Assistente virtual da Prime Imóveis: encontre imóveis, tire dúvidas sobre locação e financiamento e agende visitas.",
  alternates: { canonical: "/assistente" },
};

export default function AssistentePage() {
  return (
    <>
      <PageIntro compact eyebrow="Assistente virtual" title="Descreva o imóvel. A gente encontra." lead="Pergunte em linguagem natural: tipo, bairro, quartos e faixa de preço." />
      <section className="pb-24 md:pb-36">
        <div className="container-x grid gap-3 lg:grid-cols-[1fr_320px]">
          <AssistantChat />
          <aside className="flex flex-col gap-3">
            <div className="rounded-[28px] bg-carbon p-6">
              <ShieldCheck size={20} className="text-mint" />
              <h2 className="mt-4 text-[18px] font-medium">Atendimento humano sempre por perto</h2>
              <p className="mt-2 text-[14px] font-light leading-relaxed text-ash">
                O assistente ajuda a filtrar e agendar. Valores, documentação e negociação são sempre conduzidos por um corretor.
              </p>
            </div>
            <div className="rounded-[28px] bg-graphite p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <h2 className="text-[16px] font-medium">Experimente perguntar</h2>
              <ul className="mt-3 space-y-2 text-[14px] font-light text-ash">
                <li>“Cobertura em Pinheiros”</li>
                <li>“Apartamento de 2 quartos para alugar”</li>
                <li>“Como funciona o financiamento?”</li>
                <li>“Terreno em condomínio na Granja Viana”</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
