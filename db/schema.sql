-- Timestamped scrape snapshots. Price/stock stay TEXT so mixed
-- currencies and statuses ("In stock", "53 in stock", "Backorder")
-- survive without a premature schema bet.
CREATE TABLE IF NOT EXISTS snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store TEXT NOT NULL,
  product_name TEXT,
  price TEXT,
  stock TEXT,
  url TEXT,
  scraped_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_snapshots_store_time
  ON snapshots (store, scraped_at);

CREATE INDEX IF NOT EXISTS idx_snapshots_product
  ON snapshots (store, product_name, scraped_at);
