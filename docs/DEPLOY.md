# Deploy

## Live demo (GitHub Pages)

https://manasdutta04.github.io/wolverine-scraper/

Static site from `site/` (no build step). Workflow: `.github/workflows/pages.yml`.
Re-export snapshot before release: `npm run scar:export`

## Docker Hub

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

## Local static server

```bash
npm run web:dev
```
