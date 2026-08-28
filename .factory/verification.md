# Independent verification — FAIL

Verified 2026-08-28 against candidate commit
`7f6d636d76500c6a025c3e49c3896ac48fb12b1c` and
<https://compliance-evidence-pack.sociobot.in/>. This is an independent
verification; no product source code was modified.

## Verdict

**FAIL — do not release.** The two non-negotiable preflight gates failed:

1. `.factory/claims.json` is absent. Therefore there are no declared claim
   tests to execute from a clean clone and no claim-to-test mapping. This is
   expressly release-blocking. `rg` found neither a claims file nor any
   `@claim:` test tag. The live and README copy nevertheless make testable
   claims including "Your documents stay on this device", "No account. No
   upload. Works offline", local encryption, and ZIP/PDF/JSON export.
2. The live cold first screen has no one-click **"Try it with sample data"**
   action. `/demo` and `/?demo=1` both return the ordinary blank landing page;
   neither exposes sample data, a Demo banner, Reset demo, or Start for real.
   There is also no `.factory/demo.md`. This makes the required isolated
   verification sandbox unavailable.

The cold first read was: it appears to help a person prepare invoices,
receipts, gaps, and questions for an accountant, and the offered first click
is **Start your first packet**. The actual headline is "Beat the deadline.
Bring the packet." It does not plainly state the job or name the target
freelancers with cross-border income; the supporting line identifies an
accountant but not the intended user. Thus it also does not meet the
plain-words first-screen contract independently of the missing sample demo.

## Clean local verification

The checkout was clean at the candidate SHA before verification.

| Check | Result | Evidence |
| --- | --- | --- |
| Required claim tests | **Blocked / fail** | `.factory/claims.json` missing; no tests can be enumerated or run. |
| Install | Pass | `npm ci`: 61 packages installed; audit reported 0 vulnerabilities. |
| Type, unit, integration, browser suite | Pass | `npm test`: `tsc --noEmit`, Vitest 2/2, Playwright 6/6 passed. |
| Exact production build | Pass | `npm run build` generated `dist/`. |
| Bundle budgets | Pass | JS 44,460 B raw / 16,848 B gzip; CSS 21,925 B raw / 5,754 B gzip; hero WebP 95,956 B. All are below the specified 200 KB JS, 50 KB CSS, and 300 KB hero budgets. |

I attempted a fresh mobile Lighthouse run with the supplied Playwright
Chromium, but Lighthouse 13.4.1 could not keep that browser tab alive
(`Browser tab has unexpectedly crashed`). No independent Lighthouse score is
therefore claimed in this report. This does not affect the deterministic
bundle measurements above.

## Live deployment and product exercise

The deployment is the candidate, not a stale or divergent build. Fresh local
and live SHA-256 values match exactly:

| Asset | SHA-256 |
| --- | --- |
| `assets/index-D9zwkkCX.js` | `466ac68fe6ed49e38acbf9787d13c8a1c19fd719df0af796c94f51ae917a084b` |
| `assets/index-DnqRx7mF.css` | `0a5eb4d7d7d10e45083f57c5cdb978809099e3ace97614225065113c367c2f1b` |
| `sw.js` | `7295978ed5469862672c5c61bcc8ce5fa21888de84704b42a744c6e754e7213e` |

Passing live checks, performed in fresh browser contexts:

- Created a representative Apr–Jun cross-border packet with accountant,
  checklist items, an open exchange-rate question, and an attachment.
- Exported a ZIP, PDF, and JSON backup. The ZIP contained `README-FIRST.html`,
  `accountant-index.pdf`, `packet-data.json`, and the supplied evidence file;
  the PDF began `%PDF-1.4`; the backup preserved the attachment, four missing
  checklist items, and the question.
- Empty packet name stayed in the dialog and failed native validity. A period
  beginning after its end remained in the dialog and announced “The period
  start must be before the period end.” Invalid JSON import announced a clear
  recovery message. A 25 MiB + 1 B attachment was rejected with the stated
  25 MB limit and was not added.
- After service-worker control, a live packet survived an offline reload. The
  cached shell contained the HTML, JS, CSS, manifest, icons, and hero; the
  reloaded page showed the packet and “Offline — edits still save.”
- Desktop and 390 px mobile had no horizontal overflow (`390/390`). The first
  Tab reached the skip link with a visible `rgb(46, 233, 224) solid 3px`
  outline; Tab reached header, actions, and links; Enter opened the creation
  dialog, which focused Close, and Escape closed it. Reduced-motion media
  produced no active animations.
- Axe serious/critical findings: zero on `/`, `/privacy`, and `/terms`.
  Cold-live console and page-error listeners recorded zero errors.
- Cold landing made only same-origin document, JS, CSS, and hero-image
  requests. Source inspection found no analytics, CDN, or document-upload
  request; the only optional external request is the disclosed Sociobot
  license checkout/verification endpoint.
- The live product-unlock verification endpoint was burst-tested with 50
  concurrent invalid-token requests. 30 returned 200 invalid responses and
  20 returned `429`; the first observed 429 was request index 10 and each
  observed `Retry-After` value was `4` seconds. Rate limiting is present.

Service-worker offline reload was proven. An update event could not be induced
against a single immutable live build; code inspection shows `skipWaiting`,
`clients.claim`, and an `updatefound` toast, but no separate update test is
present. Treat service-worker update behavior as unproven rather than passed.

## Defects

### P0 — release blockers

1. **Required claims contract is missing.** No `.factory/claims.json`, no
   `@claim:` tests, and no way to demonstrate or regression-test the public
   offline, privacy, and export promises. Add the required file, map every
   claim to exactly one observable test, and run each from the demo entry
   point.
2. **Required isolated sample demo is missing.** There is no visible one-click
   sample action, `/demo`/`?demo=1` are ordinary landing routes, no demo
   namespace/banner/reset/exit behavior exists, and `.factory/demo.md` is
   absent. Add a realistic seeded demo that never reads or writes real data.
3. **First-screen plain-words contract fails.** The slogan is not the job in
   the freelancer's words, the target cross-border freelancer is unnamed, and
   the mandatory sample-data action is absent.

### P1 — must fix for acceptance

1. **No Content-Security-Policy response header.** Live responses include
   HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but no CSP. The
   required static-host policy file/configuration is also absent.
2. **Hashed assets are not immutable-cached.** Live JS/CSS return
   `Cache-Control: public, must-revalidate, max-age=30`, not long-lived
   immutable caching required for a static PWA. This unnecessarily weakens
   offline/performance caching behavior.

### P2 — acceptance gaps

1. **Route titles are not route-specific.** `/privacy`, `/terms`, and `/demo`
   all retain `Deadline Packet — accountant-ready evidence, kept local` rather
   than setting their own titles.
2. **No designed 404 route/static-host routing configuration was supplied.**
   The repository lacks the required `staticwebapp.config.json`; `/demo`
   currently serves the SPA fallback rather than a demo route.
3. **PWA update behavior is not independently covered.** Offline reload is
   covered, but no test exercises an update from an old service worker to a
   new shell.
4. **Manifest MIME type is generic.** The live
   `/manifest.webmanifest` response is `application/octet-stream`, not a
   web-manifest content type.

## Re-run

After remediation, start with every command declared by
`.factory/claims.json` from `/?demo=1` (or `/demo`) in a new browser context,
then run:

```sh
npm ci
npm test
npm run build
```

Repeat the live product, offline, response-header, rate-limit, keyboard,
mobile, and axe checks against the newly deployed commit.
