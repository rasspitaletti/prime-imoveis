import { agency } from "@/config/agency";
import { brokers } from "@/data/brokers";
import { properties } from "@/data/properties";
import { regions } from "@/data/regions";
import { formatPrice } from "@/lib/format";
import { searchProperties } from "@/services/search";
import type { FiltrosBusca, TipoImovel } from "@/types/entities";
import { filtersToQuery } from "@/services/search";

export type AIAction = { label: string; href: string };
export type AIReply = { text: string; actions?: AIAction[] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const has = (msg: string, ...words: string[]) => words.some((w) => msg.includes(w));

const TYPE_WORDS: [TipoImovel, string[]][] = [
  ["Cobertura", ["cobertura"]],
  ["Apartamento", ["apartamento", "apto", "studio", "flat"]],
  ["Casa", ["casa", "sobrado"]],
  ["Terreno", ["terreno", "lote"]],
  ["Comercial", ["comercial", "sala", "escritorio", "loja", "galpao"]],
];

/** Interpreta uma frase livre em filtros de busca (mock simples por palavras-chave). */
function parseIntent(msg: string): FiltrosBusca {
  const f: FiltrosBusca = {};
  if (has(msg, "alugar", "aluguel", "locacao", "locar")) f.finalidade = "aluguel";
  else if (has(msg, "comprar", "compra", "venda", "investir")) f.finalidade = "venda";
  const t = TYPE_WORDS.find(([, ws]) => ws.some((w) => msg.includes(w)));
  if (t) f.tipo = t[0];
  const r = regions.find((x) => msg.includes(norm(x.nome)));
  if (r) f.local = r.id;
  const q = msg.match(/(\d)\s*(quartos|dormitorios|quarto|dorm)/);
  if (q) f.quartos = Number(q[1]);
  const mi = msg.match(/ate\s*(\d+(?:[.,]\d+)?)\s*(mi|milhao|milhoes)/);
  const mil = msg.match(/ate\s*(\d+)\s*mil/);
  if (mi) f.precoMax = Number(mi[1].replace(",", ".")) * 1_000_000;
  else if (mil) f.precoMax = Number(mil[1]) * 1_000;
  return f;
}

/** Respostas mockadas por intenção. Substituído pelo backend (POST /ai/chat). */
export function mockAIReply(raw: string): AIReply {
  const msg = norm(raw);
  const f = parseIntent(msg);

  if (has(msg, "visita", "visitar", "conhecer pessoalmente", "agendar")) {
    return {
      text: "Posso agendar sua visita: escolha o imóvel, o dia e o horário. É rápido e não precisa de cadastro — só nome e telefone.",
      actions: [{ label: "Agendar visita", href: "/agendar-visita" }],
    };
  }

  if (f.tipo || f.local || f.finalidade || f.quartos || f.precoMax) {
    const found = searchProperties(f).slice(0, 3);
    if (!found.length) {
      return {
        text: "Não encontrei imóveis disponíveis com esse perfil agora. Um corretor pode buscar opções fora do site para você.",
        actions: [
          { label: "Ver todos os imóveis", href: "/imoveis" },
          { label: "Falar com um corretor", href: "whatsapp" },
        ],
      };
    }
    return {
      text: `Encontrei ${found.length === 1 ? "esta opção" : "algumas opções"}:\n${found
        .map((p) => `• ${p.titulo} — ${p.endereco.bairro}, ${formatPrice(p)}`)
        .join("\n")}`,
      actions: [
        ...found.slice(0, 2).map((p) => ({ label: `Ver ${p.codigo}`, href: `/imoveis/${p.slug}` })),
        { label: "Ver todos os resultados", href: `/imoveis${filtersToQuery(f)}` },
      ],
    };
  }

  if (has(msg, "financ", "fgts", "banco", "entrada")) {
    return {
      text: "Trabalhamos com os principais bancos e ajudamos a simular o financiamento, usar FGTS e organizar a documentação. A entrada costuma ser de 20% a 30% do valor do imóvel.",
      actions: [{ label: "Falar com um corretor", href: "whatsapp" }],
    };
  }

  if (has(msg, "fiador", "seguro fianca", "garantia", "caucao")) {
    return {
      text: "Na locação, você pode usar seguro-fiança, título de capitalização ou caução — sem precisar de fiador. Explicamos cada opção antes de assinar.",
      actions: [{ label: "Ver imóveis para alugar", href: "/alugar" }],
    };
  }

  if (has(msg, "vender", "anunciar", "avaliar", "avaliacao", "meu imovel")) {
    return {
      text: "Para vender ou alugar seu imóvel, fazemos uma avaliação gratuita com base em vendas reais da região e cuidamos de fotos, divulgação e negociação.",
      actions: [{ label: "Solicitar avaliação", href: "whatsapp" }],
    };
  }

  if (has(msg, "endereco", "onde fica", "escritorio", "horario")) {
    const e = agency.endereco;
    return {
      text: `Nosso escritório fica na ${e.logradouro}, ${e.bairro} — ${e.cidade}/${e.uf}. Atendemos ${agency.horarioAtendimento
        .map((h) => `${h.dias.toLowerCase()}, ${h.horario}`)
        .join("; ")}.`,
      actions: [{ label: "Ver contato", href: "/contato" }],
    };
  }

  if (has(msg, "corretor", "atendente", "humano", "pessoa")) {
    return {
      text: `Nossa equipe: ${brokers.map((b) => `${b.nome} (${b.cargo.split("·")[1]?.trim() ?? b.cargo})`).join(", ")}.`,
      actions: [{ label: "Falar no WhatsApp", href: "whatsapp" }],
    };
  }

  if (has(msg, "oi", "ola", "bom dia", "boa tarde", "boa noite")) {
    return { text: "Olá! Me conte o que você procura — por exemplo: “apartamento de 2 quartos para alugar em Pinheiros”." };
  }

  return {
    text: `Temos ${properties.length} imóveis selecionados no momento. Me diga tipo, bairro, quartos ou faixa de preço e eu filtro para você.`,
    actions: [
      { label: "Ver imóveis", href: "/imoveis" },
      { label: "Falar com um corretor", href: "whatsapp" },
    ],
  };
}

export const aiSuggestions = [
  "Apartamento para alugar em Pinheiros",
  "Casa em condomínio até 5 milhões",
  "Preciso de fiador para alugar?",
  "Quero agendar uma visita",
];
