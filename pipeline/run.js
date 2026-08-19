import { stores } from "../scrapers/config.js";
import { isMissingField, summarizeProducts } from "../scrapers/parse.js";
import { runStoreScraper } from "../scrapers/run-bdata.js";
import { insertSnapshots, openDb } from "./db.js";

function formatSummary(store, { rows, nullPrice, unknownStock, missingName, error }) {
  const bits = [`${store.name}: ${rows} rows`];
  if (missingName) bits.push(`${missingName} dropped (no name)`);
  if (nullPrice) bits.push(`${nullPrice} null price`);
  if (unknownStock) bits.push(`${unknownStock} unknown stock`);
  if (error) bits.push(`error: ${error}`);
  return bits.join(" | ");
}

export async function runPipeline() {
  const scrapedAt = new Date().toISOString();
  const db = openDb();
  const summaries = [];

  try {
    for (const store of stores) {
      process.stdout.write(`→ ${store.name} (${store.collectorId})\n`);
      let products = [];
      let error = null;

      try {
        const result = await runStoreScraper(store);
        if (result.skipped) {
          const summary = {
            store: store.id,
            rows: 0,
            nullPrice: 0,
            unknownStock: 0,
            missingName: 0,
            error: result.reason,
          };
          summaries.push(summary);
          console.log(`  ${formatSummary(store, summary)}`);
          continue;
        }
        products = result.products;
      } catch (err) {
        error = err.message;
        const summary = {
          store: store.id,
          rows: 0,
          nullPrice: 0,
          unknownStock: 0,
          missingName: 0,
          error,
        };
        summaries.push(summary);
        console.log(`  ${formatSummary(store, summary)}`);
        continue;
      }

      const stats = summarizeProducts(products);
      const insertable = products.filter(
        (product) => !isMissingField(product.product_name),
      );
      if (insertable.length > 0) {
        insertSnapshots(db, insertable, scrapedAt);
      }

      const summary = {
        store: store.id,
        rows: insertable.length,
        nullPrice: stats.nullPrice,
        unknownStock: stats.unknownStock,
        missingName: stats.missingName,
        error: null,
      };
      summaries.push(summary);
      console.log(`  ${formatSummary(store, summary)}`);
    }
  } finally {
    db.close();
  }

  const total = summaries.reduce((sum, row) => sum + row.rows, 0);
  console.log(`wrote ${total} snapshot rows @ ${scrapedAt}`);
  return { scrapedAt, summaries, total };
}

runPipeline().catch((err) => {
  console.error(err);
  process.exit(1);
});
