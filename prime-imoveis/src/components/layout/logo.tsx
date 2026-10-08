import Link from "next/link";
import { settings } from "@/config/agency";
import { cn } from "@/lib/utils";

/**
 * Marca do tenant (wordmark + subtítulo espaçado).
 * Troque o símbolo por <img src="/logo.svg" /> quando houver logo real.
 */
export function Logo({ className, href = "/", suffix }: { className?: string; href?: string; suffix?: string }) {
  const { logoTexto, logoSubtexto } = settings.aparencia;
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${logoTexto} ${logoSubtexto} — início`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-[11px] bg-porcelain text-ink transition-transform duration-300 group-hover:-translate-y-0.5">
        <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden>
          <path d="M5 15 16 6l11 9" />
          <path d="M9 13v12h14V13" />
          <path d="M14 25v-6h4v6" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-display)] text-[19px] font-medium tracking-[0.08em] text-porcelain">
          {logoTexto}
          {suffix && <span className="ml-2 rounded-full bg-white/[0.08] px-2 py-0.5 align-middle font-sans text-[10px] tracking-[0.08em] text-mist">{suffix}</span>}
        </span>
        <span className="mt-1 text-[8.5px] font-medium tracking-[0.42em] text-ash">{logoSubtexto}</span>
      </span>
    </Link>
  );
}
