/**
 * Normalize product titles so the same board can match across stores.
 */
export function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(official|the|for|with|and|a|an)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tokens useful for cross-store identity (drop tiny noise). */
export function nameTokens(name) {
  return normalizeName(name)
    .split(" ")
    .filter((t) => t.length > 1 && !/^\d+$/.test(t));
}

export function tokenOverlap(a, b) {
  const sa = new Set(nameTokens(a));
  const sb = new Set(nameTokens(b));
  if (sa.size === 0 || sb.size === 0) return 0;
  let hit = 0;
  for (const t of sa) if (sb.has(t)) hit += 1;
  return hit / Math.max(sa.size, sb.size);
}

function stockNorm(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();
}

export function isInStock(status) {
  const s = stockNorm(status);
  if (!s || s === "unknown") return false;
  if (s.includes("out of stock") || s === "sold out" || s === "discontinued") {
    return false;
  }
  if (s === "backorder" || s.includes("backorder")) return false;
  if (
    s === "in stock" ||
    s === "in_stock" ||
    s.includes("ships today") ||
    s.includes("only ") ||
    s.includes("left")
  ) {
    return true;
  }
  return false;
}

export function isOut(status) {
  const s = stockNorm(status);
  if (!s) return false;
  return (
    s.includes("out of stock") ||
    s === "sold out" ||
    s === "discontinued" ||
    s === "backorder" ||
    s.includes("backorder")
  );
}
