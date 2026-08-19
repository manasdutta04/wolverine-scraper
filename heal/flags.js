const NULL_PRICE_RATIO = 0.2;
const CLONE_RATIO = 0.9;
const CLONE_MIN_ROWS = 10;

function cloneKey(row) {
  const price = row.price == null ? "null" : String(row.price);
  const stock = row.stock_status ?? "null";
  return `${price}::${stock}`;
}

export function dominantClone(rows) {
  const counts = new Map();
  for (const row of rows) {
    const key = cloneKey(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let best = { key: null, count: 0, price: null, stock: null };
  for (const [key, count] of counts) {
    if (count > best.count) {
      const [price, stock] = key.split("::");
      best = { key, count, price, stock };
    }
  }
  return {
    ...best,
    pct: rows.length ? best.count / rows.length : 0,
  };
}

export function evaluateStore(storeId, rows) {
  const n = rows.length;
  const reasons = [];

  if (n === 0) {
    return {
      ok: false,
      n,
      nullPrice: 0,
      nullPct: 0,
      reasons: [`${storeId}: 0 rows in this run`],
    };
  }

  const nullPrice = rows.filter((row) => row.price == null).length;
  const nullPct = nullPrice / n;
  if (nullPct > NULL_PRICE_RATIO) {
    reasons.push(
      `${storeId}: ${(nullPct * 100).toFixed(1)}% null prices (${nullPrice}/${n})`,
    );
  }

  if (n >= CLONE_MIN_ROWS) {
    const clone = dominantClone(rows);
    if (clone.pct > CLONE_RATIO) {
      reasons.push(
        `${storeId}: ${(clone.pct * 100).toFixed(1)}% of rows share price=${clone.price} stock=${clone.stock} (${clone.count}/${n}) — extraction looks locked onto one element`,
      );
    }
  }

  return { ok: reasons.length === 0, n, nullPrice, nullPct, reasons };
}

export function healPromptFor(store, evaluation) {
  const joined = evaluation.reasons.join("; ");
  const prompt =
    `${store.name} listing scrape looks broken: ${joined}. ` +
    `Re-extract each product card's own name, numeric price, currency, stock status, and URL. ` +
    `Do not reuse one price/stock node for every row.`;
  return prompt.slice(0, 1000);
}
