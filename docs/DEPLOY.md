# Deploy

## Live demo (Vercel)

Root Directory: `web`

```bash
cd web
npx vercel login
npx vercel --prod
```

After deploy, put the `https://….vercel.app` URL at the top of `README.md`.

`web/public/data/scar.json` is committed so the demo runs without Bright Data credentials.
Re-export before release: `npm run scar:export`

## Docker Hub

```bash
docker pull manasdutta04/wolverine-dashboard:latest
docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest
```

## Local

```bash
npm run web:dev
```
