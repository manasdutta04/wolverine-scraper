import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isStoreReady } from "./config.js";
import { parseBdataOutput } from "./parse.js";

const execFileAsync = promisify(execFile);

function bdataArgs(subargs) {
  return ["--yes", "@brightdata/cli", ...subargs];
}

export async function runBdata(subargs) {
  const { stdout, stderr } = await execFileAsync("npx", bdataArgs(subargs), {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (stderr && stderr.trim()) {
    console.error(stderr.trim());
  }
  return stdout;
}

export async function runStoreScraper(store) {
  if (!isStoreReady(store)) {
    return {
      store: store.id,
      skipped: true,
      reason: "collector_id or target URL not set — waiting for confirmation",
      products: [],
    };
  }

  const stdout = await runBdata([
    "scraper",
    "run",
    store.collectorId,
    store.url,
  ]);

  return {
    store: store.id,
    skipped: false,
    products: parseBdataOutput(stdout, store.id),
  };
}
