CREATE TABLE IF NOT EXISTS snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price REAL,
  currency TEXT DEFAULT 'USD',
  stock_status TEXT,
  product_url TEXT,
  scraped_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_snapshots_store_time
  ON snapshots (store, scraped_at);

CREATE INDEX IF NOT EXISTS idx_snapshots_product
  ON snapshots (store, product_name, scraped_at);
