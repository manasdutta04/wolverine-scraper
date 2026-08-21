# Security Policy

## Supported versions

We care about `main` and the latest GitHub Release. Older tags are best-effort only. When you report something, point at a recent commit if you can.

## What we collect

Wolverine only scrapes **public** product listing pages from Adafruit, SparkFun, Pimoroni, and The Pi Hut. We store product name, price, currency, stock status, and product URL in SQLite.

We do **not** log into those shops, pull personal data, scrape government sites, or use Bright Data’s pre-built marketplace scrapers for these targets. We also do not commit API keys, `.env` files, or a live production database.

If a target becomes login-walled or otherwise off-limits, stop and pick a different page.

## Secrets

| Secret | Where it belongs | Never |
| --- | --- | --- |
| `BRIGHTDATA_API_KEY` | Local `.env` (gitignored) and GitHub Actions secrets | Commits, Vercel, the browser, Docker Hub blurbs, demo recordings, issues |
| `GITHUB_PAT` (optional) | Vercel only, enough to start the scrape workflow | Anything that can read Bright Data; do not over-scope the token |
| Bright Data CLI login session | Your machine | Shared or committed |

CI scrapes with `BRIGHTDATA_API_KEY`. The public demo may use `GITHUB_PAT` only to click “run workflow” for you. Mask keys in screen recordings. Prefer a throwaway or rotated key for demos. If a key leaks, rotate it right away.

## Reporting a vulnerability

Please **do not** open a public issue for credential leaks, auth bypass, or similarly sensitive bugs.

1. Email the maintainer via the contact on [GitHub](https://github.com/manasdutta04) for [wolverine-scraper](https://github.com/manasdutta04/wolverine-scraper), **or** open a private [Security Advisory](https://github.com/manasdutta04/wolverine-scraper/security/advisories/new) if the repo allows it.
2. Include the affected commit, how to reproduce, impact, and a suggested fix if you have one.
3. Give a reasonable window for a fix before talking about it in public.

We will acknowledge reports and prioritize credential exposure first.

## Trust boundaries

Bright Data Scraper Studio does the extraction (with the API key only in Actions or on a developer machine). The pipeline writes SQLite and exports `scar.json`. The public Next.js app reads that snapshot and can optionally start a GitHub Action — it never talks to Bright Data directly.

The Docker image may include sample public product rows for demo. Treat that as sample data, not a secret store. Self-heal can change Studio extraction for a pinned collector; CI only approves after red-flag checks, and simulated failures are meant to prove detection without rewriting a live collector.

## Day-to-day habits

- Keep `BRIGHTDATA_API_KEY` out of client bundles and Vercel.
- If you set `GITHUB_PAT` on Vercel, give it only what it needs for Actions.
- Do not bake production secrets into shared containers.
- Skim `heal-log.md` and Actions logs before sharing a recording.
- Run `npm audit` in the repo root and under `web/` when you bump dependencies.

This is a hackathon-style tracker, not a hardened multi-tenant product. Do not expose it widely without your own auth and network controls.
