import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const routes = ["", "/imoveis", "/comprar", "/alugar", "/lancamentos", "/sobre", "/corretores", "/contato", "/agendar-visita", "/assistente"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({
      url: `${siteUrl}${r}`,
      lastModified: new Date(),
      changeFrequency: (r === "" || r === "/imoveis" ? "daily" : "weekly") as "daily" | "weekly",
      priority: r === "" ? 1 : 0.8,
    })),
    ...properties
      .filter((p) => p.ativo)
      .map((p) => ({ url: `${siteUrl}/imoveis/${p.slug}`, lastModified: new Date(p.publicadoEm), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
