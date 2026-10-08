import { Quote } from "lucide-react";
import { testimonials, testimonialStats } from "@/data/testimonials";
import { formatShortDate } from "@/lib/date";
import { cn, initials } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader, Stars } from "@/components/ui/section";

export function TestimonialsSummary() {
  return (
    <div className="flex items-center gap-5">
      <p className="font-[family-name:var(--font-display)] text-[56px] font-light leading-none tracking-[-0.04em]">
        {testimonialStats.media.toFixed(1).replace(".", ",")}
      </p>
      <div>
        <Stars size={15} />
        <p className="mt-1.5 text-[13px] text-ash">{testimonialStats.total} avaliações de clientes</p>
      </div>
    </div>
  );
}

export function TestimonialsGrid({ limit }: { limit?: number }) {
  const list = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {list.map((r, i) => (
        <Reveal key={r.id} delay={(i % 3) * 0.08}>
          <figure
            className={cn(
              "flex h-full flex-col justify-between rounded-[28px] p-7 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-8",
              i === 0 ? "bg-porcelain text-ink" : "bg-graphite",
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={cn("rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em]", i === 0 ? "bg-ink/[0.06] text-ink/70" : "bg-white/[0.05] text-ash")}>
                  {r.perfil}
                </span>
                <Quote size={20} className={i === 0 ? "text-ink/20" : "text-steel"} />
              </div>
              <blockquote className={cn("mt-6 font-[family-name:var(--font-display)] text-[20px] font-light leading-[1.45] tracking-[-0.01em]", i === 0 ? "text-ink" : "text-porcelain")}>
                “{r.texto}”
              </blockquote>
            </div>
            <figcaption className="mt-8 flex items-center gap-3">
              <span className={cn("grid h-10 w-10 place-items-center rounded-full text-[13px] font-medium", i === 0 ? "bg-ink text-porcelain" : "bg-white/[0.07] text-mist")}>
                {initials(r.autor)}
              </span>
              <span className="text-[13px]">
                <span className="block font-medium">{r.autor}</span>
                <span className={i === 0 ? "text-ink/55" : "text-ash"}>
                  {r.bairro} · {formatShortDate(r.data)}
                </span>
              </span>
              <span className="ml-auto">
                <Stars value={r.nota} size={12} />
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <Section id="depoimentos">
      <div className="container-x">
        <SectionHeader eyebrow="Depoimentos" title="O que nossos clientes dizem" action={<TestimonialsSummary />} />
        <TestimonialsGrid />
      </div>
    </Section>
  );
}
