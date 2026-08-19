import fs from "node:fs";
import type { HealEvent } from "./types";
import { healLogPath } from "./paths";

function field(block: string, name: string): string | null {
  const re = new RegExp(`^- ${name}:\\s*(.+)$`, "im");
  const match = block.match(re);
  return match?.[1]?.trim() ?? null;
}

export function loadHealEvents(): HealEvent[] {
  if (!fs.existsSync(healLogPath)) return [];

  const text = fs.readFileSync(healLogPath, "utf8");
  const parts = text.split(/^## /m).slice(1);
  const events: HealEvent[] = [];

  for (const part of parts) {
    const [headingLine, ...rest] = part.split(/\r?\n/);
    const heading = headingLine?.trim() ?? "";
    const sep = " - ";
    const dash = heading.indexOf(sep);
    const at = dash >= 0 ? heading.slice(0, dash).trim() : "";
    const title = dash >= 0 ? heading.slice(dash + sep.length).trim() : heading;
    const body = rest.join("\n");

    const collectorLine = field(body, "collector");
    const collectorId = collectorLine?.match(/`(c_[a-z0-9]+)`/i)?.[1] ?? null;
    const store = collectorLine?.match(/\(([^)]+)\)/)?.[1]?.trim() ?? null;

    const simulated =
      /SIMULATED TEST RUN/i.test(heading) ||
      /\*\*label:\s*SIMULATED TEST RUN\*\*/i.test(body) ||
      /not a real site failure/i.test(heading);

    events.push({
      at,
      title,
      store,
      collectorId,
      whatBroke: field(body, "what broke"),
      outcome: field(body, "outcome") ?? field(body, "confirmation"),
      simulated,
    });
  }

  return events.reverse();
}
