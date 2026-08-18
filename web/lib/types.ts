export type Snapshot = {
  id: number;
  store: string;
  product_name: string | null;
  price: string | null;
  stock: string | null;
  url: string | null;
  scraped_at: string;
};

export type DashboardData = {
  current: Snapshot[];
  history: Snapshot[];
  lastScrapedAt: string | null;
  dbExists: boolean;
};
