import type { Finalidade, Imovel } from "@/types/entities";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("pt-BR");

export const formatBRL = (v: number) => brl.format(v);
export const formatNumber = (v: number) => num.format(v);

/** "R$ 4.850.000" ou "R$ 7.800/mês" */
export const formatPrice = (p: Pick<Imovel, "preco" | "finalidade">) =>
  p.finalidade === "aluguel" ? `${formatBRL(p.preco)}/mês` : formatBRL(p.preco);

/** Versão curta para chips: "R$ 4,85 mi", "R$ 780 mil" */
export const formatPriceShort = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} mi`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return formatBRL(v);
};

export const finalidadeLabel: Record<Finalidade, string> = { venda: "Venda", aluguel: "Aluguel" };

export const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;
