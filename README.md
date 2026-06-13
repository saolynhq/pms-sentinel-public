# pms-sentinel-public

Static Astro site for PMS Sentinel public device-performance cards (D-5). Renders the card
JSON manifest produced by `pms-sentinel-api` (`POST /cards/build` → R2 `cards/manifest.json`).

## Develop
```bash
npm install
npm run dev          # uses the bundled src/data/manifest.sample.json
```

## Build (production)
Set `MANIFEST_URL` to the manifest's URL (R2 public/custom-domain URL of cards/manifest.json);
the build fetches it and statically renders one page per card.
```bash
MANIFEST_URL="https://<manifest-url>/cards/manifest.json" npm run build
```
Without `MANIFEST_URL` the build falls back to the bundled sample so it always builds.

## Deploy
Cloudflare Pages (D-5): connect this repo, build command `npm run build`, output `dist/`,
set `MANIFEST_URL` as a build env var. Nightly rebuild hook triggers after the api's
`/cards/build` refreshes the manifest.

## Routes
- `/` — card index
- `/cards/<brand-slug>` — per-device card (sections per the signed card design)
- `/methodology` — methodology page
