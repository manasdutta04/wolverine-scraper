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

export type DashboardData = {
  current: Snapshot[];
  history: Snapshot[];
  lastScrapedAt: string | null;
  dbExists: boolean;
};
