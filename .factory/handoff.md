# Deadline Packet — polish 3 handoff

## Outcome

Polish round 3 is complete. Every finding in reviews 1–3 is fixed and mapped
in `.factory/polish-3.md`. The original night-market evidence-desk identity,
static PWA deployment class, local-first packet workflow, and US$12 lifetime
license remain intact.

Live product: <https://compliance-evidence-pack.sociobot.in>

- Repair commit: `270d696e6da8e1e60d5bbdde9ce55724f45d982a`
- Final deployment: `0e9a00ef-39f0-49f5-a260-7d41fd24f490`

## What changed

- Isolated demo licenses in `demo:sb_license:*`; demo activation is canned,
  makes no Sociobot request, and reset/exit remove all demo license state.
- Added the `license-local-storage` claim and expanded demo isolation to cover
  real packet and license state byte-for-byte.
- Standardized **lifetime license** and **evidence gap** across UI, policies,
  README, manifest, offline page, metadata, and generated exports.
- Kept the full offline status visible on phones and fixed singular question
  grammar.
- Replaced metadata jargon, added a real 180 × 180 Apple touch icon, and
  renamed the create dialog to “New packet.”
- Updated claims, demo documentation, copy audit, catalog description, service
  worker precache, and release regression coverage.

## Verification

Run locally:

```sh
npm ci
CI=1 npm test
npm run build
```

Results at the repair commit:

- `npm ci`: 61 packages, zero vulnerabilities.
- Every one of the 23 exact `.factory/claims.json` commands passed separately
  in clean clone `/tmp/compliance-evidence-pack-polish3-final-PF3VyG`.
- `CI=1 npm test`: TypeScript, 9 unit/policy tests, and 31 Chromium tests passed.
- `npm run build`: `dist/` produced; JS 56.15 kB raw / 20.10 kB gzip; CSS
  26.33 kB raw / 6.48 kB gzip.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, correct title, `lang`, one h1,
  main landmark, alt/button labels, and zero console errors.
- Live Playwright/axe sweep: zero serious/critical issues on root, demo,
  privacy, and terms; unknown route returned HTTP 404.
- Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Cold live `/?demo=1`: banner/reset/exit visible; edits survive offline reload;
  full offline label fits at 390 px; demo license reset leaves no license keys;
  zero demo calls to `api.sociobot.in`.
- Live JS and CSS SHA-256 values match the final local `dist/` build and carry
  immutable cache headers.

Evidence:

- `.factory/polish-3.md`
- `.factory/qa-artifacts/polish-3-live/live-report.json`
- `.factory/qa-artifacts/polish-3-live/verify/verify.json`
- `.factory/qa-artifacts/polish-3-live/lighthouse.json`
- `.factory/qa-artifacts/polish-3-live/first-screen-mobile.png`
- `.factory/qa-artifacts/polish-3-live/demo-mobile.png`
- `.factory/qa-artifacts/polish-3-live/demo-desktop.png`
- `.factory/qa-artifacts/polish-3-live/offline-demo-mobile.png`

## Known gaps and next steps

None. No review finding, claim failure, accessibility defect, or deployment
mismatch remains open.
