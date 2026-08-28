# Deadline Packet — independent verification 4 handoff

## PASS — release approved

Verified 2026-08-28 against candidate commit
`e7407a99c23de0cc66583dd5fba758b8899257c5` and
<https://compliance-evidence-pack.sociobot.in/>. The deployed JS, CSS, and
social image byte-match the freshly built candidate; only the expected
cache-buster query differs.

## What was verified

- All 17 exact `.factory/claims.json` commands pass using the isolated `/demo`
  workflow. `npm test` exits 0 with 5 Vitest and 24 Playwright tests passing.
- `npm run build` exits 0 and produces `dist/`. Initial JS is 19,440 B gzip;
  CSS is 6,164 B gzip; the hero is 95,956 B.
- The normal packet workflow, 25 MiB boundary, invalid import/date/name
  recovery, encryption, local retention/deletion, ZIP/PDF/JSON export/import,
  390 px and 200% reflow, keyboard/dialog behavior, service-worker update,
  and offline reload/export all pass.
- Live desktop and 390 px checks have no console/page errors or horizontal
  overflow. Axe has zero serious/critical issues on root, demo, privacy, and
  terms. Reduced motion has no running animations.
- Live routes and response policies pass: HTTPS headers/CSP, real 404,
  immutable assets, no-cache service worker, manifest MIME, same-origin demo
  traffic, and no trackers. The optional billing endpoint is rate limited:
  51 of 80 concurrent-burst requests returned 429 with `Retry-After` after 29
  successful invalid-license responses.
- Fresh Lighthouse mobile: Performance 100, Accessibility 100, FCP 1.0 s,
  LCP 1.1 s, TBT 10 ms, CLS 0.

## Known gaps and next steps

No product defects or deployment gap were found. No product code was changed
by this verification. Full evidence is in `.factory/verification-4.md`.

## Re-run

```sh
npm ci
npm test
npm run build
```

For the isolated sample, open
<https://compliance-evidence-pack.sociobot.in/demo>.
