# Independent verification 4 — PASS

Verified on 2026-08-28 against candidate commit
`e7407a99c23de0cc66583dd5fba758b8899257c5` and the deployed static PWA at
<https://compliance-evidence-pack.sociobot.in/>. The checkout redirect was
inspected but no purchase was made. Product source was not modified.

## Verdict

**PASS — release approved.** The live deployment byte-matches the candidate
build and the local-first packet workflow meets the researched brief: it
organizes a filing period's evidence, gaps, and accountant questions, then
exports a ZIP/PDF/JSON handoff without calculating tax or submitting anything.

## Mandatory preflight

### First-read test — pass

A cold, fresh Chromium visit to `/` showed:

- **What it does:** “Prepare evidence for your accountant.”
- **Who it is for:** “For freelancers with cross-border income...”
- **What to do first:** the visible **Try it with sample data** link, with the
  adjacent explanation “The sample opens as a complete working packet.”

One click opens `/demo`, which has the persistent “Demo — sample data, nothing
is saved to your real packets” banner and both **Reset demo** and **Start for
real** controls. The first-read and one-click-demo gates pass.

### Claims contract — pass

`.factory/claims.json` is present with 17 claims. Every listed exact command
was run in the clean installed checkout against the Playwright demo entry
point; each passed 1/1. `npm test` then repeated all claim scenarios as part
of its 24 passing browser tests.

| Claim | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `privacy-local` | Pass |
| `encrypted-storage` | Pass |
| `packet-exports` | Pass |
| `missing-evidence` | Pass |
| `offline-reload` | Pass |
| `free-and-paid` | Pass |
| `account-free` | Pass |
| `file-size-limit` | Pass |
| `tracker-free` | Pass |
| `local-retention` | Pass |
| `license-nonblocking` | Pass |
| `no-tax-calculation` | Pass |
| `no-legal-determination` | Pass |
| `no-document-validation` | Pass |
| `no-return-submission` | Pass |
| `no-ocr` | Pass |

Each claim tag occurs exactly once in the browser suite. The paid claim follows
the Sociobot 303 to hosted Dodo checkout and asserts the authoritative
Deadline Packet US$12 price.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 61 packages installed, 0 vulnerabilities |
| `npm test` | Pass; TypeScript, 5 Vitest tests, 24 serial Chromium tests; exit 0 |
| Lint | No standalone lint script is configured |
| `npm run build` | Pass; `dist/` produced |

The test suite covers the complete normal workflow (create packet, checklist,
custom item, question, attachment, ZIP export), encrypted storage, PDF/JSON
exports and import, local retention/deletion, rapid edit persistence, offline
reload/export, the update prompt, and license capture/restore. It also covers
the boundary and recovery cases required by the brief: exactly 25 MiB accepted
and 25 MiB + 1 byte rejected, invalid/incomplete JSON rejected before storage,
legacy corrupt rows recovered, invalid dates, and whitespace-only packet
names.

Built initial assets are within budget: JavaScript 53,023 B raw / 19,440 B
gzip; CSS 24,346 B raw / 6,164 B gzip; hero WebP 95,956 B.

## Independent live checks

- Desktop and 390 px `/demo` had no console/page errors and no horizontal
  overflow. The demo requested only the product origin during the normal flow.
- Keyboard starts on the visible “Skip to main content” link with a 3 px cyan
  focus outline. The tab sequence reaches navigation, demo, packet, import,
  purchase, and footer controls. Reduced-motion mode had no running
  animations.
- Playwright axe-core WCAG 2 A/AA scans found **zero serious or critical
  findings** on `/`, `/demo`, `/privacy`, and `/terms` at 390 px. The supplied
  `@axe-core/cli` Selenium runner could not locate a system Chrome binary;
  the equivalent axe-core scan was run in the supplied Playwright Chromium.
- Live PWA check: a controlled service worker is active at `/sw.js`; an
  explicit registration update completed; after `context.setOffline(true)`,
  `/demo` reloaded with its sample packet and banner and emitted no errors.
  The worker precaches the shell, uses a versioned cache, `skipWaiting`, and
  `clientsClaim`; the changed-worker regression test confirms the reload toast.
- Live `/`, `/demo`, `/privacy`, `/terms`, manifest, service worker, robots,
  sitemap, and designed `/not-a-route` route responded correctly (the latter
  with HTTP 404). Root/demo/privacy/terms have CSP, HSTS, nosniff,
  Referrer-Policy, and restrictive Permissions-Policy. Hashed JS/CSS are
  `max-age=31536000, immutable`; `/sw.js` is `no-cache`.
- The checkout endpoint returned a 303 to Dodo. A burst of 80 invalid-license
  verification requests at concurrency 20 produced 29 successful invalid
  responses and 51 HTTP 429 responses; the limited responses included
  `Retry-After` values of 0–2 seconds. Rate limiting therefore begins after
  approximately 29 successful requests in this burst.
- No sign-in or product backend exists; Entra, backend health/concurrency, and
  consumer-package checks are not applicable.

## Deployment identity and performance

Fresh local candidate output exactly matches the live content SHA-256 values:

| Asset | SHA-256 |
| --- | --- |
| `assets/index-B39a1BOt.js` | `c4be5d52970bd432e9f1b56b18ff6415ccdf9fc8d7e1671f8412b1b3760e0e3e` |
| `assets/index-DiUKNKyw.css` | `4c6c44c4f694501b026cb11536d57fedfb831a801047bdc293ddf75c4a054a07` |
| `assets/deadline-packet-social.webp` | `eec9cba1391ef22703229760884f9d7d71c06769e18b36274cd95d8af67c18fb` |

The expected deployment cache-buster query differs from the local build
timestamp; the fetched asset bytes are identical.

A fresh Lighthouse 12.7.0 simulated-mobile run using the supplied Chromium
headless shell scored **Performance 100** and **Accessibility 100**: FCP 1.0 s,
LCP 1.1 s, TBT 10 ms, Speed Index 1.0 s, CLS 0. A first full-Chromium attempt
crashed while closing its tab after writing an unstable report; the successful
headless-shell repeat is the recorded result.

## Defects by severity

No P0, P1, P2, or P3 product defects were observed in this verification.

## Reproduce

```sh
npm ci
npm test
npm run build
```

Open `https://compliance-evidence-pack.sociobot.in/demo` in a fresh browser
profile for the isolated sample workflow.
