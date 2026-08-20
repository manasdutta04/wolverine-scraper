import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DashboardData, ScarPayload } from "./types";
import { healLogPath } from "./paths";
import { loadHealEvents } from "./heal-log";

const here = path.dirname(fileURLToPath(import.meta.url));
const scarJsonPath = path.join(here, "..", "data", "scar.json");

function empty(): DashboardData {
  return {
    generatedAt: new Date().toISOString(),
    tagline: "Restock radar that will not cry wolf when the scraper is lying.",
    batchCount: 0,
    lastScrapedAt: null,
    pulse: [],
    feed: [],
    suppressed: [],
    clusterCount: 0,
    current: [],
    history: [],
    heals: loadHealEvents(),
    dbExists: false,
  };
}

export function loadDashboardData(): DashboardData {
  if (!fs.existsSync(scarJsonPath)) {
    return empty();
  }

  const raw = JSON.parse(fs.readFileSync(scarJsonPath, "utf8")) as ScarPayload;
  const heals =
    raw.heals?.length > 0 ? raw.heals : loadHealEvents();

  return {
    ...raw,
    heals,
    history: raw.current || [],
    dbExists: true,
  };
}

export function scarExportPath() {
  return scarJsonPath;
}

export function healLogExists() {
  return fs.existsSync(healLogPath);
}
