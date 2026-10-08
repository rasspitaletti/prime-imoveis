/**
 * Camada de acesso a dados.
 * ------------------------------------------------------------
 * Hoje: retorna dados mockados (NEXT_PUBLIC_USE_MOCKS != "false").
 * Amanhã: as mesmas funções chamam o FastAPI via `http()`.
 *
 * Endpoints sugeridos (FastAPI):
 *   GET  /imobiliarias/{slug}
 *   GET  /imoveis?finalidade=&tipo=&local=&preco_min=&preco_max=&quartos=&banheiros=&vagas=&area_min=&area_max=&ordem=
 *   GET  /imoveis/{slug}             GET /regioes      GET /corretores
 *   GET  /corretores/{id}/horarios?data=YYYY-MM-DD
 *   POST /visitas/solicitacoes       (público, sem login)
 *   POST /leads                      (formulário "tenho interesse")
 *   GET  /admin/visitas   PATCH /admin/visitas/{id}   POST /admin/visitas
 *   GET  /admin/leads     PATCH /admin/leads/{id}
 *   GET  /admin/clientes  GET /admin/dashboard/resumo
 *   POST /ai/chat                    (o backend fala com o provedor de IA)
 */
import { clients, leads, visits } from "@/data/operations";
import { brokers } from "@/data/brokers";
import { getPropertyBySlug } from "@/data/properties";
import { testimonials } from "@/data/testimonials";
import { computeSlots } from "@/services/availability";
import { filtersToQuery, searchProperties } from "@/services/search";
import type { AIReply } from "@/services/mock-ai";
import type {
  Cliente,
  Corretor,
  Depoimento,
  FiltrosBusca,
  Horario,
  ID,
  Imovel,
  ISODate,
  Lead,
  SolicitacaoInteresse,
  SolicitacaoVisita,
  StatusLead,
  StatusVisita,
  Visita,
} from "@/types/entities";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "include", // sessão do painel via cookie httpOnly emitido pelo backend
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json() as Promise<T>;
}

export const api = {
  /* ----------------------------- Público ----------------------------- */
  properties: {
    search: async (f: FiltrosBusca): Promise<Imovel[]> =>
      USE_MOCKS ? searchProperties(f) : http(`/imoveis${filtersToQuery(f)}`),
    bySlug: async (slug: string): Promise<Imovel | undefined> =>
      USE_MOCKS ? getPropertyBySlug(slug) : http(`/imoveis/${slug}`),
  },

  brokers: {
    list: async (): Promise<Corretor[]> => (USE_MOCKS ? brokers.filter((b) => b.ativo) : http("/corretores")),
    slots: async (corretorId: ID, data: ISODate): Promise<Horario[]> => {
      if (!USE_MOCKS) return http(`/corretores/${corretorId}/horarios?data=${data}`);
      await delay(350);
      return computeSlots(corretorId, data);
    },
  },

  testimonials: {
    list: async (): Promise<Depoimento[]> => (USE_MOCKS ? testimonials.filter((t) => t.publicado) : http("/depoimentos")),
  },

  visits: {
    /** Solicitação pública de visita: apenas nome + telefone. */
    request: async (payload: SolicitacaoVisita): Promise<{ protocolo: string }> => {
      if (!USE_MOCKS) return http("/visitas/solicitacoes", { method: "POST", body: JSON.stringify(payload) });
      await delay(900);
      const slot = computeSlots(payload.corretorId, payload.data).find((s) => s.hora === payload.hora);
      if (!slot?.disponivel) throw new ApiError(409, "Este horário acabou de ser reservado. Escolha outro, por favor.");
      return { protocolo: `VS-${Date.now().toString(36).toUpperCase().slice(-6)}` };
    },
  },

  leads: {
    /** Formulário "Tenho interesse" da página do imóvel. */
    create: async (payload: SolicitacaoInteresse): Promise<{ protocolo: string }> => {
      if (!USE_MOCKS) return http("/leads", { method: "POST", body: JSON.stringify(payload) });
      await delay(800);
      leads.unshift({
        id: `lead_n${Date.now().toString(36)}`,
        nome: payload.nome,
        telefone: payload.telefone,
        email: payload.email,
        mensagem: payload.mensagem,
        imovelId: payload.imovelId,
        origem: "Site",
        status: "novo",
        criadoEm: new Date().toISOString(),
      });
      return { protocolo: `LD-${Date.now().toString(36).toUpperCase().slice(-6)}` };
    },
  },

  /* ----------------------------- Admin ----------------------------- */
  admin: {
    visits: async (filters?: { status?: StatusVisita; de?: ISODate; ate?: ISODate }): Promise<Visita[]> => {
      if (!USE_MOCKS) {
        const q = new URLSearchParams(filters as Record<string, string>).toString();
        return http(`/admin/visitas?${q}`);
      }
      return visits.filter(
        (v) =>
          (!filters?.status || v.status === filters.status) &&
          (!filters?.de || v.data >= filters.de) &&
          (!filters?.ate || v.data <= filters.ate),
      );
    },
    updateVisitStatus: async (id: ID, status: StatusVisita): Promise<Visita> => {
      if (!USE_MOCKS) return http(`/admin/visitas/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await delay(250);
      const v = visits.find((x) => x.id === id);
      if (!v) throw new ApiError(404, "Visita não encontrada");
      v.status = status;
      return { ...v };
    },
    createVisit: async (input: Omit<Visita, "id" | "criadoEm" | "clienteId"> & { clienteId?: ID }): Promise<Visita> => {
      if (!USE_MOCKS) return http("/admin/visitas", { method: "POST", body: JSON.stringify(input) });
      await delay(400);
      const created: Visita = {
        ...input,
        id: `vis_n${Date.now().toString(36)}`,
        clienteId: input.clienteId ?? `cli_n${Date.now().toString(36)}`,
        criadoEm: new Date().toISOString(),
      };
      visits.push(created);
      visits.sort((a, b) => (a.data === b.data ? a.hora.localeCompare(b.hora) : a.data.localeCompare(b.data)));
      return created;
    },
    leads: async (): Promise<Lead[]> => (USE_MOCKS ? leads : http("/admin/leads")),
    updateLeadStatus: async (id: ID, status: StatusLead): Promise<Lead> => {
      if (!USE_MOCKS) return http(`/admin/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await delay(200);
      const l = leads.find((x) => x.id === id);
      if (!l) throw new ApiError(404, "Lead não encontrado");
      l.status = status;
      return { ...l };
    },
    clients: async (): Promise<Cliente[]> => (USE_MOCKS ? clients : http("/admin/clientes")),
  },

  /* ----------------------------- Assistente ----------------------------- */
  ai: {
    /** A chamada real ao provedor de IA acontece SOMENTE no backend. Nenhuma chave no frontend. */
    chat: async (message: string): Promise<AIReply> => {
      if (!USE_MOCKS) return http<AIReply>("/ai/chat", { method: "POST", body: JSON.stringify({ message }) });
      const { mockAIReply } = await import("@/services/mock-ai");
      await delay(700 + Math.random() * 600);
      return mockAIReply(message);
    },
  },
};
