import type { Configuracao, Imobiliaria } from "@/types/entities";

/**
 * ============================================================
 *  CONFIGURAÇÃO DO CLIENTE (TENANT)
 * ============================================================
 *  Para adaptar o sistema a outra imobiliária, altere APENAS:
 *   - este arquivo (nome, contato, endereço, redes, mensagens)
 *   - src/config/images.ts (fotos)
 *   - src/data/*.ts (imóveis, corretores, regiões, depoimentos)
 *   - tokens de cor em src/app/globals.css (bloco @theme)
 *  Quando o backend existir, estes dados virão de GET /imobiliarias/{slug}.
 */

export const agency: Imobiliaria = {
  id: "agency_001",
  slug: "prime-imoveis",
  nome: "Prime Imóveis",
  nomeCurto: "Prime",
  slogan: "Encontre o imóvel ideal para você.",
  descricao:
    "Imobiliária boutique em São Paulo especializada em imóveis residenciais e comerciais selecionados, com atendimento personalizado do primeiro contato à entrega das chaves.",
  creci: "CRECI-SP 00000-J",
  fundacao: 2009,
  endereco: {
    logradouro: "Av. Principal, 100 — Conj. 42",
    bairro: "Pinheiros",
    cidade: "São Paulo",
    uf: "SP",
    cep: "05400-000",
    lat: -23.5617,
    lng: -46.6914,
  },
  contato: {
    telefone: "(11) 3333-0000",
    whatsapp: "5511999999999",
    whatsappExibicao: "(11) 99999-9999",
    email: "contato@primeimoveis.com.br",
  },
  redes: {
    instagram: { usuario: "@primeimoveis", url: "https://instagram.com/primeimoveis" },
    facebook: { url: "https://facebook.com/primeimoveis" },
    tiktok: { url: "https://tiktok.com/@primeimoveis" },
  },
  horarioAtendimento: [
    { dias: "Segunda a sexta", horario: "09h às 19h" },
    { dias: "Sábado", horario: "09h às 14h" },
  ],
};

export const whatsappDefaultMessage =
  "Olá! Estou procurando um imóvel e gostaria de falar com um corretor.";

export const whatsappPropertyMessage = (titulo: string, codigo?: string) =>
  `Olá, tenho interesse no imóvel ${titulo}${codigo ? ` (cód. ${codigo})` : ""}. Gostaria de receber mais informações.`;

export const settings: Configuracao = {
  imobiliariaId: agency.id,
  aparencia: { corPrimaria: "#c9a46c", logoTexto: "PRIME", logoSubtexto: "IMÓVEIS" },
  agenda: {
    duracaoVisitaMin: 60,
    intervaloMin: 60,
    antecedenciaMinimaHoras: 3,
    diasFuturosVisiveis: 14,
    abertura: "09:00",
    fechamento: "19:00",
    pausaInicio: "12:00",
    pausaFim: "13:00",
  },
  notificacoes: {
    whatsappConfirmacao: true,
    lembrete24h: true,
    emailNovoLead: true,
  },
  assistente: {
    ativo: true,
    mensagemBoasVindas:
      "Olá! Sou o assistente da Prime Imóveis. Posso te ajudar a encontrar imóveis, entender custos, conhecer bairros e agendar uma visita.",
  },
};

export const publicNav = [
  { label: "Comprar", href: "/comprar" },
  { label: "Alugar", href: "/alugar" },
  { label: "Imóveis", href: "/imoveis" },
  { label: "Lançamentos", href: "/lancamentos" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;
