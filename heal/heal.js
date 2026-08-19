import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stores, isStoreReady } from "../scrapers/config.js";
import { findBrokenProducts } from "../scrapers/parse.js";
import { runBdata } from "../scrapers/run-bdata.js";
import { latestSnapshots, openDb } from "../pipeline/db.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const healLogPath = path.join(rootDir, "heal-log.md");

function appendHealLog(entry) {
  const block = [
    "",
    `## ${entry.timestamp}`,
    `- collector: \`${entry.collectorId}\` (${entry.store})`,
    `- what broke: ${entry.whatBroke}`,
    `- outcome: ${entry.outcome}`,
    "",
  ].join("\n");
  fs.appendFileSync(healLogPath, block, "utf8");
}

function describeBreakage(products) {
  const missingPrice = products.filter((p) => p.price == null).length;
  const missingStock = products.filter((p) => !p.stock_status).length;
  return `${products.length} products with empty fields (${missingPrice} price, ${missingStock} stock)`;
}

export async function healLastRun() {
  const db = openDb();
  let latest;
  try {
    latest = latestSnapshots(db);
  } finally {
    db.close();
  }

  const brokenByStore = new Map();
  for (const store of stores) {
    const rows = latest.filter((row) => row.store === store.id);
    const broken = findBrokenProducts(rows);
    if (broken.length > 0) {
      brokenByStore.set(store.id, { store, broken });
    }
  }

  if (brokenByStore.size === 0) {
    if (latest.length === 0) {
      console.log("no snapshots yet - nothing to heal");
    } else {
      console.log("last run looks healthy - no empty price/stock fields");
    }
    return { healed: [], skipped: [] };
  }

  const healed = [];
  const skipped = [];

  for (const { store, broken } of brokenByStore.values()) {
    const whatBroke = describeBreakage(broken);
    const timestamp = new Date().toISOString();

    if (!isStoreReady(store)) {
      const outcome = "skipped - collector_id or URL not set";
      appendHealLog({
        timestamp,
        collectorId: store.collectorId,
        store: store.id,
        whatBroke,
        outcome,
      });
      skipped.push(store.id);
      console.log(`${store.id}: ${outcome}`);
      continue;
    }

    try {
      console.log(`healing ${store.id} (${store.collectorId})`);
      await runBdata([
        "scraper",
        "heal",
        store.collectorId,
        `Last run returned ${whatBroke}. Re-extract product name, price, stock status, and product URL from the listing cards.`,
      ]);
      await runBdata(["scraper", "approve", store.collectorId]);
      const outcome = "heal + approve completed; re-run scraper to confirm";
      appendHealLog({
        timestamp,
        collectorId: store.collectorId,
        store: store.id,
        whatBroke,
        outcome,
      });
      healed.push(store.id);
      console.log(`${store.id}: ${outcome}`);
    } catch (err) {
      const outcome = `heal failed: ${err.message}`;
      appendHealLog({
        timestamp,
        collectorId: store.collectorId,
        store: store.id,
        whatBroke,
        outcome,
      });
      console.error(`${store.id}: ${outcome}`);
      throw err;
    }
  }

  return { healed, skipped };
}

healLastRun().catch((err) => {
  console.error(err);
  process.exit(1);
});
