import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { DashboardData, Snapshot } from "./types";

const dbPath = path.resolve(process.cwd(), "..", "db", "wolverine.sqlite");

export function loadDashboardData(): DashboardData {
  if (!fs.existsSync(dbPath)) {
    return { current: [], history: [], lastScrapedAt: null, dbExists: false };
  }

  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const current = db
      .prepare(
        `
        SELECT s.id, s.store, s.product_name, s.price, s.stock, s.url, s.scraped_at
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
      .all() as Snapshot[];

    const history = db
      .prepare(
        `
        SELECT id, store, product_name, price, stock, url, scraped_at
        FROM snapshots
        ORDER BY scraped_at ASC, id ASC
      `,
      )
      .all() as Snapshot[];

    const last = db
      .prepare(`SELECT MAX(scraped_at) AS scraped_at FROM snapshots`)
      .get() as { scraped_at: string | null };

    return {
      current,
      history,
      lastScrapedAt: last?.scraped_at ?? null,
      dbExists: true,
    };
  } finally {
    db.close();
  }
}
