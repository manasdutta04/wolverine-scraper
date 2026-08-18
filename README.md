# Wolverine

Self-healing price and stock tracker for niche electronics stores.
Built on Bright Data Scraper Studio for the Scrape-Verse Hackathon.

> It doesn't matter how badly the page gets cut up — it heals.

## Layout

| Path | Role |
| --- | --- |
| `scrapers/` | One runner per store (`bdata scraper run`) |
| `pipeline/` | Orchestrate stores → parse → SQLite |
| `heal/` | Inspect empty price/stock, then heal + approve |
| `db/` | `schema.sql` + gitignored `wolverine.sqlite` |
| `web/` | Next.js dashboard (current table + history chart) |
| `.github/workflows/cron.yml` | Scheduled scrape; heal on failure |
| `heal-log.md` | Real heal events only |

## Commands

```bash
npm install
npm run scrape
npm run heal
npm run web:dev
```

Target listing URLs are confirmed with a human before any `bdata scraper create`.
Collector IDs are pinned in `scrapers/config.js` and `AGENTS.md`.
