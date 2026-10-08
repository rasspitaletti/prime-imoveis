import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { SmartImage } from "@/components/ui/smart-image";

/**
 * Abertura das páginas internas.
 * Com `image`, vira um palco fotográfico (mesma linguagem do Hero); sem, uma faixa escura.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  children,
  image,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  image?: string;
  compact?: boolean;
}) {
  const content = (
    <Reveal>
      <p className={cn("t-eyebrow mb-5", image && "text-mist")}>{eyebrow}</p>
      <h1 className={cn(compact ? "t-h1" : "t-display", "max-w-[16ch] text-balance")}>{title}</h1>
      {lead && <p className={cn("t-lead mt-6 max-w-2xl text-pretty", image && "text-mist")}>{lead}</p>}
      {children && <div className="mt-9">{children}</div>}
    </Reveal>
  );

  if (image) {
    return (
      <section className="px-2 pt-2 md:px-4 md:pt-4">
        <div className={cn("relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px]", compact ? "min-h-[52svh]" : "min-h-[68svh]")}>
          <SmartImage src={image} alt="" priority tone="none" className="absolute inset-0" />
          <div aria-hidden className="photo-scrim absolute inset-0" />
          <div className={cn("container-x relative flex flex-col justify-end pb-10 pt-36 md:pb-14", compact ? "min-h-[52svh]" : "min-h-[68svh]")}>{content}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("band-fade", compact ? "pb-8 pt-32 md:pb-10 md:pt-40" : "pb-10 pt-36 md:pb-16 md:pt-48")}>
      <div className="container-x">{content}</div>
    </section>
  );
}
