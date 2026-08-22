# Wolverine · Scar Feed

[![Scrape](https://github.com/manasdutta04/wolverine-scraper/actions/workflows/scrape.yml/badge.svg)](https://github.com/manasdutta04/wolverine-scraper/actions/workflows/scrape.yml)
[![Release](https://github.com/manasdutta04/wolverine-scraper/actions/workflows/release.yml/badge.svg)](https://github.com/manasdutta04/wolverine-scraper/actions/workflows/release.yml)
[![Live demo](https://img.shields.io/badge/demo-Vercel-black?logo=vercel)](https://wolverine-scraper.vercel.app/)
[![Demo video](https://img.shields.io/badge/demo-YouTube-red?logo=youtube&logoColor=white)](https://youtu.be/_UDIV9uMk5I)
[![Docker Image](https://img.shields.io/docker/v/manasdutta04/wolverine-dashboard?label=docker&logo=docker&color=2496ED)](https://hub.docker.com/r/manasdutta04/wolverine-dashboard)
[![Docker Pulls](https://img.shields.io/docker/pulls/manasdutta04/wolverine-dashboard?logo=docker)](https://hub.docker.com/r/manasdutta04/wolverine-dashboard)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=nodedotjs)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://wolverine-scraper.vercel.app/)
[![Bright Data](https://img.shields.io/badge/Bright%20Data-Scraper%20Studio-orange)](https://brightdata.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Restock radar for niche electronics that will not cry wolf when the scraper is lying.

**Live demo:** [wolverine-scraper.vercel.app](https://wolverine-scraper.vercel.app/) 

**Demo video:** [Demo video](https://youtu.be/_UDIV9uMk5I)

```mermaid
flowchart TB
  studio[Scraper Studio] --> pipe[SQLite]
  pipe --> feed[Scar Feed]
  pipe --> court{Heal Court}
  court -->|repair| heal[Studio heal]
  court -->|refuse| quiet[Hide signals]
  feed --> app["/app workspace"]
  court --> app
```

[![Architecture diagram](https://img.shields.io/badge/architecture-full%20SVG-lightgrey)](docs/architecture.svg)

## The problem

Hobby electronics shops (Adafruit, SparkFun, Pimoroni, The Pi Hut) change their pages often. A normal scraper breaks, keeps running anyway, and starts showing wrong prices or stock. If you build restock alerts on that, you get false alarms the scraper is lying, and you cry wolf.

## What this app does

Wolverine scrapes those four stores, stores the product data, and turns it into a simple feed of restock / scarcity / deal signals (**Scar Feed**).

Before anything goes out, **Heal Court** checks whether a store’s scrape still looks honest. If it does, the feed speaks. If it does not, that store stays quiet until Bright Data Scraper Studio heals the collector. So a broken scrape cannot invent a “back in stock.”

Open **`/app`** on the live site for the real product: Field Console, Feed, Heal Court, Catalog, heal journal, and Studio. The homepage is the story; `/app` is the working tool.

![Scar Feed app](docs/screenshots/app.png)

## How we use Bright Data Scraper Studio

We use Bright Data’s Scraper Studio — not hand-written CSS selectors, and not their big prebuilt store library. For each shop we pointed Studio at a real category page and asked for product name, price, stock, and URL. That gave us four custom collectors (IDs below). We keep those IDs and reuse them.

On a schedule, GitHub Actions runs the collectors, writes results into SQLite, and runs our heal check. If something looks broken, we ask Studio to heal, approve the fix, and scrape again. We write every heal into [`heal-log.md`](heal-log.md).

The public website never holds the Bright Data key. Actions does the scrape and heal work, then exports a snapshot the demo can read. On `/app`, judges can hit **Run field scrape** to kick that job from the UI.

Sample output: [`examples/sample-output.json`](examples/sample-output.json).

## Collectors (do not recreate)

| Store | Collector | Listing URL |
| --- | --- | --- |
| Adafruit | `c_msyvm0ar1gznj2dlrq` | https://www.adafruit.com/category/105 |
| SparkFun | `c_msywbl7b18fsthmxn` | https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html |
| Pimoroni | `c_msywj65f19rulm4cua` | https://shop.pimoroni.com/collections/raspberry-pi |
| The Pi Hut | `c_msyx5sb61lfwvvvspd` | https://thepihut.com/collections/raspberry-pi |

## More

- Local setup and contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Deploy / Vercel / Docker: [docs/DEPLOY.md](docs/DEPLOY.md)
- Secrets and reporting: [SECURITY.md](SECURITY.md)

Cursor helped with a lot of the code. Store choice, collector IDs, heal prompts, and verification were directed by the author.
