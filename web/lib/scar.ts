import fs from "node:fs";
import path from "node:path";
import type { ScarPayload } from "./types";

const empty: ScarPayload = {
  generatedAt: new Date().toISOString(),
  tagline: "Restock radar that will not cry wolf when the scraper is lying.",
  batchCount: 0,
  lastScrapedAt: null,
  pulse: [],
  feed: [],
  suppressed: [],
  clusterCount: 0,
  current: [],
  heals: [],
};

/** Server-only: load committed snapshot for RSC pages. */
export function loadScar(): ScarPayload {
  const candidates = [
    path.join(process.cwd(), "public", "data", "scar.json"),
    path.join(process.cwd(), "data", "scar.json"),
  ];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) return empty;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as ScarPayload;
  } catch {
    return empty;
  }
}
