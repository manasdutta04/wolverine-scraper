# Contributing

Thanks for poking around. This repo is a hackathon project built around Bright Data Scraper Studio — the useful loops are scrape → SQLite → Scar Feed / Heal Court → export for the web app. If you are changing something, keep the four collector IDs in the README pinned; do not recreate scrapers that already exist.

## Local setup

You will need Node 20+. Bright Data CLI login is only required when you actually run scrapes or heals.

```bash
git clone https://github.com/manasdutta04/wolverine-scraper.git
cd wolverine-scraper
npm install
cd web && npm install && cd ..
```

Copy `.env.example` to `.env` if you have one, and put `BRIGHTDATA_API_KEY` there for local CLI work. Never commit `.env`.

To refresh the static snapshot the web app reads, then open the UI:

```bash
npm run scar:export
npm run web:dev
```

The marketing site and `/app` workspace both live under `web/` (Next.js). Open the URL the terminal prints (usually `http://localhost:3000`).

### Useful scripts (repo root)

| Command | What it does |
| --- | --- |
| `npm run scrape` | Run all four Studio collectors and write SQLite |
| `npm run heal` | Red-flag check; heal / approve / re-run when needed |
| `npm run scar:export` | Build `web/public/data/scar.json` from the DB + heal log |
| `npm run web:dev` | Next.js dev server for `web/` |

CI already runs scrape → heal → export on a schedule. See `.github/workflows/scrape.yml`.

## Docker

Same dashboard as the live demo, without needing a Bright Data key on your laptop:

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

Then open `http://localhost:3000`.

## Repo layout

| Path | Role |
| --- | --- |
| `scar/` | Match, diff, Heal Court gate, export, tests |
| `scrapers/` | Store registry + Bright Data CLI runner |
| `pipeline/` | Scrape all stores → SQLite |
| `heal/` | Red-flag check + Court-aware heal loop |
| `web/` | Next.js: marketing `/` + product `/app` |
| `docs/` | Architecture diagram, deploy notes |
| `.github/workflows/` | Cron scrape/heal + releases |

## How to contribute

1. Open an issue if you are unsure — especially before touching collectors or heal prompts.
2. Keep commits small and focused (one working idea per commit is ideal for this project’s history).
3. Do not commit secrets, live `.env` files, or a production SQLite DB.
4. If you change scrape or heal behavior, update `heal-log.md` when you actually ran a heal, and re-export `scar.json` when the public demo should show new data.
5. Prefer explaining *why* in the PR, not only *what* files moved.

Deploy and secret wiring for Vercel / Actions are documented in [docs/DEPLOY.md](docs/DEPLOY.md). Security expectations are in [SECURITY.md](SECURITY.md).
