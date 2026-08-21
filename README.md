# Wolverine · Scar Feed

Restock radar for niche electronics that will not cry wolf when the scraper is lying.

Bright Data Scraper Studio collectors scrape Adafruit, SparkFun, Pimoroni, and The Pi Hut.
Scar Feed turns those snapshots into plain-English scarcity and restock signals.
Heal Court decides **release / repair / refuse** so a broken scraper cannot invent a restock.

**Live demo:** _add Vercel URL after `npx vercel --prod` (see [docs/DEPLOY.md](docs/DEPLOY.md))_

![Architecture](docs/architecture.svg)

## Try it without cloning

1. **Live demo (Vercel):** see URL above after deploy
2. **Docker:**

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

3. **Demo video:** _add YouTube / Loom link here_

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing |
| `/product` | Overview |
| `/feed` | Scar Feed signals |
| `/court` | Heal Court |
| `/catalog` | Catalog |
| `/case-studies` | Heal journal |
| `/contact` | Links + Star on GitHub |

## How Bright Data Scraper Studio is used

1. `bdata scraper create` built a custom collector per store (IDs pinned below - never recreate).
2. `bdata scraper run` returns structured JSON; `npm run scrape` writes `db/wolverine.db`.
3. Red flags go to **Heal Court**. Repair runs `bdata scraper heal` then `approve`. Refuse rejects a still-cloned preview.
4. GitHub Actions cron scrapes + heals. Optional `simulate_failure` proves detection without changing a live collector.
5. `npm run scar:export` writes `web/public/data/scar.json` for the public demo (no Bright Data key on Vercel).

Example output: [`examples/sample-output.json`](examples/sample-output.json) · Heal journal: [`heal-log.md`](heal-log.md)

```mermaid
flowchart TB
  studio[Scraper Studio collectors] --> pipe[Pipeline SQLite]
  pipe --> feed[Scar Feed signals]
  pipe --> court{Heal Court}
  court -->|repair| heal[bdata heal approve]
  court -->|refuse| quiet[Suppress signals]
  feed --> ui[Next.js on Vercel]
  court --> ui
```

## Collectors (do not recreate)

| Store | Collector | Listing URL |
| --- | --- | --- |
| Adafruit | `c_msyvm0ar1gznj2dlrq` | https://www.adafruit.com/category/105 |
| SparkFun | `c_msywbl7b18fsthmxn` | https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html |
| Pimoroni | `c_msywj65f19rulm4cua` | https://shop.pimoroni.com/collections/raspberry-pi |
| The Pi Hut | `c_msyx5sb61lfwvvvspd` | https://thepihut.com/collections/raspberry-pi |

## Local setup

```bash
git clone https://github.com/manasdutta04/wolverine-scraper.git
cd wolverine-scraper
npm install
cd web && npm install && cd ..

npm run scar:export
npm run web:dev                 # http://localhost:3000
npm test
```

Deploy: [docs/DEPLOY.md](docs/DEPLOY.md)

## Layout

| Path | Role |
| --- | --- |
| `scar/` | Match, diff, Heal Court gate, signal builder, export, tests |
| `scrapers/` | Store registry + `bdata` runner |
| `pipeline/` | Scrape all stores → SQLite |
| `heal/` | Red-flag check + Court-aware heal loop |
| `web/` | Next.js App Router UI (Vercel) |
| `docs/` | Architecture, screenshots, deploy notes |
| `.github/workflows/` | Cron scrape/heal + auto Releases |
| `SECURITY.md` | Secrets and reporting |

## AI assistance

Cursor was used to help write pipeline, Scar Feed, heal, CI, and UI code. Architecture, store choice, Collector IDs, heal prompts, and verification were directed by the author.

## Security

See [`SECURITY.md`](SECURITY.md). Public product data only. Keep `BRIGHTDATA_API_KEY` out of git and recordings.
