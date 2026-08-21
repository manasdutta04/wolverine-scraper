# Deploy

## Live demo (Vercel) — primary

From the repo root (Root Directory = `web`):

```bash
npx vercel login
npx vercel link --cwd web
npx vercel --prod --cwd web
```

Paste the resulting `https://….vercel.app` URL into `README.md` if it changes.
**Current demo:** https://wolverine-scraper.vercel.app/
**In-app docs:** https://wolverine-scraper.vercel.app/docs

`web/public/data/scar.json` is committed so builds need no Bright Data key.
CI (`wolverine-scrape`) runs `npm run scar:export` after scrape/heal and commits
the snapshot + `heal-log.md` when they change — Vercel redeploys from `main`.

### Live Field Console

`/app` polls `/data/scar.json` every 15s. **Run field scrape** hits
`POST /api/field/refresh`, which uses optional Vercel env `GITHUB_PAT`
(fine-grained or classic token with `actions:write` on this repo) to
`workflow_dispatch` scrape.yml. **Never** put `BRIGHTDATA_API_KEY` on Vercel.

Without `GITHUB_PAT`, the UI still deep-links to
[Actions → scrape.yml](https://github.com/manasdutta04/wolverine-scraper/actions/workflows/scrape.yml).

### Import via Vercel dashboard

1. New Project → import `manasdutta04/wolverine-scraper`
2. **Root Directory:** `web`
3. Framework: Next.js (auto)
4. Optional env: `GITHUB_PAT` (dispatch only — not Bright Data)
5. Deploy

## Docker Hub

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

## Local

```bash
npm run web:dev
```
