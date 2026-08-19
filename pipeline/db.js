import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const dbDir = path.join(rootDir, "db");
export const dbPath = path.join(dbDir, "wolverine.db");
export const schemaPath = path.join(dbDir, "schema.sql");

export function openDb() {
  fs.mkdirSync(dbDir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(fs.readFileSync(schemaPath, "utf8"));
  return db;
}

export function insertSnapshots(db, products, scrapedAt) {
  const insert = db.prepare(`
    INSERT INTO snapshots (
      store, product_name, price, currency, stock_status, product_url, scraped_at
    )
    VALUES (
      @store, @product_name, @price, @currency, @stock_status, @product_url, @scraped_at
    )
  `);

  const write = db.transaction((rows) => {
    for (const row of rows) {
      insert.run({
        store: row.store,
        product_name: row.product_name,
        price: row.price,
        currency: row.currency,
        stock_status: row.stock_status,
        product_url: row.product_url,
        scraped_at: scrapedAt,
      });
    }
  });

  write(products);
}

export function latestSnapshots(db) {
  return db
    .prepare(
      `
      SELECT s.*
      FROM snapshots s
      INNER JOIN (
        SELECT store, MAX(scraped_at) AS scraped_at
        FROM snapshots
        GROUP BY store
      ) latest
        ON s.store = latest.store
       AND s.scraped_at = latest.scraped_at
      ORDER BY s.store, s.product_name
    `,
    )
    .all();
}

export function countByStore(db, scrapedAt) {
  return db
    .prepare(
      `
      SELECT store, COUNT(*) AS n
      FROM snapshots
      WHERE scraped_at = ?
      GROUP BY store
      ORDER BY store
    `,
    )
    .all(scrapedAt);
}

export function sampleRows(db, scrapedAt, limit = 6) {
  return db
    .prepare(
      `
      SELECT store, product_name, price, currency, stock_status, product_url, scraped_at
      FROM snapshots
      WHERE scraped_at = ?
      ORDER BY store, id
      LIMIT ?
    `,
    )
    .all(scrapedAt, limit);
}
