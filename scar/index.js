import { clusterProducts, cheapestInStock } from "./match.js";
import { diffBatches } from "./diff.js";
import { isInStock, isOut } from "./normalize.js";

/**
 * Build Scar Feed signals from current (+ optional previous) snapshot rows.
 *
 * @param {object} opts
 * @param {Array} opts.current
 * @param {Array} [opts.previous]
 * @param {Record<string, {trust:boolean, verdict:string, reason:string}>} [opts.trust]
 */
export function buildSignals({ current, previous = [], trust = {} }) {
  const signals = [];
  const suppressed = [];

  const batchEvents = diffBatches(previous, current);
  for (const ev of batchEvents) {
    const t = trust[ev.store];
    if (t && !t.trust) {
      suppressed.push({
        type: "suppressed",
        store: ev.store,
        product_name: ev.product_name,
        text: `Signal suppressed (${ev.type}): ${ev.store} failed Heal Court (${t.verdict})`,
        trust: false,
        verdict: t.verdict,
      });
      continue;
    }
    signals.push({
      ...ev,
      trust: true,
      verdict: t?.verdict || "release",
    });
  }

  const clusters = clusterProducts(current);
  for (const cluster of clusters.slice(0, 80)) {
    const inStores = cluster.members.filter((m) => isInStock(m.stock_status));
    const outStores = cluster.members.filter((m) => isOut(m.stock_status));

    if (inStores.length >= 1 && outStores.length >= 1) {
      const untrusted = [...inStores, ...outStores].filter(
        (m) => trust[m.store] && !trust[m.store].trust,
      );
      if (untrusted.length) {
        suppressed.push({
          type: "suppressed",
          store: untrusted[0].store,
          product_name: cluster.label,
          text: `Scarcity signal suppressed for "${cluster.label}" - untrusted store data`,
          trust: false,
          verdict: trust[untrusted[0].store]?.verdict || "refuse",
        });
      } else {
        const inNames = [...new Set(inStores.map((m) => m.store))].join(", ");
        const outNames = [...new Set(outStores.map((m) => m.store))].join(", ");
        signals.push({
          type: "scarcity",
          store: inStores[0].store,
          product_name: cluster.label,
          text: `${cluster.label}: in stock at ${inNames}; out at ${outNames}`,
          trust: true,
          verdict: "release",
          members: cluster.members,
        });
      }
    }

    const cheap = cheapestInStock(cluster);
    if (cheap && inStores.length >= 2) {
      const allTrusted = inStores.every(
        (m) => !trust[m.store] || trust[m.store].trust,
      );
      if (allTrusted) {
        signals.push({
          type: "cheapest",
          store: cheap.store,
          product_name: cluster.label,
          text: `Cheapest in-stock "${cluster.label}" at ${cheap.store} (${cheap.currency || ""} ${cheap.price})`,
          trust: true,
          verdict: "release",
          price: cheap.price,
          currency: cheap.currency,
          members: cluster.members,
        });
      }
    }
  }

  // Prefer actionable types first, cap for UI.
  const order = { restock: 0, scarcity: 1, price_cut: 2, cheapest: 3, oos: 4 };
  signals.sort(
    (a, b) => (order[a.type] ?? 9) - (order[b.type] ?? 9) || a.text.localeCompare(b.text),
  );

  return {
    signals: signals.slice(0, 60),
    suppressed: suppressed.slice(0, 20),
    clusterCount: clusters.length,
  };
}
