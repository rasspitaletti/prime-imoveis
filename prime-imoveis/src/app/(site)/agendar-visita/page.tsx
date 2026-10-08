import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getPropertyBySlug } from "@/data/properties";
import { PageIntro } from "@/components/layout/page-intro";
import { BookingFlow } from "@/components/booking/booking-flow";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Agendar visita",
  description: "Agende a visita a um imóvel em menos de um minuto, sem cadastro e sem senha.",
  alternates: { canonical: "/agendar-visita" },
};

const steps = ["Escolha o imóvel", "Escolha o horário", "Informe seus dados", "Confirme"];

export default async function AgendarVisitaPage({ searchParams }: { searchParams: Promise<{ imovel?: string }> }) {
  const { imovel } = await searchParams;
  const preset = imovel ? getPropertyBySlug(imovel)?.id : undefined;
  return (
    <>
      <PageIntro compact eyebrow="Agendamento de visita" title="Conheça o imóvel pessoalmente." lead="Sem cadastro e sem senha. O corretor confirma pelo WhatsApp." />
      <section className="pb-24 md:pb-36">
        <div className="container-x">
          <ol className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:flex-wrap md:items-center md:gap-1">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-1 md:contents">
                <Reveal delay={i * 0.06} className="flex items-center gap-3 rounded-full bg-white/[0.04] py-2 pl-2 pr-4">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-porcelain text-[12px] font-medium text-ink tabular">{i + 1}</span>
                  <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-mist">{s}</span>
                </Reveal>
                {i < steps.length - 1 && <ChevronRight size={16} className="hidden shrink-0 text-steel md:block" aria-hidden />}
              </li>
            ))}
          </ol>
          <BookingFlow key={preset ?? "none"} propertyId={preset} />
        </div>
      </section>
    </>
  );
}
