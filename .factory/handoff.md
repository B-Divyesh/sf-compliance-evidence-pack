# Deadline Packet — polish 2 handoff

## Outcome

Release repair complete. F-2-1 is fixed: at 390 × 844, the landing facts end
at 751.19, 781.98, and 837.58 px, so privacy, offline, and US$12 price facts
all appear in the cold first screen. No recorded finding remains open.

## Delivered

- Made the compact-phone hero content-led and tightened its mobile spacing
  without changing the product’s night-market desk visual identity.
- Added a 390 × 844 regression assertion for all three first-screen facts.
- Updated the catalog description to a verb-first, 77-character sentence.
- Deployed commit `8d07e107745ede130a57c820f0380f34af9ea06f` through Static Web Apps:
  deployment `9cf85005-0fdb-45b7-a0c8-6cf215fc6159`.

## Verification

- Clean clone `/tmp/compliance-evidence-pack-clean-fCC8A8`: `npm ci` passed;
  every 22 exact claim command from `.factory/claims.json` passed separately.
- `CI=1 npm test` passed (TypeScript, 7 Vitest/policy tests, 30 Chromium tests).
- `npm run build` passed and produced `dist/`: JS 54.32 kB raw / 19.76 kB gzip;
  CSS 26.08 kB raw / 6.44 kB gzip; hero WebP 95,956 B.
- Live URL verifier passed with zero console errors:
  `qa-artifacts/polish-2-live/verify.json`.
- Cold live Playwright/axe checks passed on `/`, `/demo`, `/privacy`, and
  `/terms`; each has one h1 and zero serious/critical issues. The explicit
  unknown route returns HTTP 404. The live link crawl returned 200 for all
  internal links and 303 for the Sociobot checkout endpoint.
- Live mobile Lighthouse: Performance 99, Accessibility 100, FCP 1.5 s,
  LCP 1.9 s, TBT 60 ms, CLS 0. Evidence is
  `qa-artifacts/polish-2-live/lighthouse-live.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh compliance-evidence-pack dist
```

## Known gaps

None.
