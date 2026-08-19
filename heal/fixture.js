/**
 * Deliberately bad snapshot rows for CI detection tests.
 * Never written to a live Bright Data collector.
 */
export function clonedSparkFunFixture(store, count = 20) {
  const scrapedAt = new Date().toISOString();
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    rows.push({
      store: store.id,
      product_name: `WOLVERINE-FIXTURE clone card ${i + 1}`,
      price: 739.95,
      currency: store.currency || "USD",
      stock_status: "backorder",
      stock_status_raw: "Backorder",
      product_url: `https://www.sparkfun.com/fixture-clone-${i + 1}.html`,
      scraped_at: scrapedAt,
    });
  }
  return rows;
}

export function fixtureRowsFor(store) {
  return clonedSparkFunFixture(store);
}
