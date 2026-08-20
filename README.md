# Wolverine

Self-healing price and stock tracker for niche electronics / hobby stores.
Bright Data Scraper Studio collectors feed SQLite; a Next.js dashboard reads
the latest batch.

> It doesn't matter how badly the page gets cut up. It heals.

## How Bright Data Scraper Studio is used

This project is built around Scraper Studio collectors, not Bright Data's
pre-built scraper library. The coding agent drives the Bright Data CLI end to
end:

1. `bdata scraper create <listing-url> "<fields>"` builds a custom scraper per
   store and returns a `c_*` Collector ID (pinned in `scrapers/config.js` and
   `AGENTS.md`; never recreate).
2. `bdata scraper run <collector_id> <url>` returns structured JSON. The
   pipeline (`npm run scrape`) parses it and inserts timestamped rows into
   `db/wolverine.db`.
3. When extraction goes empty or clones one price/stock onto every card,
   `npm run heal` calls `bdata scraper heal`, then `approve`, then re-runs that
   same Collector ID so downstream schema and the dashboard stay stable.
4. GitHub Actions cron runs the same scrape + heal loop; optional
   `simulate_failure` proves detection without breaking a live collector.

Example structured output (trimmed from a real run):
[`examples/sample-output.json`](examples/sample-output.json). Heal history:
[`heal-log.md`](heal-log.md).

## AI assistance

Cursor (AI coding assistant) was used to help write pipeline, heal, CI, and
dashboard code. Architecture, target stores, Collector IDs, heal prompts, and
verification were directed and checked by the author.

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
| `SECURITY.md` | How to report issues; secrets and data policy |

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

## Docker

The published image includes a sample SQLite snapshot and `heal-log.md`, so
judges (or anyone) can run the dashboard with no local scrape:

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

Open http://localhost:3000.

Build locally:

```bash
docker compose up --build
```

To show your own scrape instead of the bundled snapshot, mount files over
`/data`:

```bash
docker run --rm -p 3000:3000 \
  -v "%cd%/db/wolverine.db:/data/wolverine.db:ro" \
  -v "%cd%/heal-log.md:/data/heal-log.md:ro" \
  manasdutta04/wolverine-dashboard:latest
```

On macOS/Linux, use `$(pwd)` instead of `%cd%`.

## Releases

Every push to `main` that is not a bot/`ci:`/release commit bumps
`package.json` (patch by default) and publishes a GitHub Release with notes.

- Commit message contains `#minor` or starts with `feat:` → minor bump
- Commit message contains `#major` or `BREAKING CHANGE` → major bump
- Manual: Actions → **release** → Run workflow → pick patch/minor/major

Skip a bump with `[skip release]` in the commit message.

