/** Canonical stock labels for dashboard/alerts. */
export const STOCK_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  BACKORDER: "backorder",
  DISCONTINUED: "discontinued",
  UNKNOWN: "unknown",
};

/**
 * Map store-specific stock copy to the canonical set.
 * Order matters: "out of stock" must beat "in stock".
 */
export function normalizeStockStatus(raw) {
  if (raw == null) return STOCK_STATUS.UNKNOWN;
  const text = String(raw).trim();
  if (!text) return STOCK_STATUS.UNKNOWN;

  const s = text.toLowerCase();

  if (/\bdiscontinu/.test(s)) return STOCK_STATUS.DISCONTINUED;
  if (/\bback\s*order\b|\bpre-?order\b|\bcoming soon\b/.test(s)) {
    return STOCK_STATUS.BACKORDER;
  }
  if (
    /\bout of stock\b|\bsold out\b|\bunavailable\b|\bnotify me\b|\boos\b/.test(s)
  ) {
    return STOCK_STATUS.OUT_OF_STOCK;
  }
  if (
    /\bin stock\b|\bships today\b|\badd to cart\b|\bunits? left\b|\bonly \d+/.test(
      s,
    )
  ) {
    return STOCK_STATUS.IN_STOCK;
  }
  if (/^unknown$/.test(s)) return STOCK_STATUS.UNKNOWN;

  return STOCK_STATUS.UNKNOWN;
}

export function withNormalizedStock(product) {
  const stock_status_raw = product.stock_status ?? product.stock_status_raw ?? null;
  return {
    ...product,
    stock_status_raw,
    stock_status: normalizeStockStatus(stock_status_raw),
  };
}
