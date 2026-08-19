import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { isStoreReady } from "./config.js";
import { parseBdataOutput } from "./parse.js";

function windowsQuote(arg) {
  const text = String(arg);
  if (!/[\s&<>^|()"]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function runNpx(args) {
  return new Promise((resolve, reject) => {
    const child =
      process.platform === "win32"
        ? spawn(
            "cmd.exe",
            ["/d", "/s", "/c", ["npx", ...args].map(windowsQuote).join(" ")],
            { windowsHide: true, env: process.env },
          )
        : spawn("npx", args, { env: process.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || stdout.trim() || `npx exited ${code}`));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function bdataArgs(subargs) {
  return ["--yes", "@brightdata/cli", ...subargs];
}

export async function runBdata(subargs) {
  const { stdout, stderr } = await runNpx(bdataArgs(subargs));
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

  const outFile = path.join(
    os.tmpdir(),
    `wolverine-${store.id}-${Date.now()}.json`,
  );

  try {
    await runBdata([
      "scraper",
      "run",
      store.collectorId,
      store.url,
      "--pretty",
      "--timeout",
      "1200",
      "-o",
      outFile,
    ]);

    const raw = fs.existsSync(outFile)
      ? fs.readFileSync(outFile, "utf8")
      : "";
    return {
      store: store.id,
      skipped: false,
      products: parseBdataOutput(raw, store),
    };
  } finally {
    try {
      fs.unlinkSync(outFile);
    } catch {
      // temp file may not exist if the CLI failed early
    }
  }
}
