export type Snapshot = {
  id: number;
  store: string;
  product_name: string;
  price: number | null;
  currency: string;
  stock_status: string | null;
  stock_status_raw: string | null;
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

export type DashboardData = {
  current: Snapshot[];
  history: Snapshot[];
  lastScrapedAt: string | null;
  batchCount: number;
  dbExists: boolean;
  heals: HealEvent[];
};
