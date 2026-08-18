function firstString(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return null;
}

export function normalizeProduct(record, storeId) {
  return {
    store: storeId,
    product_name: firstString(record, [
      "product_name",
      "name",
      "title",
      "product",
    ]),
    price: firstString(record, ["price", "amount", "cost"]),
    stock: firstString(record, [
      "stock",
      "stock_status",
      "availability",
      "in_stock",
    ]),
    url: firstString(record, ["url", "product_url", "link", "href"]),
  };
}

export function parseBdataOutput(stdout, storeId) {
  const text = String(stdout ?? "").trim();
  if (!text) return [];

  const records = [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      records.push(...parsed);
    } else if (Array.isArray(parsed?.data)) {
      records.push(...parsed.data);
    } else if (parsed && typeof parsed === "object") {
      records.push(parsed);
    }
  } catch {
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        records.push(JSON.parse(trimmed));
      } catch {
        // ignore non-JSON chatter from the CLI
      }
    }
  }

  return records
    .filter((record) => record && typeof record === "object")
    .map((record) => normalizeProduct(record, storeId));
}

export function isMissingField(value) {
  if (value == null) return true;
  const text = String(value).trim().toLowerCase();
  return text === "" || text === "null" || text === "undefined" || text === "n/a";
}

export function findBrokenProducts(products) {
  return products.filter(
    (product) => isMissingField(product.price) || isMissingField(product.stock),
  );
}
