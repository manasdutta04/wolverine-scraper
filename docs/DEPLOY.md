# Deploy

## Live demo (GitHub Pages)

https://manasdutta04.github.io/wolverine-scraper/

Built from `web/` as a static export (`output: "export"`). Workflow: `.github/workflows/pages.yml`.
Re-export snapshot before release: `npm run scar:export`

## Docker Hub (works offline)

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

## Vercel (optional alternate host)

1. `npx vercel login`
2. Link the project with **Root Directory = `web`**
3. Deploy:

```bash
npx vercel deploy --prod --cwd web
```

`web/data/scar.json` is committed so the demo runs without Bright Data credentials.
If you prefer Vercel as the primary URL, put that `https://….vercel.app` link at the top of `README.md`.
