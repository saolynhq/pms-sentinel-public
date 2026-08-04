# pms-sentinel-public

Static Astro site for PMS Sentinel public device-performance cards (D-5). Renders the card
JSON manifest produced by `pms-sentinel-api` (`POST /cards/build` → R2 `cards/manifest.json`).

> **PRE-LAUNCH — NOT PUBLIC.** PMS Sentinel is not announced. This site must stay
> reachable only by Saolyn admins until launch. See **Access control before launch**
> below before deploying anything from this repo.

## Access control before launch

This is a pure static-asset site: there is no application layer, so it cannot gate
itself. Three controls, in order of what actually stops someone:

1. **Cloudflare Access (Zero Trust) — the real control. Dashboard step, not in this repo.**
   Zero Trust → Access → Applications → Add a self-hosted application covering
   `pms-sentinel.com`, `*.pms-sentinel.com`, and the `*.pages.dev` project alias.
   Policy: *Allow · Emails · ross@saolyn.com.au*. Without this, anyone with the URL
   can read every card, regardless of what the two files below say.
2. **`public/robots.txt`** — `Disallow: /`. Stops well-behaved crawlers only.
3. **`public/_headers`** — `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` on
   every path and every hostname.

Note that per-deployment `<hash>.pages.dev` URLs are permanent public copies of whatever
was built that day. Scrubbing the live site later does not retract them — delete stale
deployments in the Cloudflare dashboard.

At public launch: remove `public/robots.txt`, drop the `X-Robots-Tag` line from
`public/_headers`, remove the Access policy, and delete this section.

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
