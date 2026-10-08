"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bath, BedDouble, Car, Heart, MapPin, Ruler } from "lucide-react";
import { whatsappPropertyMessage } from "@/config/agency";
import { finalidadeLabel, formatNumber, formatPrice } from "@/lib/format";
import { cn, whatsappLink } from "@/lib/utils";
import type { Imovel } from "@/types/entities";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { SmartImage } from "@/components/ui/smart-image";

export function PropertySpecs({ p, className, size = "sm" }: { p: Imovel; className?: string; size?: "sm" | "md" }) {
  const items = [
    p.quartos > 0 && { icon: BedDouble, label: `${p.quartos} ${p.quartos === 1 ? "quarto" : "quartos"}`, short: p.quartos },
    p.banheiros > 0 && { icon: Bath, label: `${p.banheiros} ${p.banheiros === 1 ? "banheiro" : "banheiros"}`, short: p.banheiros },
    p.vagas > 0 && { icon: Car, label: `${p.vagas} ${p.vagas === 1 ? "vaga" : "vagas"}`, short: p.vagas },
    { icon: Ruler, label: `${formatNumber(p.area)} m²`, short: `${formatNumber(p.area)} m²` },
  ].filter(Boolean) as { icon: typeof Ruler; label: string; short: number | string }[];

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", size === "md" ? "text-[14px]" : "text-[13px]", "text-mist", className)}>
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-1.5" title={it.label}>
          <it.icon size={size === "md" ? 17 : 15} strokeWidth={1.6} className="text-ash" />
          <span className="tabular">{typeof it.short === "number" ? it.short : it.short}</span>
          <span className="sr-only">{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function SeloBadge({ selo, className }: { selo: NonNullable<Imovel["selo"]>; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] backdrop-blur-xl",
        selo === "Lançamento" || selo === "Exclusivo" ? "bg-accent text-ink" : "bg-black/45 text-porcelain shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]",
        className,
      )}
    >
      {selo}
    </span>
  );
}

export function PropertyCard({ property: p, className, priority }: { property: Imovel; className?: string; priority?: boolean }) {
  const [fav, setFav] = useState(false);
  const href = `/imoveis/${p.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-graphite shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background-color,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:bg-[#141412]",
        className,
      )}
    >
      <div className="relative p-2">
        <Link href={href} aria-label={`Ver ${p.titulo}`} className="block">
          <SmartImage
            src={p.imagens[0]}
            alt={`${p.tipo} — ${p.titulo}, ${p.endereco.bairro}`}
            priority={priority}
            className="aspect-[4/3] rounded-[22px]"
            imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
            tone="none"
          />
          <span aria-hidden className="pointer-events-none absolute inset-2 rounded-[22px] bg-gradient-to-t from-black/55 via-transparent to-black/25" />
        </Link>
        <div className="pointer-events-none absolute left-5 top-5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-porcelain backdrop-blur-xl">
            {finalidadeLabel[p.finalidade]}
          </span>
          {p.selo && <SeloBadge selo={p.selo} />}
        </div>
        <button
          type="button"
          onClick={() => setFav((v) => !v)}
          aria-pressed={fav}
          aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-porcelain backdrop-blur-xl transition-transform hover:scale-110 active:scale-95"
        >
          <Heart size={16} className={cn("transition-colors", fav && "fill-accent text-accent")} />
        </button>
        <p className="pointer-events-none absolute bottom-5 left-5 t-price text-[22px] text-white drop-shadow-[0_1px_8px_rgb(0_0_0/0.5)]">
          {formatPrice(p)}
        </p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <div className="flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ash">
          <span>{p.tipo}</span>
          <span className="tabular tracking-[0.08em] text-slate">{p.codigo}</span>
        </div>
        <h3 className="mt-2.5 font-[family-name:var(--font-display)] text-[20px] font-normal leading-snug tracking-[-0.015em] text-porcelain">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {p.titulo}
          </Link>
        </h3>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-ash">
          <MapPin size={13} strokeWidth={1.8} />
          {p.endereco.bairro}, {p.endereco.cidade}
        </p>
        <PropertySpecs p={p} className="mt-4 border-t border-line pt-4" />
        <div className="relative z-10 mt-5 flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/[0.06] text-[13px] font-medium text-porcelain transition-colors hover:bg-porcelain hover:text-ink"
          >
            Ver imóvel <ArrowUpRight size={15} />
          </Link>
          <a
            href={whatsappLink(whatsappPropertyMessage(p.titulo, p.codigo))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tenho interesse: ${p.titulo} (WhatsApp)`}
            title="Tenho interesse neste imóvel"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-mist transition-colors hover:bg-[#25D366] hover:text-[#05290f]"
          >
            <WhatsAppIcon size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}
