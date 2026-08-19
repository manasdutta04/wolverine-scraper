function firstString(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return null;
}

export function normalizeCurrency(raw, fallback = "USD") {
  if (raw == null) return fallback;
  if (typeof raw === "object") {
    return normalizeCurrency(raw.currency ?? raw.symbol ?? raw.code, fallback);
  }
  const text = String(raw).trim();
  if (!text) return fallback;
  const pounds = (text.match(/£/g) || []).length;
  if (pounds > 0 || /^gbp$/i.test(text)) return "GBP";
  if (/\$/.test(text) || /^usd$/i.test(text)) return "USD";
  if (/€/.test(text) || /^eur$/i.test(text)) return "EUR";
  return fallback;
}

export function parsePrice(raw) {
  if (raw == null || raw === "") return null;
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw === "object") {
    const value = raw.value ?? raw.amount ?? raw.price;
    return parsePrice(value);
  }
  const n = Number.parseFloat(String(raw).replace(/,/g, "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function currencyFromRecord(record, fallback = "USD") {
  const fromPrice =
    record?.price && typeof record.price === "object"
      ? record.price.currency ?? record.price.symbol
      : null;
  return normalizeCurrency(
    firstString(record, ["currency", "currency_code"]) ?? fromPrice,
    fallback,
  );
}

export function normalizeProduct(record, store) {
  const storeId = typeof store === "string" ? store : store.id;
  const fallbackCurrency =
    typeof store === "string" ? "USD" : store.currency || "USD";

  return {
    store: storeId,
    product_name: firstString(record, [
      "product_name",
      "name",
      "title",
      "product",
    ]),
    price: parsePrice(record?.price ?? record?.amount ?? record?.cost),
    currency: currencyFromRecord(record, fallbackCurrency),
    stock_status: firstString(record, [
      "stock_status",
      "stock",
      "availability",
      "in_stock",
    ]),
    product_url: firstString(record, [
      "product_page_url",
      "product_url",
      "url",
      "link",
      "href",
    ]),
  };
}

function extractJsonRecords(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.data)) return parsed.data;
    if (parsed && typeof parsed === "object") return [parsed];
  } catch {
    const start = trimmed.search(/[\[{]/);
    if (start >= 0) {
      try {
        const parsed = JSON.parse(trimmed.slice(start));
        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed?.data)) return parsed.data;
        if (parsed && typeof parsed === "object") return [parsed];
      } catch {
        // fall through to JSONL
      }
    }
    const records = [];
    for (const line of trimmed.split(/\r?\n/)) {
      const row = line.trim();
      if (!row) continue;
      try {
        records.push(JSON.parse(row));
      } catch {
        // ignore CLI chatter
      }
    }
    return records;
  }
  return [];
}

export function parseBdataOutput(stdout, store) {
  return extractJsonRecords(stdout)
    .filter((record) => record && typeof record === "object" && !Array.isArray(record))
    .map((record) => normalizeProduct(record, store));
}

export function isMissingField(value) {
  if (value == null) return true;
  const text = String(value).trim().toLowerCase();
  return text === "" || text === "null" || text === "undefined" || text === "n/a";
}

export function findBrokenProducts(products) {
  return products.filter(
    (product) =>
      product.price == null || isMissingField(product.stock_status),
  );
}

export function summarizeProducts(products) {
  return {
    rows: products.length,
    nullPrice: products.filter((product) => product.price == null).length,
    missingName: products.filter((product) => isMissingField(product.product_name))
      .length,
    unknownStock: products.filter(
      (product) => String(product.stock_status || "").toLowerCase() === "unknown",
    ).length,
  };
}
