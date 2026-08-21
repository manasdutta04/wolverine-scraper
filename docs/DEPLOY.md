# Deploy

## Live demo (Vercel) — primary

From the repo root (Root Directory = `web`):

```bash
npx vercel login
npx vercel link --cwd web
npx vercel --prod --cwd web
```

Paste the resulting `https://….vercel.app` URL into `README.md`.

`web/public/data/scar.json` is committed so builds need no Bright Data key.
Re-export before release: `npm run scar:export`

### Import via Vercel dashboard

1. New Project → import `manasdutta04/wolverine-scraper`
2. **Root Directory:** `web`
3. Framework: Next.js (auto)
4. Deploy

## Docker Hub

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

## Local

```bash
npm run web:dev
```
