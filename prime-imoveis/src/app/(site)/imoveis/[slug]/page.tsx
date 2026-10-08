import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, MapPin } from "lucide-react";
import { agency } from "@/config/agency";
import { getPropertyBySlug, properties } from "@/data/properties";
import { getRegion } from "@/data/regions";
import { finalidadeLabel, formatNumber, formatPrice } from "@/lib/format";
import { similarProperties } from "@/services/search";
import { Reveal } from "@/components/ui/reveal";
import { Gallery } from "@/components/property/gallery";
import { PropertyCard, PropertySpecs, SeloBadge } from "@/components/property/property-card";
import { PropertySidebar } from "@/components/property/property-sidebar";
import { StylizedMap, mapsSearchUrl } from "@/components/home/contact";
import { ShareButton } from "@/components/property/share-button";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return { title: "Imóvel não encontrado" };
  const title = `${p.titulo} — ${p.endereco.bairro}`;
  return {
    title,
    description: `${p.tipo} ${p.finalidade === "venda" ? "à venda" : "para alugar"} em ${p.endereco.bairro}, ${p.endereco.cidade}. ${p.resumo} ${formatPrice(p)}.`,
    alternates: { canonical: `/imoveis/${p.slug}` },
    openGraph: { title, description: p.resumo, images: [{ url: p.imagens[0], alt: p.titulo }] },
  };
}

export default async function ImovelPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p || !p.ativo) notFound();

  const region = getRegion(p.regiaoId);
  const similar = similarProperties(p, 3);

  const facts = [
    { label: "Tipo", value: p.tipo },
    { label: "Finalidade", value: finalidadeLabel[p.finalidade] },
    p.quartos > 0 && { label: "Quartos", value: `${p.quartos}${p.suites ? ` (${p.suites} ${p.suites === 1 ? "suíte" : "suítes"})` : ""}` },
    p.banheiros > 0 && { label: "Banheiros", value: String(p.banheiros) },
    p.vagas > 0 && { label: "Vagas", value: String(p.vagas) },
    { label: p.tipo === "Terreno" ? "Área do terreno" : "Área útil", value: `${formatNumber(p.area)} m²` },
    p.areaTerreno && p.tipo !== "Terreno" && { label: "Terreno", value: `${formatNumber(p.areaTerreno)} m²` },
    { label: "Em condomínio", value: p.emCondominio ? "Sim" : "Não" },
    { label: "Código", value: p.codigo },
  ].filter(Boolean) as { label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.titulo,
    description: p.descricao,
    image: p.imagens,
    datePosted: p.publicadoEm,
    offers: { "@type": "Offer", price: p.preco, priceCurrency: "BRL", businessFunction: p.finalidade === "venda" ? "Sell" : "LeaseOut" },
    address: { "@type": "PostalAddress", addressLocality: p.endereco.cidade, addressRegion: p.endereco.uf, addressCountry: "BR" },
    floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" },
    numberOfRooms: p.quartos || undefined,
    broker: { "@type": "RealEstateAgent", name: agency.nome },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pb-10 pt-28 md:pt-32">
        <div className="container-x max-w-[1400px]">
          {/* Breadcrumb */}
          <nav aria-label="Você está em" className="mb-5 flex flex-wrap items-center gap-1 text-[12px] text-ash">
            <Link href="/" className="hover:text-porcelain">Início</Link>
            <ChevronRight size={12} className="text-slate" />
            <Link href={p.finalidade === "venda" ? "/comprar" : "/alugar"} className="hover:text-porcelain">
              {p.finalidade === "venda" ? "Comprar" : "Alugar"}
            </Link>
            <ChevronRight size={12} className="text-slate" />
            <Link href={`/imoveis?local=${p.regiaoId}`} className="hover:text-porcelain">{p.endereco.bairro}</Link>
            <ChevronRight size={12} className="text-slate" />
            <span className="text-mist">{p.codigo}</span>
          </nav>

          <Reveal>
            <Gallery images={p.imagens} title={p.titulo} />
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
            {/* Conteúdo */}
            <div className="min-w-0">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-mist">
                    {p.tipo} · {finalidadeLabel[p.finalidade]}
                  </span>
                  {p.selo && <SeloBadge selo={p.selo} />}
                  <ShareButton title={p.titulo} className="ml-auto" />
                </div>
                <h1 className="mt-5 font-[family-name:var(--font-display)] text-[32px] font-light leading-[1.1] tracking-[-0.025em] md:text-[48px]">{p.titulo}</h1>
                <p className="mt-4 inline-flex items-center gap-2 text-[15px] text-ash">
                  <MapPin size={16} strokeWidth={1.6} />
                  {p.endereco.bairro}, {p.endereco.cidade} — {p.endereco.uf}
                </p>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-line py-6 lg:hidden">
                  <p className="t-price text-[30px]">{formatPrice(p)}</p>
                </div>
                <PropertySpecs p={p} size="md" className="mt-6 gap-x-7 text-[15px] text-porcelain" />
              </Reveal>

              <Reveal className="mt-12">
                <h2 className="t-eyebrow mb-4">Sobre o imóvel</h2>
                <p className="font-[family-name:var(--font-display)] text-[22px] font-light leading-snug text-porcelain md:text-[26px]">{p.resumo}</p>
                <p className="mt-5 max-w-3xl text-[16px] font-light leading-[1.75] text-mist">{p.descricao}</p>
              </Reveal>

              <Reveal className="mt-12">
                <h2 className="t-eyebrow mb-4">Ficha técnica</h2>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-line sm:grid-cols-3">
                  {facts.map((f) => (
                    <div key={f.label} className="bg-graphite px-5 py-4">
                      <dt className="text-[12px] text-ash">{f.label}</dt>
                      <dd className="mt-1 text-[15px] tabular">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal className="mt-12">
                <h2 className="t-eyebrow mb-4">Características</h2>
                <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {p.caracteristicas.map((c) => (
                    <li key={c} className="flex items-center gap-3 text-[15px] font-light text-mist">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-12">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <h2 className="t-eyebrow">Localização</h2>
                  <p className="text-[12px] text-slate">Endereço exato informado no agendamento da visita.</p>
                </div>
                <div className="h-[340px]">
                  <StylizedMap
                    area
                    label={p.endereco.bairro}
                    caption={`${p.endereco.bairro} · ${p.endereco.cidade}/${p.endereco.uf}`}
                    href={mapsSearchUrl(`${p.endereco.bairro}, ${p.endereco.cidade} - ${p.endereco.uf}`)}
                  />
                </div>
                {region && <p className="mt-4 text-[15px] font-light leading-relaxed text-ash">{region.resumo}</p>}
              </Reveal>
            </div>

            {/* Conversão */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <PropertySidebar property={p} />
            </aside>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="band-fade py-20 md:py-28">
          <div className="container-x">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="t-eyebrow mb-4">Você também pode gostar</p>
                <h2 className="t-h2">Imóveis semelhantes</h2>
              </div>
              <Link href={`/imoveis?finalidade=${p.finalidade}&tipo=${p.tipo}`} className="text-[14px] text-link hover:underline">
                Ver mais opções →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.id} property={s} />
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  );
}
