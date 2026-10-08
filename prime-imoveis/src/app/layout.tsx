import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { agency } from "@/config/agency";
import { images } from "@/config/images";
import { regions } from "@/data/regions";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${agency.nome} | Imóveis selecionados em ${agency.endereco.cidade}`,
    template: `%s | ${agency.nome}`,
  },
  description: agency.descricao,
  keywords: [
    "imobiliária",
    `imóveis em ${agency.endereco.cidade}`,
    "apartamento à venda",
    "casa em condomínio",
    "cobertura",
    "aluguel de apartamento",
    ...regions.map((r) => `imóveis ${r.nome}`),
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: agency.nome,
    title: `${agency.nome} | Encontre o imóvel ideal para você`,
    description: agency.descricao,
    images: [{ url: images.hero, width: 1200, height: 630, alt: "Casa moderna iluminada ao anoitecer" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  other: {
    "geo.region": `BR-${agency.endereco.uf}`,
    "geo.placename": agency.endereco.cidade,
    "geo.position": `${agency.endereco.lat};${agency.endereco.lng}`,
    ICBM: `${agency.endereco.lat}, ${agency.endereco.lng}`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080807",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: agency.nome,
  description: agency.descricao,
  url: siteUrl,
  telephone: agency.contato.telefone,
  email: agency.contato.email,
  image: images.hero,
  foundingDate: String(agency.fundacao),
  address: {
    "@type": "PostalAddress",
    streetAddress: agency.endereco.logradouro,
    addressLocality: agency.endereco.cidade,
    addressRegion: agency.endereco.uf,
    postalCode: agency.endereco.cep,
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: agency.endereco.lat, longitude: agency.endereco.lng },
  areaServed: regions.map((r) => `${r.nome}, ${r.cidade}`),
  sameAs: [agency.redes.instagram.url, agency.redes.facebook.url, agency.redes.tiktok.url],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
