import { fileURLToPath } from "node:url";
import path from "node:path";
import { stores, isStoreReady } from "../scrapers/config.js";
import { runBdata } from "../scrapers/run-bdata.js";
import { latestSnapshots, openDb } from "../pipeline/db.js";
import { scrapeStore } from "../pipeline/run.js";
import { evaluateStore, healPromptFor } from "./flags.js";
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
      outcome: "skipped — collector_id or URL not set",
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

export async function runCheck({ fix = false } = {}) {
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
      console.log(`${store.name}: FAIL — ${evaluation.reasons.join("; ")}`);
    }
  }

  if (failing.length === 0) {
    console.log("all stores passed red-flag checks");
    return { ok: true, results };
  }

  if (!fix) {
    console.error(`${failing.length} store(s) failed checks — re-run with --fix to heal`);
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
      `heal loop could not recover: ${stillFailing.join(", ")} — failing the job`,
    );
    process.exitCode = 1;
    return { ok: false, stillFailing };
  }

  console.log("heal loop recovered every failing store");
  return { ok: true };
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  const fix = process.argv.includes("--fix");
  runCheck({ fix }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
