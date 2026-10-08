import { images } from "@/config/images";
import type { Corretor } from "@/types/entities";

export const brokers: Corretor[] = [
  {
    id: "cor_carolina",
    nome: "Carolina Mendes",
    cargo: "Corretora sênior · Alto padrão",
    creci: "CRECI-SP 111111-F",
    especialidades: ["Alto padrão", "Coberturas", "Casas em condomínio"],
    bio: "Há 14 anos aproximando famílias do endereço certo nos Jardins, Pinheiros e Alphaville. Conhece cada prédio pelo nome.",
    foto: images.brokerCarolina,
    experienciaAnos: 14,
    regiaoIds: ["reg_jardins", "reg_pinheiros", "reg_alphaville", "reg_vila_madalena"],
    diasAtendimento: [1, 2, 3, 4, 5, 6],
    telefone: "(11) 98888-1111",
    ativo: true,
  },
  {
    id: "cor_rafael",
    nome: "Rafael Duarte",
    cargo: "Corretor · Comercial e terrenos",
    creci: "CRECI-SP 222222-F",
    especialidades: ["Imóveis comerciais", "Terrenos", "Investimento"],
    bio: "Engenheiro de formação, cuida de salas, lajes corporativas e terrenos com análise de potencial construtivo.",
    foto: images.brokerRafael,
    experienciaAnos: 11,
    regiaoIds: ["reg_pinheiros", "reg_granja_viana", "reg_alphaville", "reg_osasco"],
    diasAtendimento: [1, 2, 3, 4, 5],
    telefone: "(11) 98888-2222",
    ativo: true,
  },
  {
    id: "cor_beatriz",
    nome: "Beatriz Lopes",
    cargo: "Corretora · Locação e lançamentos",
    creci: "CRECI-SP 333333-F",
    especialidades: ["Locação", "Lançamentos", "Primeiro imóvel"],
    bio: "Especialista em locação sem burocracia e em lançamentos na Zona Oeste. Acompanha cada etapa até a vistoria.",
    foto: images.brokerBeatriz,
    experienciaAnos: 8,
    regiaoIds: ["reg_vila_madalena", "reg_butanta", "reg_osasco", "reg_pinheiros"],
    diasAtendimento: [1, 2, 3, 4, 5, 6],
    telefone: "(11) 98888-3333",
    ativo: true,
  },
];

export const getBroker = (id: string) => brokers.find((b) => b.id === id);
