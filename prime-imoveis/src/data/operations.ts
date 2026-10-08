/**
 * Dados operacionais fictícios (clientes, visitas, leads e atividades).
 * Gerados de forma determinística em torno da data atual para o painel
 * sempre parecer "vivo". NÃO são dados reais.
 */
import { settings } from "@/config/agency";
import { brokers } from "@/data/brokers";
import { properties } from "@/data/properties";
import { addDays, hhmm, minutesOf, startOfDay, toISODate } from "@/lib/date";
import { seeded } from "@/lib/utils";
import type { Cliente, Lead, StatusLead, StatusVisita, Visita } from "@/types/entities";

const FIRST = [
  "Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio", "Gabriela", "Henrique", "Isabela", "João",
  "Larissa", "Marcos", "Natália", "Otávio", "Paula", "Renato", "Sofia", "Thiago", "Vanessa", "Wagner",
  "Beatriz", "Caio", "Débora", "Felipe", "Helena", "Igor", "Lívia", "Mateus", "Priscila", "Rodrigo",
];
const LAST = ["Souza", "Lima", "Ferreira", "Rocha", "Martins", "Barbosa", "Gomes", "Ribeiro", "Carvalho", "Teixeira", "Moreira", "Nunes"];
const ORIGENS: Cliente["origem"][] = ["Site", "WhatsApp", "Indicação", "Instagram", "Portal", "Assistente"];
const PERFIS: Cliente["perfil"][] = ["Comprador", "Comprador", "Locatário", "Proprietário", "Investidor"];

const rand = seeded(20261007);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const today = startOfDay();

export const clients: Cliente[] = Array.from({ length: 52 }, (_, i) => {
  const nome = `${FIRST[i % FIRST.length]} ${pick(LAST)}`;
  const created = addDays(today, -Math.floor(rand() * 400) - 1);
  return {
    id: `cli_${String(i + 1).padStart(3, "0")}`,
    nome,
    telefone: `(11) 9${Math.floor(rand() * 9000 + 1000)}-${Math.floor(rand() * 9000 + 1000)}`,
    email: `${nome.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}@exemplo.com`,
    perfil: pick(PERFIS),
    criadoEm: created.toISOString(),
    totalVisitas: Math.floor(rand() * 6),
    origem: pick(ORIGENS),
  };
});

const { abertura, fechamento, pausaInicio, pausaFim, intervaloMin, duracaoVisitaMin } = settings.agenda;
const SLOTS: number[] = [];
for (let m = minutesOf(abertura); m < minutesOf(fechamento); m += intervaloMin) {
  if (m >= minutesOf(pausaInicio) && m < minutesOf(pausaFim)) continue;
  SLOTS.push(m);
}

const statusFor = (offset: number): StatusVisita => {
  const r = rand();
  if (offset < 0) return r < 0.8 ? "realizada" : r < 0.9 ? "nao_compareceu" : "cancelada";
  if (offset === 0) return r < 0.75 ? "confirmada" : "pendente";
  return r < 0.55 ? "confirmada" : r < 0.93 ? "pendente" : "cancelada";
};

const generated: Visita[] = [];
let seq = 1;
for (let offset = -21; offset <= 14; offset++) {
  const date = addDays(today, offset);
  const dow = date.getDay();
  if (dow === 0) continue;
  for (const b of brokers) {
    if (!b.diasAtendimento.includes(dow)) continue;
    const slots = dow === 6 ? SLOTS.filter((s) => s < 14 * 60) : SLOTS;
    const myProps = properties.filter((p) => p.corretorId === b.id);
    const density = offset <= 2 ? 0.5 : 0.28;
    for (const s of slots) {
      if (rand() > density) continue;
      const cli = pick(clients);
      const imv = pick(myProps);
      generated.push({
        id: `vis_${String(seq++).padStart(4, "0")}`,
        clienteId: cli.id,
        clienteNome: cli.nome,
        clienteTelefone: cli.telefone,
        imovelId: imv.id,
        corretorId: b.id,
        data: toISODate(date),
        hora: hhmm(s),
        duracaoMin: duracaoVisitaMin,
        status: statusFor(offset),
        origem: pick(ORIGENS),
        criadoEm: addDays(date, -Math.floor(rand() * 10) - 1).toISOString(),
      });
    }
  }
}

export const visits: Visita[] = generated.sort((a, b) =>
  a.data === b.data ? a.hora.localeCompare(b.hora) : a.data.localeCompare(b.data),
);

for (const c of clients) {
  const past = visits.filter((v) => v.clienteId === c.id && v.status === "realizada");
  if (past.length) c.ultimaVisita = past[past.length - 1].data;
}

const LEAD_STATUS: StatusLead[] = ["novo", "novo", "em_atendimento", "em_atendimento", "proposta", "fechado", "perdido"];
const MSGS = [
  "Gostaria de agendar uma visita no fim de semana.",
  "O proprietário aceita proposta?",
  "Aceita financiamento?",
  "Qual o valor do condomínio atualizado?",
  "Tenho um apartamento para dar como parte do pagamento.",
  "Preciso me mudar em até 60 dias.",
  undefined,
];

export const leads: Lead[] = Array.from({ length: 26 }, (_, i) => {
  const c = pick(clients);
  const hoursAgo = Math.floor(i * 9 + rand() * 8);
  return {
    id: `lead_${String(i + 1).padStart(3, "0")}`,
    nome: c.nome,
    telefone: c.telefone,
    email: c.email,
    mensagem: pick(MSGS),
    imovelId: pick(properties).id,
    origem: pick(ORIGENS),
    status: i < 5 ? "novo" : pick(LEAD_STATUS),
    criadoEm: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
  };
});

export type Activity = {
  id: string;
  tipo: "visita" | "confirmacao" | "cancelamento" | "lead" | "proposta" | "assistente";
  texto: string;
  quando: string;
};

export const activities: Activity[] = [
  { id: "act1", tipo: "lead", texto: "Novo interesse na Cobertura duplex em Pinheiros", quando: "há 6 min" },
  { id: "act2", tipo: "confirmacao", texto: "Visita das 15:00 confirmada pelo WhatsApp", quando: "há 22 min" },
  { id: "act3", tipo: "assistente", texto: "Assistente iniciou agendamento de visita em Alphaville", quando: "há 40 min" },
  { id: "act4", tipo: "proposta", texto: "Proposta recebida para o terreno na Granja Viana", quando: "há 1 h" },
  { id: "act5", tipo: "visita", texto: "Nova visita solicitada: apartamento na Vila Madalena", quando: "há 2 h" },
  { id: "act6", tipo: "cancelamento", texto: "Visita de amanhã às 10:00 cancelada pelo cliente", quando: "há 3 h" },
];
