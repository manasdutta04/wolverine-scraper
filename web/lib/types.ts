export type Snapshot = {
  id?: number;
  store: string;
  product_name: string;
  price: number | null;
  currency: string;
  stock_status: string | null;
  stock_status_raw?: string | null;
  product_url: string | null;
  scraped_at: string;
};

export type HealEvent = {
  at: string;
  title: string;
  store: string | null;
  collectorId: string | null;
  whatBroke: string | null;
  outcome: string | null;
  simulated: boolean;
};

export type ScarSignal = {
  type: string;
  store: string;
  product_name: string;
  text: string;
  trust: boolean;
  verdict: string;
  price?: number;
  currency?: string;
  members?: Snapshot[];
};

export type StorePulse = {
  id: string;
  name: string;
  collectorId: string;
  rows: number;
  verdict: string;
  trust: boolean;
  reason: string;
  scrapedAt: string | null;
};

export type ScarPayload = {
  generatedAt: string;
  tagline: string;
  batchCount: number;
  lastScrapedAt: string | null;
  pulse: StorePulse[];
  feed: ScarSignal[];
  suppressed: ScarSignal[];
  clusterCount: number;
  current: Snapshot[];
  heals: HealEvent[];
};

export type DashboardData = ScarPayload & {
  dbExists: boolean;
  history: Snapshot[];
};
