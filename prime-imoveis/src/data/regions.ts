import { images } from "@/config/images";
import type { Regiao } from "@/types/entities";

export const regions: Regiao[] = [
  {
    id: "reg_pinheiros",
    slug: "pinheiros",
    nome: "Pinheiros",
    cidade: "São Paulo",
    uf: "SP",
    resumo: "Gastronomia, metrô e a vida cultural da Zona Oeste a poucos passos.",
    imagem: images.regPinheiros,
  },
  {
    id: "reg_jardins",
    slug: "jardins",
    nome: "Jardins",
    cidade: "São Paulo",
    uf: "SP",
    resumo: "Ruas arborizadas, alto padrão e a Oscar Freire como vizinha.",
    imagem: images.regJardins,
  },
  {
    id: "reg_vila_madalena",
    slug: "vila-madalena",
    nome: "Vila Madalena",
    cidade: "São Paulo",
    uf: "SP",
    resumo: "Bairro criativo, com prédios novos e lançamentos assinados.",
    imagem: images.regVilaMadalena,
  },
  {
    id: "reg_butanta",
    slug: "butanta",
    nome: "Butantã",
    cidade: "São Paulo",
    uf: "SP",
    resumo: "Casas amplas, verde e acesso rápido à Marginal e à USP.",
    imagem: images.regButanta,
  },
  {
    id: "reg_alphaville",
    slug: "alphaville",
    nome: "Alphaville",
    cidade: "Barueri",
    uf: "SP",
    resumo: "Condomínios fechados, segurança e infraestrutura completa.",
    imagem: images.regAlphaville,
  },
  {
    id: "reg_granja_viana",
    slug: "granja-viana",
    nome: "Granja Viana",
    cidade: "Cotia",
    uf: "SP",
    resumo: "Natureza, terrenos generosos e qualidade de vida perto da capital.",
    imagem: images.regGranjaViana,
  },
  {
    id: "reg_osasco",
    slug: "osasco",
    nome: "Osasco",
    cidade: "Osasco",
    uf: "SP",
    resumo: "Ótimo custo-benefício, comércio forte e acesso pela Castello Branco.",
    imagem: images.regOsasco,
  },
];

export const getRegion = (id: string) => regions.find((r) => r.id === id);
