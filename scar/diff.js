import { isInStock, isOut, normalizeName } from "./normalize.js";

/**
 * Index rows by store + normalized name for batch comparison.
 */
export function indexByProduct(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = `${row.store}::${normalizeName(row.product_name)}`;
    map.set(key, row);
  }
  return map;
}

/**
 * Diff previous batch vs current batch for the same store+product keys.
 * @returns {Array<{type:string, store:string, product_name:string, before:object|null, after:object|null, text:string}>}
 */
export function diffBatches(previousRows, currentRows) {
  const prev = indexByProduct(previousRows || []);
  const curr = indexByProduct(currentRows || []);
  const events = [];

  for (const [key, after] of curr) {
    const before = prev.get(key);
    if (!before) continue;

    const wasIn = isInStock(before.stock_status);
    const nowIn = isInStock(after.stock_status);
    const wasOut = isOut(before.stock_status);
    const nowOut = isOut(after.stock_status);

    if (wasOut && nowIn) {
      events.push({
        type: "restock",
        store: after.store,
        product_name: after.product_name,
        before,
        after,
        text: `${after.product_name} back in stock at ${after.store}`,
      });
    } else if (wasIn && nowOut) {
      events.push({
        type: "oos",
        store: after.store,
        product_name: after.product_name,
        before,
        after,
        text: `${after.product_name} went out of stock at ${after.store}`,
      });
    }

    if (
      before.price != null &&
      after.price != null &&
      before.price > 0 &&
      after.price < before.price * 0.95
    ) {
      const pct = Math.round((1 - after.price / before.price) * 100);
      events.push({
        type: "price_cut",
        store: after.store,
        product_name: after.product_name,
        before,
        after,
        text: `${after.store} cut ${after.product_name} by ${pct}%`,
      });
    }
  }

  return events;
}
