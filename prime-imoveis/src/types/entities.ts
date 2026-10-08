/**
 * Entidades do domínio imobiliário.
 * Espelham as futuras tabelas do PostgreSQL / schemas Pydantic do FastAPI.
 * Mantenha camelCase no frontend; o adaptador em `src/services/api.ts`
 * é o lugar para converter de/para snake_case.
 */

export type ID = string;
export type ISODate = string; // "2026-10-07"
export type ISODateTime = string; // "2026-10-07T14:30:00-03:00"
export type HHmm = string; // "14:30"

export interface Imobiliaria {
  id: ID;
  slug: string;
  nome: string;
  nomeCurto: string;
  slogan: string;
  descricao: string;
  creci: string;
  fundacao: number;
  endereco: {
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    lat: number;
    lng: number;
  };
  contato: {
    telefone: string;
    whatsapp: string; // apenas dígitos com DDI, ex.: 5511999999999
    whatsappExibicao: string;
    email: string;
  };
  redes: {
    instagram: { usuario: string; url: string };
    facebook: { url: string };
    tiktok: { url: string };
  };
  horarioAtendimento: { dias: string; horario: string }[];
}

export type Finalidade = "venda" | "aluguel";
export type TipoImovel = "Apartamento" | "Casa" | "Cobertura" | "Terreno" | "Comercial";
export type SeloImovel = "Lançamento" | "Oportunidade" | "Condição especial" | "Exclusivo" | "Destaque";

export interface Regiao {
  id: ID;
  slug: string;
  nome: string; // bairro ou cidade
  cidade: string;
  uf: string;
  resumo: string;
  imagem: string;
}

export interface Imovel {
  id: ID;
  slug: string;
  codigo: string; // código interno exibido ao cliente
  titulo: string;
  tipo: TipoImovel;
  finalidade: Finalidade;
  preco: number; // venda: valor total | aluguel: valor mensal
  condominio?: number; // mensal
  iptu?: number; // anual
  regiaoId: ID;
  endereco: { bairro: string; cidade: string; uf: string; lat: number; lng: number };
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  area: number; // área útil ou do terreno, em m²
  areaTerreno?: number;
  emCondominio: boolean;
  resumo: string;
  descricao: string;
  caracteristicas: string[];
  imagens: string[]; // a primeira é a capa
  selo?: SeloImovel;
  destaque: boolean;
  corretorId: ID;
  publicadoEm: ISODate;
  ativo: boolean;
}

export interface Corretor {
  id: ID;
  nome: string;
  cargo: string;
  creci: string;
  especialidades: string[];
  bio: string;
  foto: string;
  experienciaAnos: number;
  regiaoIds: ID[];
  diasAtendimento: number[]; // 0 = domingo
  telefone: string;
  ativo: boolean;
}

export interface Cliente {
  id: ID;
  nome: string;
  telefone: string;
  email?: string;
  perfil: "Comprador" | "Locatário" | "Proprietário" | "Investidor";
  criadoEm: ISODateTime;
  ultimaVisita?: ISODate;
  totalVisitas: number;
  origem: "Site" | "WhatsApp" | "Indicação" | "Instagram" | "Portal" | "Assistente";
}

export type StatusVisita = "pendente" | "confirmada" | "realizada" | "cancelada" | "nao_compareceu";

/** Visita agendada a um imóvel (antes: "Agendamento"/"Consulta"). */
export interface Visita {
  id: ID;
  clienteId: ID;
  clienteNome: string;
  clienteTelefone: string;
  imovelId: ID;
  corretorId: ID;
  data: ISODate;
  hora: HHmm;
  duracaoMin: number;
  status: StatusVisita;
  origem: Cliente["origem"];
  observacoes?: string;
  criadoEm: ISODateTime;
}

/** Slot de horário de um corretor numa data. */
export interface Horario {
  corretorId: ID;
  data: ISODate;
  hora: HHmm;
  disponivel: boolean;
}

export type StatusLead = "novo" | "em_atendimento" | "proposta" | "fechado" | "perdido";

/** Interesse enviado pelo formulário do imóvel ou pelo WhatsApp. */
export interface Lead {
  id: ID;
  nome: string;
  telefone: string;
  email?: string;
  mensagem?: string;
  imovelId?: ID;
  origem: Cliente["origem"];
  status: StatusLead;
  criadoEm: ISODateTime;
}

export interface Depoimento {
  id: ID;
  autor: string;
  perfil: "Comprador" | "Vendedor" | "Locatário" | "Proprietário";
  nota: 1 | 2 | 3 | 4 | 5;
  texto: string;
  bairro?: string;
  data: ISODate;
  publicado: boolean;
}

export type PapelUsuario = "admin" | "gerente" | "corretor";

export interface Usuario {
  id: ID;
  nome: string;
  email: string;
  papel: PapelUsuario;
  avatar?: string;
}

export interface Configuracao {
  imobiliariaId: ID;
  aparencia: { corPrimaria: string; logoTexto: string; logoSubtexto: string };
  agenda: {
    duracaoVisitaMin: number;
    intervaloMin: number;
    antecedenciaMinimaHoras: number;
    diasFuturosVisiveis: number;
    abertura: HHmm;
    fechamento: HHmm;
    pausaInicio: HHmm;
    pausaFim: HHmm;
  };
  notificacoes: {
    whatsappConfirmacao: boolean;
    lembrete24h: boolean;
    emailNovoLead: boolean;
  };
  assistente: { ativo: boolean; mensagemBoasVindas: string };
}

/* ----------------------------- Busca ----------------------------- */

export interface FiltrosBusca {
  finalidade?: Finalidade;
  tipo?: TipoImovel;
  local?: string; // regiaoId
  precoMin?: number;
  precoMax?: number;
  quartos?: number; // mínimo
  banheiros?: number; // mínimo
  vagas?: number; // mínimo
  areaMin?: number;
  areaMax?: number;
  condominio?: boolean;
  selo?: SeloImovel;
  ordem?: "recentes" | "menor-preco" | "maior-preco" | "maior-area";
}

/** Payload público de agendamento de visita (sem login). */
export interface SolicitacaoVisita {
  imovelId: ID;
  corretorId: ID;
  data: ISODate;
  hora: HHmm;
  nome: string;
  telefone: string;
}

/** Payload público do formulário de interesse. */
export interface SolicitacaoInteresse {
  imovelId?: ID;
  nome: string;
  telefone: string;
  email?: string;
  mensagem?: string;
}
