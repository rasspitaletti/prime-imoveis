import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function Section({
  id,
  className,
  children,
  band = false,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Faixa carbon → ink (único gradiente permitido no sistema). */
  band?: boolean;
}) {
  return (
    <section id={id} className={cn("relative py-24 md:py-36", band && "band-fade", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="t-eyebrow mb-4">{eyebrow}</p>}
        <h2 className="t-h1 text-balance">{title}</h2>
        {lead && <p className="t-lead mt-5 max-w-2xl text-pretty">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

export function Stars({ value = 5, size = 14 }: { value?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < value ? "fill-porcelain text-porcelain" : "fill-steel text-steel"}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[12px] font-medium text-mist",
        className,
      )}
    >
      {children}
    </span>
  );
}
