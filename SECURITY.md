# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| `main` / latest GitHub Release | Yes |
| Older tags | Best effort only |

Report issues against the latest commit on `main` when possible.

## What this project does (and does not) collect

Wolverine scrapes **public product listing pages** from niche electronics stores
(Adafruit, SparkFun, Pimoroni, The Pi Hut). It stores product name, price,
currency, stock status, and product URL in a local SQLite database.

It does **not**:

- Log in to target sites or bypass paywalls
- Collect personal data, accounts, or private messages
- Scrape government websites
- Use Bright Data's pre-built marketplace scrapers for those targets
- Commit API keys, `.env` files, or live SQLite databases to git

Public pages only. If a target becomes login-walled or otherwise restricted,
stop and change the target.

## Secrets and credentials

| Secret | Where it belongs | Never |
| --- | --- | --- |
| `BRIGHTDATA_API_KEY` | Local env / `.env` (gitignored) / GitHub Actions secrets | In commits, Vercel, client bundles, Docker Hub descriptions, demo recordings, issue text |
| `GITHUB_PAT` (optional) | Vercel env only — `actions:write` to dispatch `wolverine-scrape` | Bright Data access; do not grant more scopes than needed |
| Bright Data session from `bdata login` | Developer machine only | Shared or committed |

CI uses repository secret `BRIGHTDATA_API_KEY`. The public Next.js demo may
use optional `GITHUB_PAT` solely to trigger that workflow; scrapes and heals
still run in Actions. Mask keys in terminal recordings. Prefer a throwaway or
rotated key for demos.

Rotate the key immediately if it appears in a log, screenshot, or public gist.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security-sensitive reports
(credential leaks, auth bypass in the dashboard, unsafe URL handling, etc.).

1. Email the maintainer via the contact listed on the
   [GitHub profile](https://github.com/manasdutta04) for
   [wolverine-scraper](https://github.com/manasdutta04/wolverine-scraper), **or**
   open a private [GitHub Security Advisory](https://github.com/manasdutta04/wolverine-scraper/security/advisories/new)
   if enabled on the repo.
2. Include: affected version/commit, reproduction steps, impact, and any
   suggested fix.
3. Allow a reasonable window for a fix before public disclosure.

We will acknowledge reports and prioritize credential exposure and remote
code paths first.

## Trust boundaries

```
Internet (public storefront HTML)
        │
        ▼
Bright Data Scraper Studio (proxies, run, heal)
        │  BRIGHTDATA_API_KEY  (GitHub Actions / local only)
        ▼
Local / CI Node pipeline  →  SQLite snapshots → scar:export
        │
        ▼
Next.js /app (polls scar.json; optional GITHUB_PAT → workflow_dispatch)
```

- Extraction runs on Bright Data infrastructure, not on arbitrary user-supplied
  scrapers inside this repo.
- The live demo reads committed `web/public/data/scar.json` (and polls it). It
  does **not** call Bright Data from Vercel or the browser.
- Optional `POST /api/field/refresh` only dispatches GitHub Actions when
  `GITHUB_PAT` is configured; without it, judges use the Actions UI.
- The published Docker image may bundle a **sample** SQLite snapshot of public
  product fields for demo. Treat it as sample data, not a live credential store.
- Self-heal (`bdata scraper heal`) can rewrite Studio extraction logic for a
  pinned `c_*` Collector ID. Production CI approves only after red-flag checks;
  simulated failures reject Studio proposals so live collectors stay unchanged.

## Operational guidance

- Keep `BRIGHTDATA_API_KEY` out of client-side Next.js bundles and Vercel env.
- Optional `GITHUB_PAT` on Vercel is for Actions dispatch only; never reuse a
  token that can read Bright Data or other unrelated secrets.
- Do not mount production secrets into publicly shared containers.
- Prefer least-privilege tokens and rotate after the hackathon / demo window.
- Review `heal-log.md` and Actions logs for accidental key leakage before
  sharing screen recordings.
- Dependencies: run `npm audit` in the repo root and under `web/` when updating.

## Scope notes

This is a hackathon / research-style tracker. The dashboard is not a hardened
multi-tenant SaaS. Do not expose it to the open internet without your own
auth, TLS, and network controls.
