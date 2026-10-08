import { brokers } from "@/data/brokers";
import { getRegion } from "@/data/regions";
import { whatsappLink } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { SmartImage } from "@/components/ui/smart-image";

export function BrokersGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {brokers.map((b, i) => (
        <Reveal key={b.id} delay={i * 0.08}>
          <article id={b.id} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-graphite shadow-[inset_0_0_0_1px_var(--color-line)]">
            <div className="relative p-2">
              <SmartImage
                src={b.foto}
                alt={`${b.nome}, ${b.cargo}`}
                className="aspect-[4/5] rounded-[22px]"
                imgClassName="object-top grayscale-[40%] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                tone="deep"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-mist">{b.cargo}</p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-[26px] font-light tracking-[-0.02em]">{b.nome}</h3>
              </div>
            </div>
            <div className="flex flex-1 flex-col px-6 pb-6 pt-3">
              <div className="flex flex-wrap gap-1.5">
                {b.especialidades.map((s) => (
                  <span key={s} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[12px] text-mist">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-4 flex-1 text-[15px] font-light leading-relaxed text-ash">{b.bio}</p>
              {detailed && (
                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5 text-[13px]">
                  <div>
                    <dt className="text-slate">Registro</dt>
                    <dd className="mt-0.5 text-mist">{b.creci}</dd>
                  </div>
                  <div>
                    <dt className="text-slate">Regiões</dt>
                    <dd className="mt-0.5 text-mist">{b.regiaoIds.slice(0, 3).map((r) => getRegion(r)?.nome).join(", ")}</dd>
                  </div>
                </dl>
              )}
              <ButtonLink
                href={whatsappLink(`Olá, ${b.nome.split(" ")[0]}! Encontrei você no site da Prime Imóveis e gostaria de ajuda para encontrar um imóvel.`)}
                size="sm"
                variant="secondary"
                className="mt-6 h-10"
                icon={<WhatsAppIcon size={15} />}
              >
                Falar com {b.nome.split(" ")[0]}
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
