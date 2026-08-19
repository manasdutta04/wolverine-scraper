import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function pick(envVal: string | undefined, candidates: string[]) {
  if (envVal) return envVal;
  const found = candidates.find((p) => fs.existsSync(p));
  return found ?? candidates[0];
}

export const dbPath = pick(process.env.WOLVERINE_DB, [
  path.join(repoRoot, "db", "wolverine.db"),
  path.resolve(process.cwd(), "..", "db", "wolverine.db"),
  path.resolve(process.cwd(), "db", "wolverine.db"),
]);

export const healLogPath = pick(process.env.WOLVERINE_HEAL_LOG, [
  path.join(repoRoot, "heal-log.md"),
  path.resolve(process.cwd(), "..", "heal-log.md"),
  path.resolve(process.cwd(), "heal-log.md"),
  "/app/heal-log.md",
]);
