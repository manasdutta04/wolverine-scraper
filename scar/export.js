import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openDb, latestSnapshots } from "../pipeline/db.js";
import { stores } from "../scrapers/config.js";
import { checkSnapshots } from "../heal/check.js";
import { trustByStore } from "./gate.js";
import { buildSignals } from "./index.js";
import { loadHealEventsFromFile } from "./heals.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function previousBatch(db, current) {
  const times = db
    .prepare(
      `SELECT DISTINCT scraped_at FROM snapshots ORDER BY scraped_at DESC LIMIT 2`,
    )
    .all()
    .map((r) => r.scraped_at);
  if (times.length < 2) return [];
  const prevAt = times[1];
  return db
    .prepare(
      `SELECT store, product_name, price, currency, stock_status, stock_status_raw, product_url, scraped_at
       FROM snapshots WHERE scraped_at = ?`,
    )
    .all(prevAt);
}

export function buildScarPayload(db) {
  const current = latestSnapshots(db);
  const previous = previousBatch(db, current);
  const results = checkSnapshots(current);
  const trust = trustByStore(results);
  const feed = buildSignals({ current, previous, trust });

  const pulse = stores.map((store) => {
    const rows = current.filter((r) => r.store === store.id);
    const t = trust[store.id] || {
      verdict: "release",
      trust: true,
      reason: "no data",
      n: 0,
    };
    return {
      id: store.id,
      name: store.name,
      collectorId: store.collectorId,
      rows: rows.length,
      verdict: t.verdict,
      trust: t.trust,
      reason: t.reason,
      scrapedAt: rows[0]?.scraped_at ?? null,
    };
  });

  const batches = db
    .prepare(`SELECT COUNT(DISTINCT scraped_at) AS n FROM snapshots`)
    .get();

  return {
    generatedAt: new Date().toISOString(),
    tagline: "Restock radar that will not cry wolf when the scraper is lying.",
    batchCount: batches?.n ?? 0,
    lastScrapedAt: current[0]?.scraped_at ?? null,
    pulse,
    feed: feed.signals,
    suppressed: feed.suppressed,
    clusterCount: feed.clusterCount,
    current,
    heals: loadHealEventsFromFile(path.join(root, "heal-log.md")),
  };
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  const db = openDb();
  try {
    const payload = buildScarPayload(db);
    const outDir = path.join(root, "site", "data");
    fs.mkdirSync(outDir, { recursive: true });
    // Slim export for the static demo (current rows + feed + court + heals).
    const slim = {
      generatedAt: payload.generatedAt,
      tagline: payload.tagline,
      batchCount: payload.batchCount,
      lastScrapedAt: payload.lastScrapedAt,
      pulse: payload.pulse,
      feed: payload.feed,
      suppressed: payload.suppressed,
      clusterCount: payload.clusterCount,
      current: payload.current,
      heals: payload.heals,
    };
    const outPath = path.join(outDir, "scar.json");
    fs.writeFileSync(outPath, JSON.stringify(slim));
    console.log(
      `wrote ${outPath} (${slim.feed.length} signals, ${slim.current.length} rows, ${slim.clusterCount} clusters)`,
    );
  } finally {
    db.close();
  }
}
