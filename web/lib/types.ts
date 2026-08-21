export type Pulse = {
  id: string;
  name: string;
  collectorId: string;
  rows: number;
  verdict: string;
  trust: boolean;
  reason: string;
  scrapedAt: string | null;
};

export type ScarSignal = {
  type: string;
  text: string;
  store: string;
  product_name: string;
  trust: boolean;
  verdict?: string;
};

export type Snapshot = {
  store: string;
  product_name: string;
  price: number | null;
  currency: string;
  stock_status: string | null;
  product_url: string | null;
  scraped_at: string;
};

export type HealEvent = {
  at: string;
  title: string;
  store?: string;
  whatBroke?: string;
  outcome?: string;
  simulated?: boolean;
};

export type ScarPayload = {
  generatedAt: string;
  tagline: string;
  batchCount: number;
  lastScrapedAt: string | null;
  pulse: Pulse[];
  feed: ScarSignal[];
  suppressed: ScarSignal[];
  clusterCount: number;
  current: Snapshot[];
  heals: HealEvent[];
};
