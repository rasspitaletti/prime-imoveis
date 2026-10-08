import { properties } from "@/data/properties";
import type { FiltrosBusca, Finalidade, Imovel, SeloImovel, TipoImovel } from "@/types/entities";

/**
 * Filtro de imóveis usado pelos mocks.
 * No backend vira GET /imoveis?finalidade=&tipo=&local=&preco_min=...
 */
export function searchProperties(f: FiltrosBusca, source: Imovel[] = properties): Imovel[] {
  const list = source.filter(
    (p) =>
      p.ativo &&
      (!f.finalidade || p.finalidade === f.finalidade) &&
      (!f.tipo || p.tipo === f.tipo) &&
      (!f.local || p.regiaoId === f.local) &&
      (f.precoMin == null || p.preco >= f.precoMin) &&
      (f.precoMax == null || p.preco <= f.precoMax) &&
      (!f.quartos || p.quartos >= f.quartos) &&
      (!f.banheiros || p.banheiros >= f.banheiros) &&
      (!f.vagas || p.vagas >= f.vagas) &&
      (f.areaMin == null || p.area >= f.areaMin) &&
      (f.areaMax == null || p.area <= f.areaMax) &&
      (!f.condominio || p.emCondominio) &&
      (!f.selo || p.selo === f.selo),
  );
  switch (f.ordem) {
    case "menor-preco":
      return list.sort((a, b) => a.preco - b.preco);
    case "maior-preco":
      return list.sort((a, b) => b.preco - a.preco);
    case "maior-area":
      return list.sort((a, b) => b.area - a.area);
    default:
      return list.sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
  }
}

/* ---------- Conversão filtros <-> query string (URLs compartilháveis) ---------- */

const num = (v?: string | null) => (v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export function filtersFromParams(sp: URLSearchParams | Record<string, string | string[] | undefined>): FiltrosBusca {
  const get = (k: string) => {
    if (sp instanceof URLSearchParams) return sp.get(k) ?? undefined;
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const fin = get("finalidade");
  return {
    finalidade: fin === "venda" || fin === "aluguel" ? (fin as Finalidade) : undefined,
    tipo: (get("tipo") as TipoImovel) || undefined,
    local: get("local") || undefined,
    precoMin: num(get("precoMin")),
    precoMax: num(get("precoMax")),
    quartos: num(get("quartos")),
    banheiros: num(get("banheiros")),
    vagas: num(get("vagas")),
    areaMin: num(get("areaMin")),
    areaMax: num(get("areaMax")),
    condominio: get("condominio") === "1" || undefined,
    selo: (get("selo") as SeloImovel) || undefined,
    ordem: (get("ordem") as FiltrosBusca["ordem"]) || undefined,
  };
}

export function filtersToQuery(f: FiltrosBusca): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || v === "" || v === false) continue;
    q.set(k, v === true ? "1" : String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** Imóveis semelhantes: mesmo tipo/finalidade, priorizando a mesma região e preço próximo. */
export function similarProperties(p: Imovel, limit = 3): Imovel[] {
  return properties
    .filter((x) => x.id !== p.id && x.ativo && x.finalidade === p.finalidade)
    .map((x) => ({
      x,
      score:
        (x.tipo === p.tipo ? 3 : 0) +
        (x.regiaoId === p.regiaoId ? 2 : 0) +
        (1 - Math.min(1, Math.abs(x.preco - p.preco) / p.preco)) * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.x);
}
