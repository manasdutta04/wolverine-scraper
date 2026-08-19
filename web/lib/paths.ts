import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const dbPath = path.join(repoRoot, "db", "wolverine.db");
export const healLogPath = path.join(repoRoot, "heal-log.md");
