import test from "node:test";
import assert from "node:assert/strict";
import { normalizeName, tokenOverlap, isInStock } from "../scar/normalize.js";
import { clusterProducts, cheapestInStock } from "../scar/match.js";
import { diffBatches } from "../scar/diff.js";
import { courtVerdict } from "../scar/gate.js";
import { buildSignals } from "../scar/index.js";

test("normalizeName collapses store fluff", () => {
  assert.equal(
    normalizeName("Official Raspberry Pi Pico for the Maker"),
    "raspberry pi pico maker",
  );
});

test("tokenOverlap links near-same boards", () => {
  const score = tokenOverlap(
    "Raspberry Pi Pico",
    "Raspberry Pi Pico H (Headers)",
  );
  assert.ok(score >= 0.5);
});

test("clusterProducts finds cross-store scarcity", () => {
  const rows = [
    {
      store: "adafruit",
      product_name: "Raspberry Pi Pico",
      price: 4,
      currency: "USD",
      stock_status: "out_of_stock",
      product_url: "https://a/1",
    },
    {
      store: "thepihut",
      product_name: "Raspberry Pi Pico",
      price: 3.8,
      currency: "GBP",
      stock_status: "in_stock",
      product_url: "https://b/1",
    },
  ];
  const clusters = clusterProducts(rows);
  assert.equal(clusters.length, 1);
  assert.equal(cheapestInStock(clusters[0]).store, "thepihut");
});

test("diffBatches emits restock and price_cut", () => {
  const prev = [
    {
      store: "sparkfun",
      product_name: "Pro Micro",
      price: 20,
      stock_status: "out_of_stock",
    },
  ];
  const curr = [
    {
      store: "sparkfun",
      product_name: "Pro Micro",
      price: 15,
      stock_status: "in_stock",
    },
  ];
  const events = diffBatches(prev, curr);
  assert.ok(events.some((e) => e.type === "restock"));
  assert.ok(events.some((e) => e.type === "price_cut"));
});

test("courtVerdict release when ok", () => {
  const v = courtVerdict({ ok: true, reasons: [], n: 10 });
  assert.equal(v.verdict, "release");
  assert.equal(v.trust, true);
});

test("courtVerdict repair on clone flag", () => {
  const v = courtVerdict({
    ok: false,
    n: 20,
    reasons: ["sparkfun: 100% of rows share price=1 stock=backorder - locked onto"],
  });
  assert.equal(v.verdict, "repair");
  assert.equal(v.action, "heal_approve");
});

test("courtVerdict refuse when heal preview still cloned", () => {
  const v = courtVerdict(
    {
      ok: false,
      n: 20,
      reasons: ["sparkfun: cloned"],
    },
    {
      preview: [
        { price: 10, stock_status: "Backorder" },
        { price: 10, stock_status: "Backorder" },
      ],
    },
  );
  assert.equal(v.verdict, "refuse");
  assert.equal(v.action, "reject");
});

test("buildSignals suppresses when store untrusted", () => {
  const current = [
    {
      store: "adafruit",
      product_name: "Raspberry Pi Pico",
      price: 4,
      currency: "USD",
      stock_status: "out_of_stock",
      product_url: "https://a/1",
    },
    {
      store: "thepihut",
      product_name: "Raspberry Pi Pico",
      price: 3.8,
      currency: "GBP",
      stock_status: "in_stock",
      product_url: "https://b/1",
    },
  ];
  const { signals, suppressed } = buildSignals({
    current,
    previous: [],
    trust: {
      thepihut: { trust: false, verdict: "refuse", reason: "clone" },
    },
  });
  assert.equal(signals.filter((s) => s.type === "scarcity").length, 0);
  assert.ok(suppressed.length >= 1);
  assert.ok(isInStock("in_stock"));
});
