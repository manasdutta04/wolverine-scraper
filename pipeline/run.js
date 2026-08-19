import { fileURLToPath } from "node:url";
import path from "node:path";
import { stores } from "../scrapers/config.js";
import { isMissingField, summarizeProducts } from "../scrapers/parse.js";
import { runStoreScraper } from "../scrapers/run-bdata.js";
import { withNormalizedStock } from "../scrapers/stock.js";
import { insertSnapshots, openDb } from "./db.js";

function formatSummary(store, { rows, nullPrice, unknownStock, missingName, error }) {
  const bits = [`${store.name}: ${rows} rows`];
  if (missingName) bits.push(`${missingName} dropped (no name)`);
  if (nullPrice) bits.push(`${nullPrice} null price`);
  if (unknownStock) bits.push(`${unknownStock} unknown stock`);
  if (error) bits.push(`error: ${error}`);
  return bits.join(" | ");
}

function emptySummary(store, error) {
  return {
    store: store.id,
    rows: 0,
    nullPrice: 0,
    unknownStock: 0,
    missingName: 0,
    error,
  };
}

export async function scrapeStore(store, { db, scrapedAt }) {
  process.stdout.write(`→ ${store.name} (${store.collectorId})\n`);

  try {
    const result = await runStoreScraper(store);
    if (result.skipped) {
      const summary = emptySummary(store, result.reason);
      console.log(`  ${formatSummary(store, summary)}`);
      return { rows: [], summary };
    }

    const named = result.products.filter(
      (product) => !isMissingField(product.product_name),
    );
    const rows = named.map(withNormalizedStock);
    if (rows.length > 0) {
      insertSnapshots(db, rows, scrapedAt);
    }

    const stats = summarizeProducts(rows);
    const summary = {
      store: store.id,
      rows: rows.length,
      nullPrice: stats.nullPrice,
      unknownStock: stats.unknownStock,
      missingName: result.products.length - named.length,
      error: null,
    };
    console.log(`  ${formatSummary(store, summary)}`);
    return { rows, summary };
  } catch (err) {
    const summary = emptySummary(store, err.message);
    console.log(`  ${formatSummary(store, summary)}`);
    return { rows: [], summary };
  }
}

export async function runPipeline() {
  const scrapedAt = new Date().toISOString();
  const db = openDb();
  const summaries = [];

  try {
    for (const store of stores) {
      const { summary } = await scrapeStore(store, { db, scrapedAt });
      summaries.push(summary);
    }
  } finally {
    db.close();
  }

  const total = summaries.reduce((sum, row) => sum + row.rows, 0);
  console.log(`wrote ${total} snapshot rows @ ${scrapedAt}`);
  return { scrapedAt, summaries, total };
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  runPipeline().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
