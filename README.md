# Wolverine

Self-healing price and stock tracker for niche electronics / hobby stores.
Bright Data Scraper Studio collectors feed SQLite; a Next.js dashboard reads
the latest batch.

> It doesn't matter how badly the page gets cut up — it heals.

## Layout

| Path | Role |
| --- | --- |
| `scrapers/` | Store registry + `bdata scraper run` wrapper |
| `pipeline/` | Run all stores → parse → insert into SQLite |
| `heal/` | Red-flag empty/cloned price or stock, then heal + approve |
| `db/schema.sql` | `snapshots` table. Live file is gitignored `db/wolverine.db` |
| `web/` | Next.js dashboard (current table + history chart + heal log) |
| `.github/workflows/scrape.yml` | Cron every 6h + optional simulated red-flag dispatch |
| `heal-log.md` | Heal events, including failed attempts and labeled simulations |

## Setup

```bash
git clone https://github.com/manasdutta04/wolverine-scraper.git
cd wolverine-scraper
npm install
cd web && npm install && cd ..
```

Set `BRIGHTDATA_API_KEY` in the environment (or a local `.env` that is **not**
committed). GitHub Actions uses the same name as a repository secret.

```bash
npx --yes @brightdata/cli login --api-key "$BRIGHTDATA_API_KEY"
npm run scrape          # four collectors → db/wolverine.db
npm run check           # red-flag report, no heal
npm run heal            # red-flag; if broken: heal → approve → re-run that store
npm run web:dev         # dashboard at http://localhost:3000
```

Do not commit `.env`, API keys, or `*.db` / `*.sqlite`. Mask tokens in any
terminal recording.

## Collectors (do not recreate)

Pinned after `bdata scraper create`. Reuse these IDs.

| Store | Collector | Listing URL |
| --- | --- | --- |
| Adafruit | `c_msyvm0ar1gznj2dlrq` | https://www.adafruit.com/category/105 |
| SparkFun | `c_msywbl7b18fsthmxn` | https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html |
| Pimoroni | `c_msywj65f19rulm4cua` | https://shop.pimoroni.com/collections/raspberry-pi |
| The Pi Hut | `c_msyx5sb61lfwvvvspd` | https://thepihut.com/collections/raspberry-pi |

IDs also live in `scrapers/config.js` and `AGENTS.md`.

## Heal loop

After a scrape, `heal/check.js` flags:

- zero rows
- more than 20% null prices
- cloned price+stock across most rows (same value on ≥90% of a batch of ≥10)

On `--fix` (`npm run heal`): one `bdata scraper heal` per failing store, then
`approve --auto-save`, then re-run that collector. Every attempt is appended to
`heal-log.md`.

**Simulated detection (does not scrape live collectors):**

```bash
npm run heal -- --simulate-failure=sparkfun
```

Writes cloned fixture rows for one store, proves detection + heal *trigger*,
then rejects Studio's proposal if the live extraction is still healthy. Log
entries for this path are labeled **SIMULATED TEST RUN (not a real site failure)**.

## CI

`.github/workflows/scrape.yml` runs on a 6-hour cron and on `workflow_dispatch`.

- Blank / scheduled: `npm run scrape` then `npm run heal`.
- Dispatch input `simulate_failure` (store id, e.g. `sparkfun`): skips the real
  scrape and runs the fixture path above.

The job uploads `db/wolverine.db` + `heal-log.md` as an artifact and commits
`heal-log.md` when it changed. Runs: https://github.com/manasdutta04/wolverine-scraper/actions

## Dashboard

`npm run web:dev` reads `db/wolverine.db` (latest batch per store) and
`heal-log.md`. Filter by store, search products, pin a row for the price chart.
Until a second scrape batch exists, the chart states that there is one snapshot
so far.
