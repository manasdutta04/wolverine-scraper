import fs from "node:fs";

/** Shared heal-log parser for Node scar export (mirrors web/lib/heal-log.ts). */
export function loadHealEventsFromFile(healLogPath) {
  if (!fs.existsSync(healLogPath)) return [];
  const text = fs.readFileSync(healLogPath, "utf8");
  const parts = text.split(/^## /m).slice(1);
  const events = [];

  for (const part of parts) {
    const [headingLine, ...rest] = part.split(/\r?\n/);
    const heading = headingLine?.trim() ?? "";
    const sep = " - ";
    const dash = heading.indexOf(sep);
    const at = dash >= 0 ? heading.slice(0, dash).trim() : "";
    const title = dash >= 0 ? heading.slice(dash + sep.length).trim() : heading;
    const body = rest.join("\n");

    const collectorLine = body.match(/^- collector:\s*(.+)$/im)?.[1]?.trim() ?? null;
    const collectorId = collectorLine?.match(/`(c_[a-z0-9]+)`/i)?.[1] ?? null;
    const store = collectorLine?.match(/\(([^)]+)\)/)?.[1]?.trim() ?? null;

    const field = (name) =>
      body.match(new RegExp(`^- ${name}:\\s*(.+)$`, "im"))?.[1]?.trim() ?? null;

    const simulated =
      /SIMULATED TEST RUN/i.test(heading) ||
      /\*\*label:\s*SIMULATED TEST RUN\*\*/i.test(body) ||
      /not a real site failure/i.test(heading);

    events.push({
      at,
      title,
      store,
      collectorId,
      whatBroke: field("what broke"),
      outcome: field("outcome") ?? field("confirmation"),
      simulated,
    });
  }

  return events.reverse();
}
