import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const healLogPath = path.join(rootDir, "heal-log.md");

export function appendHealLog(entry) {
  const heading = entry.simulated
    ? `## ${entry.timestamp} - SIMULATED TEST RUN (not a real site failure)`
    : `## ${entry.timestamp}`;
  const lines = [
    "",
    heading,
    `- collector: \`${entry.collectorId}\` (${entry.store})`,
    `- what broke: ${entry.whatBroke}`,
  ];
  if (entry.simulated) {
    lines.push(
      "- **label: SIMULATED TEST RUN** - fixture data only; not a live site failure",
    );
  }
  if (entry.healPrompt) {
    lines.push(`- heal prompt: \`${entry.healPrompt.replace(/`/g, "'")}\``);
  }
  lines.push(`- outcome: ${entry.outcome}`, "");
  fs.appendFileSync(healLogPath, lines.join("\n"), "utf8");
}
