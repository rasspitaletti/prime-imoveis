# Prime Imóveis — site + painel para imobiliária (white-label)

Evolução do projeto anterior (mesma arquitetura, componentes, animações e design system), agora para o **mercado imobiliário**: busca de imóveis, página individual com galeria, agendamento de visitas sem login, formulário de interesse, WhatsApp em todos os pontos de conversão, assistente virtual (demo) e painel administrativo.

Todos os dados são fictícios e ficam atrás de uma camada de serviços pronta para o backend (FastAPI + PostgreSQL).

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
```

Node 18.18+ (recomendado 20 ou 22). Copie `.env.example` para `.env.local` se quiser ajustar URLs.

- Site: `http://localhost:3000`
- Painel: `http://localhost:3000/admin` (modo demonstração, sem login)

## Usando as SUAS fotos

Todas as imagens estão centralizadas em **`src/config/images.ts`** (as atuais são temporárias, do Unsplash).

1. Coloque os arquivos em `public/images/` (ex.: `public/images/hero.jpg`).
2. Troque a URL correspondente: `hero: "/images/hero.jpg"`.

| Chave | Onde aparece |
|---|---|
| `hero` | fundo do Hero da home (foto principal do site) |
| `about`, `aboutDetail` | seção "Mais do que imóveis…" |
| `cta` | chamada final "Seu próximo imóvel pode estar aqui." |
| `cat*` | cards de categorias |
| `reg*` | cards de regiões |
| `broker*` | fotos dos corretores |
| `office`, `cityNight` | topo das páginas Contato e Sobre |

As fotos de cada imóvel ficam no array `imagens` do imóvel em `src/data/properties.ts` (a primeira é a capa). Todas são exibidas com `object-cover` (sem distorção) e recebem overlay apenas onde há texto por cima.

## Páginas

**Público:** Home · `/imoveis` (busca completa) · `/comprar` · `/alugar` · `/lancamentos` · `/imoveis/[slug]` (página do imóvel) · `/agendar-visita` · `/sobre` · `/corretores` · `/contato` · `/assistente`

**Painel:** Dashboard · Agenda · Visitas · Leads · Clientes · Imóveis · Corretores · Configurações

A busca gera URLs compartilháveis, ex.: `/imoveis?finalidade=venda&tipo=Casa&local=reg_alphaville&quartos=3`.

## Estrutura

```
src/
├── app/(site)/…            área pública
├── app/admin/…             painel (client-side, noindex)
├── components/
│   ├── property/           PropertyCard, QuickSearch (Hero), PropertySearch, Gallery, PropertySidebar
│   ├── booking/            BookingFlow (agendamento de visita)
│   ├── home/               Hero, Destaques, Categorias, Sobre/Diferenciais, Oportunidades, Regiões, Depoimentos, CTA
│   ├── layout/ ui/ ai/ admin/
├── config/agency.ts        ← DADOS DA IMOBILIÁRIA (nome, contato, redes, menu, agenda, mensagens de WhatsApp)
├── config/images.ts        ← FOTOS
├── data/                   imóveis, corretores, regiões, depoimentos, operações (mock)
├── services/api.ts         camada única de dados (mock ↔ FastAPI)
├── services/search.ts      filtros da busca + imóveis semelhantes
├── services/availability.ts horários de visita por corretor
└── types/entities.ts       Imobiliaria, Imovel, Corretor, Cliente, Visita, Lead, Regiao, Depoimento…
```

### Equivalências com a versão anterior

Paciente → **Cliente** · Profissional → **Corretor** · Serviço → **Imóvel** · Consulta/Agendamento → **Visita** · Clínica → **Imobiliária** · (novo) **Lead**

## Design system

Mesma estrutura de tokens (`src/app/globals.css`, bloco `@theme`), com nova direção:

- palco escuro com neutros levemente quentes (ink → graphite → carbon)
- acento **latão** `#c9a46c` só na conversão (buscar, agendar, enviar); verde do WhatsApp só nos botões de WhatsApp
- títulos grandes em **Outfit 300** (leve), eyebrows em caixa alta espaçada, corpo em Inter
- 28px em cards e fotos, botões/inputs em pílula, sombras mínimas, overlays sutis para legibilidade

Para outra imobiliária: troque `src/config/agency.ts`, `src/config/images.ts`, os dados em `src/data/` e, se quiser, `--color-accent*`.

## WhatsApp

- Número e mensagens em `src/config/agency.ts`.
- Em cada imóvel, o botão "Tenho interesse" envia: *"Olá, tenho interesse no imóvel [nome] (cód. X). Gostaria de receber mais informações."*

## Backend (próxima etapa)

Defina `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_USE_MOCKS=false` e implemente os endpoints listados no topo de `src/services/api.ts`. Nunca coloque chaves de IA no frontend — o assistente deve chamar `POST /ai/chat` no backend.
