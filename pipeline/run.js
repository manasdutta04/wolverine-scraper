import { storeScrapers } from "../scrapers/index.js";
import { findBrokenProducts } from "../scrapers/parse.js";
import { insertSnapshots, openDb } from "./db.js";

export async function runPipeline() {
  const scrapedAt = new Date().toISOString();
  const results = [];

  for (const scraper of storeScrapers) {
    console.log(`→ ${scraper.id}`);
    const result = await scraper.run();
    results.push(result);

    if (result.skipped) {
      console.log(`  skipped: ${result.reason}`);
      continue;
    }

    console.log(`  ${result.products.length} products`);
  }

  const products = results.flatMap((result) => result.products);
  const db = openDb();
  try {
    if (products.length > 0) {
      insertSnapshots(db, products, scrapedAt);
      console.log(`wrote ${products.length} rows @ ${scrapedAt}`);
    } else {
      console.log("no products to write");
    }
  } finally {
    db.close();
  }

  const broken = findBrokenProducts(products);
  const skipped = results.filter((result) => result.skipped);

  return { scrapedAt, results, products, broken, skipped };
}

const failed = (message) => {
  console.error(message);
  process.exit(1);
};

runPipeline()
  .then(({ broken, products, skipped, results }) => {
    const ran = results.filter((result) => !result.skipped);
    if (ran.length === 0 && skipped.length === results.length) {
      console.log("all stores skipped — confirm target URLs before creating scrapers");
      return;
    }
    if (broken.length > 0) {
      failed(
        `${broken.length}/${products.length} products missing price or stock — run npm run heal`,
      );
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
