import { ArrowRight } from "lucide-react";
import { images } from "@/config/images";
import { whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";
import { SmartImage } from "@/components/ui/smart-image";

export function FinalCTA() {
  return (
    <section className="px-2 pb-6 md:px-4 md:pb-10">
      <Reveal className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px]">
        <SmartImage src={images.cta} alt="Residência iluminada ao anoitecer" className="absolute inset-0" imgClassName="object-center" tone="none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        <div className="relative flex min-h-[520px] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[620px]">
          <p className="t-eyebrow mb-6 text-mist">Atendimento sem compromisso</p>
          <h2 className="t-h1 max-w-[15ch] text-balance">Seu próximo imóvel pode estar aqui.</h2>
          <p className="t-lead mt-5 max-w-lg text-mist">
            Fale com nossa equipe e encontre uma opção que combine com o que você procura.
          </p>
          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/imoveis" size="lg" iconRight={<ArrowRight size={18} />}>
              Encontrar meu imóvel
            </ButtonLink>
            <ButtonLink href={whatsappLink()} size="lg" variant="whatsapp" icon={<WhatsAppIcon size={20} />}>
              Falar com um corretor
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
