import { COLLECTORS } from "@/lib/nav";

export const metadata = { title: "Studio" };

const STEPS = [
  "bdata scraper create <url> \"fields\" — custom Studio collector (IDs pinned)",
  "bdata scraper run <collector_id> — structured JSON into SQLite snapshots",
  "heal/check.js — red flags (empty / cloned price or stock)",
  "Heal Court: repair → bdata heal + approve + re-run; refuse → --reject + suppress",
  "npm run scar:export — web/public/data/scar.json powers this app (no API key)",
  "GitHub Actions cron — scrape + heal on a schedule; simulate_failure for demos",
];

export default function AppStudioPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Best Use of Bright Data</p>
        <h1 className="page-title">Scraper Studio</h1>
        <p className="page-lede">
          Four custom collectors for long-tail hobby stores — not the prebuilt
          library. Driven from a coding agent via the Bright Data CLI.
        </p>
      </section>

      <div className="overview-card">
        <h3>Pinned collectors</h3>
        <ul className="collector-list" style={{ marginTop: 0 }}>
          {COLLECTORS.map((c) => (
            <li key={c.id}>
              <div>
                <strong>{c.name}</strong>
                <div className="meta-line" style={{ marginTop: 4 }}>
                  <a href={c.url} target="_blank" rel="noreferrer">
                    listing URL
                  </a>
                </div>
              </div>
              <code>{c.collectorId}</code>
            </li>
          ))}
        </ul>
      </div>

      <div className="overview-card" style={{ marginTop: 14 }}>
        <h3>Pipeline</h3>
        <ol className="studio-steps">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </>
  );
}
