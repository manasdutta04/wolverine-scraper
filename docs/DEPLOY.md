# Deploy

## Live demo

The public site is on Vercel: https://wolverine-scraper.vercel.app/

In-app docs: https://wolverine-scraper.vercel.app/docs

The Vercel project’s **Root Directory** must be `web`. The site does not need a Bright Data key to build. It ships a committed snapshot at `web/public/data/scar.json`. After each scrape/heal, GitHub Actions runs `npm run scar:export` and commits that file (plus `heal-log.md` when it changed) so the demo updates when `main` redeploys.

### Field Console on `/app`

The app polls `/data/scar.json` about every 15 seconds. **Run field scrape** calls an API route that can start the `wolverine-scrape` GitHub Actions workflow. For that button to dispatch from Vercel, set an optional env var **`GITHUB_PAT`** (a token with permission to trigger Actions on this repo). Scrapes still run in Actions with **`BRIGHTDATA_API_KEY`**. Do not put the Bright Data key on Vercel.

If `GITHUB_PAT` is missing, the button still sends people to the workflow’s Run page on GitHub.

### Deploy from the CLI

From the repo root:

```bash
npx vercel login
npx vercel link --cwd web
npx vercel --prod --cwd web
```

### Deploy from the Vercel dashboard

1. New project → import `manasdutta04/wolverine-scraper`
2. Set Root Directory to `web`
3. Framework: Next.js (usually detected)
4. Optional: add `GITHUB_PAT` for one-click scrape dispatch
5. Deploy

## Docker Hub

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

Open `http://localhost:3000`.

## Local web only

See [CONTRIBUTING.md](../CONTRIBUTING.md) for install and `npm run web:dev`.
