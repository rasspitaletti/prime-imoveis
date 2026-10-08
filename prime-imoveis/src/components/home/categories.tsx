import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { images } from "@/config/images";
import { properties } from "@/data/properties";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";

const count = (fn: (p: (typeof properties)[number]) => boolean) => properties.filter((p) => p.ativo && fn(p)).length;

const categories = [
  { label: "Apartamentos", href: "/imoveis?tipo=Apartamento", img: images.catApartamentos, n: count((p) => p.tipo === "Apartamento"), span: "md:col-span-2 md:row-span-2" },
  { label: "Casas", href: "/imoveis?tipo=Casa", img: images.catCasas, n: count((p) => p.tipo === "Casa"), span: "md:col-span-2" },
  { label: "Coberturas", href: "/imoveis?tipo=Cobertura", img: images.catCoberturas, n: count((p) => p.tipo === "Cobertura"), span: "" },
  { label: "Terrenos", href: "/imoveis?tipo=Terreno", img: images.catTerrenos, n: count((p) => p.tipo === "Terreno"), span: "" },
  { label: "Imóveis comerciais", href: "/imoveis?tipo=Comercial", img: images.catComerciais, n: count((p) => p.tipo === "Comercial"), span: "md:col-span-2" },
  { label: "Condomínios", href: "/imoveis?condominio=1", img: images.catCondominios, n: count((p) => p.emCondominio), span: "col-span-2 md:col-span-2" },
];

export function Categories() {
  return (
    <Section id="categorias" band>
      <div className="container-x">
        <SectionHeader
          eyebrow="Categorias"
          title="Encontre o imóvel que procura"
          lead="Comece pelo tipo de imóvel. Os filtros completos ficam a um clique."
        />
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-6">
          {categories.map((c, i) => (
            <Reveal key={c.label} delay={(i % 3) * 0.06} className={cn("col-span-1", i === 0 && "col-span-2 row-span-2", c.span)}>
              <Link href={c.href} className="group relative block h-full overflow-hidden rounded-[28px]">
                <SmartImage
                  src={c.img}
                  alt={c.label}
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                  tone="deep"
                />
                <div className="relative flex h-full flex-col justify-between p-5 md:p-7">
                  <span className="self-end grid h-10 w-10 place-items-center rounded-full bg-white/10 text-porcelain backdrop-blur-xl transition-all duration-300 group-hover:bg-porcelain group-hover:text-ink">
                    <ArrowUpRight size={18} />
                  </span>
                  <div>
                    <h3 className={cn("font-[family-name:var(--font-display)] font-light tracking-[-0.02em]", i === 0 ? "text-[30px] md:text-[44px]" : "text-[20px] md:text-[26px]")}>
                      {c.label}
                    </h3>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-mist">
                      {c.n} {c.n === 1 ? "imóvel" : "imóveis"}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
