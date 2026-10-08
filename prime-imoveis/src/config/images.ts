/**
 * ============================================================
 *  BANCO DE IMAGENS DO TENANT
 * ============================================================
 * Fotos TEMPORÁRIAS (Unsplash, licença livre) até chegarem as fotos reais
 * da imobiliária. Para usar as suas:
 *   1. coloque os arquivos em /public/images (ex.: /public/images/hero.jpg)
 *   2. troque a URL correspondente abaixo por "/images/hero.jpg"
 * As fotos são exibidas sempre com object-cover (sem distorção) e com
 * overlay apenas onde há texto por cima. Se uma URL falhar, <SmartImage>
 * mostra um fallback elegante.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  /* ---------- Destaques institucionais ---------- */
  hero: u("photo-1748063578185-3d68121b11ff", 2400), // casa moderna iluminada à noite
  about: u("photo-1757356657991-c3fd6e2e812e", 1800), // casa com piscina ao entardecer
  aboutDetail: u("photo-1758448755952-42b404bc6f39", 1200), // living elegante
  cta: u("photo-1696393800648-662c06289a5e", 2400), // casa iluminada à noite
  office: u("photo-1703355685722-2996b01483be", 1400), // sala de reunião
  cityNight: u("photo-1620996148584-c3c8cf5a0788", 2000),

  /* ---------- Categorias ---------- */
  catApartamentos: u("photo-1624204386084-dd8c05e32226", 1200),
  catCasas: u("photo-1706164971302-e30c0640cc3b", 1200),
  catCoberturas: u("photo-1757924330358-a48d65664dac", 1200),
  catTerrenos: u("photo-1495107334309-fcf20504a5ab", 1200),
  catComerciais: u("photo-1621831337128-35676ca30868", 1200),
  catCondominios: u("photo-1775112077888-8fa36e9bbc51", 1200),

  /* ---------- Regiões ---------- */
  regPinheiros: u("photo-1767103146721-d9940f6fc810", 1200),
  regJardins: u("photo-1545324418-cc1a3fa10c00", 1200),
  regVilaMadalena: u("photo-1775733924258-5363323b3ab8", 1200),
  regButanta: u("photo-1592276040264-e10344a6a10e", 1200),
  regAlphaville: u("photo-1613977257363-707ba9348227", 1200),
  regGranjaViana: u("photo-1564013799919-ab600027ffc6", 1200),
  regOsasco: u("photo-1554168848-228452c09d60", 1200),

  /* ---------- Corretores (troque pelas fotos reais) ---------- */
  brokerCarolina: u("photo-1573496359142-b8d87734a5a2", 900),
  brokerRafael: u("photo-1560250097-0b93528c311a", 900),
  brokerBeatriz: u("photo-1494790108377-be9c29b29330", 900),
} as const;

/** Fotos usadas nas galerias dos imóveis de demonstração. */
export const gallery = {
  // fachadas / externas
  nightHouse1: u("photo-1631739645757-b4208e024dad"),
  nightHouse2: u("photo-1616756405607-590773a1fbf4"),
  nightHouse3: u("photo-1594237926304-3e833086e6ca"),
  poolHouse1: u("photo-1706164971302-e30c0640cc3b"),
  poolHouse2: u("photo-1613977257592-4871e5fcd7c4"),
  poolHouse3: u("photo-1582268611958-ebfd161ef9cf"),
  poolHouse4: u("photo-1613490493576-7fde63acd811"),
  poolHouse5: u("photo-1600596542815-ffad4c1539a9"),
  walkwayHouse: u("photo-1706164971309-fb4785fe6ceb"),
  woodHouse: u("photo-1568605114967-8130f3a36994"),
  duskHouse: u("photo-1657346088167-b982455bf29a"),
  carHouse: u("photo-1790185250629-9188b6e33277"),
  gardenHouse: u("photo-1564013799919-ab600027ffc6"),
  aptBuilding1: u("photo-1624204386084-dd8c05e32226"),
  aptBuilding2: u("photo-1775733924258-5363323b3ab8"),
  aptBuilding3: u("photo-1722293862101-6511f044073b"),
  aptBuilding4: u("photo-1567505477286-9c7269119db7"),
  aptTower: u("photo-1545324418-cc1a3fa10c00"),
  rooftopPool: u("photo-1757924330358-a48d65664dac"),
  officeTower1: u("photo-1621831337128-35676ca30868"),
  officeTower2: u("photo-1602150137620-510810591dff"),
  officeRoom: u("photo-1703355685722-2996b01483be"),
  land1: u("photo-1495107334309-fcf20504a5ab"),
  land2: u("photo-1494187570835-b188e7f0f26e"),
  land3: u("photo-1764719396639-66ea940bb757"),
  condoEntrance: u("photo-1775112077888-8fa36e9bbc51"),

  // salas
  living1: u("photo-1757924461488-ef9ad0670978"),
  living2: u("photo-1758448755952-42b404bc6f39"),
  living3: u("photo-1713832139688-79676097edde"),
  living4: u("photo-1697947656193-a87d460b5fb5"),
  living5: u("photo-1680416124510-5eae1beca412"),
  living6: u("photo-1628592102751-ba83b0314276"),
  living7: u("photo-1565623833408-d77e39b88af6"),
  living8: u("photo-1568115286680-d203e08a8be6"),
  living9: u("photo-1560448204-e02f11c3d0e2"),
  living10: u("photo-1699225741963-5e8e15e40719"),
  living11: u("photo-1633694705199-bc1e0a87c97a"),
  living12: u("photo-1666585607888-3f6fe0b323d8"),
  fireplace: u("photo-1643271529376-fb122b7e36a0"),
  duplexStair: u("photo-1702411200201-3061d0eea802"),

  // cozinhas
  kitchen1: u("photo-1671197244266-73129c97c096"),
  kitchen2: u("photo-1759147960461-b74a7e9a75d4"),
  kitchen3: u("photo-1760072513457-651955c7074d"),
  kitchen4: u("photo-1502005097973-6a7082348e28"),
  kitchen5: u("photo-1725257928373-dc6d2ac7b145"),

  // quartos
  bedroom1: u("photo-1616594039964-ae9021a400a0"),
  bedroom2: u("photo-1617098900591-3f90928e8c54"),
  bedroom3: u("photo-1757344454333-cc666252e596"),
  bedroom4: u("photo-1560185893-a55cbc8c57e8"),
  bedroom5: u("photo-1505693416388-ac5ce068fe85"),
  bedroom6: u("photo-1638454668466-e8dbd5462f20"),

  // banheiros
  bath1: u("photo-1753605788101-04d1e653e74a"),
  bath2: u("photo-1742134131017-44d377a611b1"),
  bath3: u("photo-1733426107854-ee00a25d72a7"),
  bath4: u("photo-1584622650111-993a426fbf0a"),
  bath5: u("photo-1638799869566-b17fa794c4de"),
} as const;
