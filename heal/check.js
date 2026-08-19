import { fileURLToPath } from "node:url";
import path from "node:path";
import { stores, getStore, isStoreReady } from "../scrapers/config.js";
import { runBdata, runBdataJson } from "../scrapers/run-bdata.js";
import { latestSnapshots, openDb } from "../pipeline/db.js";
import { scrapeStore } from "../pipeline/run.js";
import { evaluateStore, healPromptFor } from "./flags.js";
import { fixtureRowsFor } from "./fixture.js";
import { appendHealLog } from "./log.js";

function rowsByStore(snapshots) {
  const grouped = new Map();
  for (const store of stores) grouped.set(store.id, []);
  for (const row of snapshots) {
    const list = grouped.get(row.store);
    if (list) list.push(row);
  }
  return grouped;
}

export function checkSnapshots(snapshots) {
  const grouped = rowsByStore(snapshots);
  const results = [];
  for (const store of stores) {
    const evaluation = evaluateStore(store.id, grouped.get(store.id) || []);
    results.push({ store, evaluation });
  }
  return results;
}

function previewLooksCloned(preview) {
  const rows = Array.isArray(preview) ? preview : [];
  if (rows.length < 2) return false;
  const prices = new Set(
    rows.map((row) => JSON.stringify(row.price ?? row.amount ?? null)),
  );
  const stocks = new Set(rows.map((row) => String(row.stock_status ?? "")));
  return prices.size === 1 && stocks.size === 1;
}

async function healStoreSimulated(store, evaluation) {
  const timestamp = new Date().toISOString();
  const prompt = healPromptFor(store, evaluation);
  const whatBroke = `SIMULATED fixture (cloned $739.95 / backorder). Detection: ${evaluation.reasons.join("; ")}`;

  console.log(`SIMULATED TEST: detection fired for ${store.id}`);
  console.log(`  attempting real bdata scraper heal (will reject, not approve)`);

  if (!isStoreReady(store)) {
    appendHealLog({
      timestamp,
      simulated: true,
      collectorId: store.collectorId,
      store: store.id,
      whatBroke,
      healPrompt: prompt,
      outcome:
        "simulated fixture, heal call skipped - collector_id or URL not set",
    });
    return { ok: false };
  }

  try {
    const envelope = await runBdataJson([
      "scraper",
      "heal",
      store.collectorId,
      prompt,
      "--url",
      store.url,
      "--timeout",
      "1500",
    ]);

    const preview = envelope.preview_result || [];
    const cloned = previewLooksCloned(preview);
    let studioNote;

    if (envelope.status === "awaiting_approval") {
      await runBdata([
        "scraper",
        "approve",
        store.collectorId,
        "--reject",
      ]);
      studioNote = cloned
        ? "studio preview also looked cloned; rejected so the live collector is unchanged"
        : "studio confirmed no live extraction issue (preview still had distinct per-card prices); rejected the proposal so the live collector is unchanged";
    } else {
      studioNote = `heal envelope status=${envelope.status || "unknown"}; no approve issued`;
    }

    const outcome = `simulated fixture, heal call attempted, ${studioNote}`;
    console.log(`  ${outcome}`);
    appendHealLog({
      timestamp,
      simulated: true,
      collectorId: store.collectorId,
      store: store.id,
      whatBroke,
      healPrompt: prompt,
      outcome,
    });
    return { ok: true, detection: true, healAttempted: true };
  } catch (err) {
    const outcome = `simulated fixture, heal call attempted, studio/CLI error: ${err.message}`;
    console.log(`  ${outcome}`);
    appendHealLog({
      timestamp,
      simulated: true,
      collectorId: store.collectorId,
      store: store.id,
      whatBroke,
      healPrompt: prompt,
      outcome,
    });
    return { ok: true, detection: true, healAttempted: true, error: err.message };
  }
}

async function healStore(store, evaluation) {
  const timestamp = new Date().toISOString();
  const prompt = healPromptFor(store, evaluation);
  const whatBroke = evaluation.reasons.join("; ");

  if (!isStoreReady(store)) {
    appendHealLog({
      timestamp,
      collectorId: store.collectorId,
      store: store.id,
      whatBroke,
      healPrompt: prompt,
      outcome: "skipped - collector_id or URL not set",
    });
    return { ok: false, skipped: true };
  }

  console.log(`healing ${store.id} (${store.collectorId})`);
  console.log(`  prompt: ${prompt}`);

  try {
    await runBdata([
      "scraper",
      "heal",
      store.collectorId,
      prompt,
      "--url",
      store.url,
      "--timeout",
      "1500",
    ]);
    await runBdata([
      "scraper",
      "approve",
      store.collectorId,
      "--auto-save",
      "--url",
      store.url,
      "--timeout",
      "1500",
    ]);

    const scrapedAt = new Date().toISOString();
    const db = openDb();
    let rerun;
    try {
      rerun = await scrapeStore(store, { db, scrapedAt });
    } finally {
      db.close();
    }

    const recheck = evaluateStore(store.id, rerun.rows);
    if (!recheck.ok) {
      appendHealLog({
        timestamp,
        collectorId: store.collectorId,
        store: store.id,
        whatBroke,
        healPrompt: prompt,
        outcome: `heal + approve + re-run still failing: ${recheck.reasons.join("; ")}`,
      });
      return { ok: false, recheck };
    }

    appendHealLog({
      timestamp,
      collectorId: store.collectorId,
      store: store.id,
      whatBroke,
      healPrompt: prompt,
      outcome: `heal + approve + re-run passed (${rerun.rows.length} rows)`,
    });
    return { ok: true, recheck };
  } catch (err) {
    appendHealLog({
      timestamp,
      collectorId: store.collectorId,
      store: store.id,
      whatBroke,
      healPrompt: prompt,
      outcome: `heal failed: ${err.message}`,
    });
    throw err;
  }
}

async function runSimulatedFailure(storeId, { fix }) {
  const store = getStore(storeId);
  const rows = fixtureRowsFor(store);
  const evaluation = evaluateStore(store.id, rows);

  console.log(`SIMULATED TEST RUN for ${store.name} (${rows.length} cloned fixture rows)`);

  if (evaluation.ok) {
    console.error(
      "SIMULATED TEST FAILED: fixture did not trip red-flag detection - debug heal/flags.js",
    );
    process.exitCode = 1;
    return { ok: false, detection: false };
  }

  console.log(`${store.name}: FAIL - ${evaluation.reasons.join("; ")}`);

  if (!fix) {
    console.error("detection fired; pass --fix to attempt a (rejected) live heal call");
    process.exitCode = 1;
    return { ok: false, detection: true };
  }

  const outcome = await healStoreSimulated(store, evaluation);
  if (!outcome.healAttempted) {
    process.exitCode = 1;
    return outcome;
  }

  console.log(
    "SIMULATED TEST complete: detection fired, heal trigger attempted, live collector not approved",
  );
  return outcome;
}

export async function runCheck({ fix = false, simulateFailure = null } = {}) {
  if (simulateFailure) {
    return runSimulatedFailure(simulateFailure, { fix });
  }

  const db = openDb();
  let latest;
  try {
    latest = latestSnapshots(db);
  } finally {
    db.close();
  }

  const results = checkSnapshots(latest);
  const failing = results.filter((row) => !row.evaluation.ok);

  for (const { store, evaluation } of results) {
    if (evaluation.ok) {
      console.log(`${store.name}: ok (${evaluation.n} rows)`);
    } else {
      console.log(`${store.name}: FAIL - ${evaluation.reasons.join("; ")}`);
    }
  }

  if (failing.length === 0) {
    console.log("all stores passed red-flag checks");
    return { ok: true, results };
  }

  if (!fix) {
    console.error(`${failing.length} store(s) failed checks - re-run with --fix to heal`);
    process.exitCode = 1;
    return { ok: false, results };
  }

  const stillFailing = [];
  for (const { store, evaluation } of failing) {
    const outcome = await healStore(store, evaluation);
    if (!outcome.ok) stillFailing.push(store.id);
  }

  if (stillFailing.length > 0) {
    console.error(
      `heal loop could not recover: ${stillFailing.join(", ")} - failing the job`,
    );
    process.exitCode = 1;
    return { ok: false, stillFailing };
  }

  console.log("heal loop recovered every failing store");
  return { ok: true };
}

function parseSimulateFailure(argv) {
  const flag = argv.find((arg) => arg.startsWith("--simulate-failure"));
  if (!flag) return null;
  if (flag.includes("=")) {
    const value = flag.slice("--simulate-failure=".length).trim();
    return value || null;
  }
  const index = argv.indexOf(flag);
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) return null;
  return value.trim();
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  const fix = process.argv.includes("--fix");
  const simulateFailure = parseSimulateFailure(process.argv);
  runCheck({ fix, simulateFailure }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
