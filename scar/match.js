import { normalizeName, tokenOverlap, isInStock } from "./normalize.js";

const MIN_OVERLAP = 0.55;

/**
 * Group latest snapshots into cross-store clusters of near-same products.
 * @param {Array<{store:string, product_name:string, price:number|null, currency:string, stock_status:string|null, product_url:string|null}>} rows
 */
export function clusterProducts(rows) {
  const items = rows.map((row, i) => ({
    ...row,
    _i: i,
    _key: normalizeName(row.product_name),
  }));

  const used = new Set();
  const clusters = [];

  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const seed = items[i];
    if (!seed._key || seed._key.length < 6) continue;

    const members = [seed];
    used.add(i);

    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      const other = items[j];
      if (other.store === seed.store) continue;
      const score =
        seed._key === other._key
          ? 1
          : tokenOverlap(seed.product_name, other.product_name);
      if (score >= MIN_OVERLAP) {
        members.push(other);
        used.add(j);
      }
    }

    if (members.length >= 2) {
      const stores = [...new Set(members.map((m) => m.store))];
      if (stores.length >= 2) {
        clusters.push({
          key: seed._key,
          label: seed.product_name,
          members: members.map(({ _i, _key, ...rest }) => rest),
        });
      }
    }
  }

  return clusters;
}

export function cheapestInStock(cluster) {
  const stocked = cluster.members.filter(
    (m) => isInStock(m.stock_status) && m.price != null,
  );
  if (stocked.length === 0) return null;
  return stocked.reduce((best, row) =>
    row.price < best.price ? row : best,
  );
}
