import { dominantClone } from "../heal/flags.js";

/**
 * Heal Court: decide release / repair / refuse for a store evaluation + optional heal preview.
 *
 * @param {{ ok: boolean, reasons: string[], n: number }} evaluation
 * @param {{ preview?: unknown[], healError?: string|null }} [opts]
 */
export function courtVerdict(evaluation, opts = {}) {
  const { preview = null, healError = null } = opts;

  if (evaluation.ok) {
    return {
      verdict: "release",
      trust: true,
      reason: "red-flag checks clear",
      action: "none",
    };
  }

  const reasons = evaluation.reasons || [];
  const cloneHint = reasons.some((r) => /share price=|locked onto/i.test(r));
  const emptyHint = reasons.some((r) => /null prices|0 rows/i.test(r));

  if (preview && Array.isArray(preview) && preview.length >= 2) {
    const prices = new Set(
      preview.map((row) => JSON.stringify(row.price ?? row.amount ?? null)),
    );
    const stocks = new Set(
      preview.map((row) => String(row.stock_status ?? "")),
    );
    const previewCloned = prices.size === 1 && stocks.size === 1;
    if (previewCloned) {
      return {
        verdict: "refuse",
        trust: false,
        reason:
          "heal preview still cloned one price/stock onto every row - refusing so we do not teach a bad latch",
        action: "reject",
      };
    }
  }

  if (healError) {
    return {
      verdict: "refuse",
      trust: false,
      reason: `heal failed: ${healError}`,
      action: "none",
    };
  }

  if (cloneHint || emptyHint) {
    return {
      verdict: "repair",
      trust: false,
      reason: reasons.join("; "),
      action: "heal_approve",
    };
  }

  return {
    verdict: "repair",
    trust: false,
    reason: reasons.join("; ") || "extraction unhealthy",
    action: "heal_approve",
  };
}

/**
 * Trust map from store evaluations (no preview). Used to suppress Scar Feed noise.
 */
export function trustByStore(results) {
  const map = {};
  for (const { store, evaluation } of results) {
    const id = store.id || store;
    const v = courtVerdict(evaluation);
    map[id] = {
      verdict: v.verdict,
      trust: v.trust,
      reason: v.reason,
      n: evaluation.n,
    };
  }
  return map;
}

export function previewLooksCloned(preview) {
  const rows = Array.isArray(preview) ? preview : [];
  if (rows.length < 2) return false;
  const clone = dominantClone(
    rows.map((row) => ({
      price:
        typeof row.price === "object" && row.price
          ? row.price.value
          : row.price ?? row.amount ?? null,
      stock_status: row.stock_status ?? null,
    })),
  );
  return clone.pct > 0.9;
}
