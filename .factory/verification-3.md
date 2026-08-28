# Independent verification 3 — FAIL

Verified on 2026-08-28 against candidate commit
`0f544dc35cb5cd055341d45ffc2b51219ac86990` and
<https://compliance-evidence-pack.sociobot.in/>. The checkout was inspected but
no purchase was made. Product source was not modified.

## Verdict

**FAIL — do not release.** Ordinary rapid interaction can discard a question,
and a malformed backup is written before it is rejected, leaving the app
unable to open on every later reload. The required claims contract also still
does not test the authoritative purchase price and omits public safety claims.

## Mandatory preflight

### First-read test — pass

A fresh Chromium profile opened the live root with no saved state.

- What it does: **Prepare evidence for your accountant.**
- Who it is for: freelancers with cross-border income.
- What to click first: **Try it with sample data**; adjacent copy says the
  sample opens as a complete working packet.
- One click opened `/demo` with a persistent sample-data banner, seven
  checklist items, four gaps, two files, and two questions.

Evidence: [desktop first screen](./qa-artifacts/verification-3-first-read-desktop.png)
and [390 px first screen](./qa-artifacts/verification-3-first-read-mobile.png).

### Declared claim commands

As required, all 12 exact commands in `.factory/claims.json` were invoked
before any installation. Each invocation stopped before test discovery because
the clean checkout had no installed `@playwright/test`. After `npm ci`, I ran
every command separately again; all observable claim scenarios passed.

| Claim | Installed-environment result |
| --- | --- |
| `demo-isolation` | Pass, 1/1 |
| `privacy-local` | Pass, 1/1 |
| `encrypted-storage` | Pass, 1/1 |
| `packet-exports` | Pass, 1/1 |
| `missing-evidence` | Pass, 1/1 |
| `offline-reload` | Pass, 1/1 |
| `free-and-paid` | Pass, 1/1 |
| `account-free` | Pass, 1/1 |
| `file-size-limit` | Pass, 1/1 |
| `tracker-free` | Pass, 1/1 |
| `local-retention` | Pass, 1/1 |
| `license-nonblocking` | Pass, 1/1 |

The claim assertions passing does not establish acceptance. The
`free-and-paid` test checks app copy and the checkout URL, but never visits an
authoritative billing response or hosted checkout. It would still pass if the
real price diverged, as the prior candidate demonstrated. The current live
checkout was inspected independently and does show Deadline Packet at $12.00,
with a $12.00 subtotal and total. Evidence:
[hosted checkout](./qa-artifacts/verification-3-live-checkout.png).

Public safety/capability statements also remain outside the claims inventory,
including “does not calculate tax, determine legal requirements, validate
document sufficiency, submit returns, or run OCR.” Under the attached claims
contract, these unlisted claims are a release-blocking inventory gap.

## Release-blocking defects

### P0 — normal rapid edits still discard entered questions

In ten independent fresh live demo contexts, I checked **Business expense
receipts**, immediately entered a question, and activated **Add question**.
The entered question was absent before reload and after reload in **8/10**
runs. There was no warning or recovery path. A control sequence that added a
question and then attached a file survived in **5/5** runs, so the narrow
previous regression is repaired, but the broader rerender race remains.

Every checklist mutation asynchronously rebuilds the workbench. If that
render lands while a user is entering or submitting another form, the live
form is replaced and the draft/action disappears. This violates the core
local-first evidence-preparation job and the requirement that normal rapid
interaction be durable.

Reproduce from fresh `/demo`:

1. Check **Business expense receipts**.
2. Immediately type a unique value in **Question for your accountant**.
3. Activate **Add question**.
4. Wait briefly and reload. The question frequently never appears and is not
   stored.

### P0 — malformed backup import can permanently brick local startup

Importing this parseable but structurally incomplete JSON displays “not a
valid Deadline Packet backup,” yet first persists an invalid packet:

```json
{"version":1,"packet":{"name":"Malformed backup","checklist":[]}}
```

IndexedDB contained the newly generated record after the rejection. On reload,
the product rendered only **Your packet drawer could not open**. **Try again**
loops to the same failure; the UI provides no way to remove the corrupt row or
recover any other local packet. The error also incorrectly blames browser
privacy settings. Evidence:
[persistent fatal state](./qa-artifacts/verification-3-malformed-backup-fatal.png).

The importer must validate the complete backup before any write and commit
packet plus files atomically, or remove partial writes on failure.

### P0 — claims contract remains incomplete

The monetary claim test does not assert the real checkout price, and public
capability-boundary statements are not represented in `.factory/claims.json`.
The attached claims contract defines an unlisted claim or a test that does not
prove its observable promise as a failed review.

## Other defects

### P1 — whitespace-only packet names are accepted

Entering three spaces satisfies native `required`; creation trims the value to
empty and closes the dialog. The result has a blank `<h1>`, a title of
`— Deadline Packet`, and an unnamed drawer item. There is no validation message
or edit-name recovery. Evidence:
[blank packet](./qa-artifacts/verification-3-whitespace-name.png).

### P1 — the workspace loses content at 200% text size

At 390 px with 200% root text, `/demo` is 409 px wide while its viewport is
390 px. Opening **Packet details, history, and deletion** increases the page to
529 px; the unwrappable history timestamps extend off screen. This fails the
required 200% text reflow check. Evidence:
[workspace at 200%](./qa-artifacts/verification-3-demo-200-percent-details.png).

### P1 — undersized text and one undersized mobile target remain

At 390 px, the footer **Terms** target measures 36.72 × 44 px, below the
required 44 × 44 px. Important copy also renders below the design baseline of
16 px: status 11.52 px, eyebrow/folio labels 12.16 px, merchant/refund text and
footer copy 12.48 px, and the first-action explanation 13.76 px. This
contradicts `.factory/design.md` (“Body is never below 16 px”).

### P2 — unknown routes remain soft 404s

`/definitely-missing-verification-3` renders the designed not-found screen and
title but returns HTTP 200, not 404.

### P2 — copy audit is stale

`.factory/copy-audit.md` still records `US$19` twice although the shipped copy
and checkout now use US$12.

## Clean repository verification

The checkout was clean and exactly at the requested commit before QA.

| Check | Result |
| --- | --- |
| Install | Pass: `npm ci`, 61 packages, 0 vulnerabilities |
| Type check | Pass via `tsc --noEmit` in `npm test` |
| Unit/policy tests | Pass, 4/4 |
| Chromium suite | Pass, 20/20 |
| Full gate | Pass: `npm test` |
| Lint | No separate lint command is configured |
| Production build | Pass: `npm run build`; `dist/` produced |

Bundle sizes pass: JavaScript 49,589 B raw / 18.52 kB gzip; CSS 23,642 B raw /
6.06 kB gzip; desktop hero 95,956 B. Mobile uses a zero-transfer placeholder
instead of fetching the hidden hero.

## Passing live evidence

- A paced demo flow changed the gap count from four to three, added a file,
  persisted across reload, and exported online and offline. The new file was
  marked encrypted in IndexedDB and its stored blob did not contain known
  plaintext.
- The ZIP contained `README-FIRST.html`, `accountant-index.pdf`,
  `packet-data.json`, and three evidence files. The packet JSON listed all
  three files.
- The live offline reload retained the sample packet, accepted another
  checklist edit, displayed **Offline — edits still save**, and downloaded a
  ZIP. The repository's production-worker update scenario also passed.
- The complete demo flow made same-origin requests only. Cold root, demo,
  privacy, terms, and not-found routes emitted no console/page errors. No
  analytics or CDN runtime was observed.
- Axe serious/critical findings were zero on `/`, `/demo`, `/privacy`,
  `/terms`, and the designed not-found route at 390 px.
- Keyboard checks passed for the first-tab skip link, visible 3 px cyan focus,
  dialog entry/trap/Escape/return, and route focus plus announcement. Reduced
  motion had no running animations after load.
- Root, demo, privacy, terms, and all internal links returned 200. The checkout
  endpoint returned 303 to Dodo and the hosted page showed the matching US$12
  one-time price.

## Performance and browser policy

Two fresh Lighthouse 12.8.2 simulated-mobile runs produced:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 97 | 100 | 100 | 100 | 1.1 s | 200 ms | 0 |
| 2 | 100 | 100 | 100 | 100 | 1.0 s | 10 ms | 0 |

Raw evidence: [run 1](./qa-artifacts/verification-3-lighthouse-live-1.json) and
[run 2](./qa-artifacts/verification-3-lighthouse-live-2.json). Lighthouse did
not measure INP in these navigation-only runs.

Live responses provide CSP, HSTS, `Referrer-Policy`, nosniff, and a restrictive
permissions policy. Hashed JS/CSS use one-year immutable caching, `sw.js` uses
`no-cache`, and the manifest has `application/manifest+json`. A 50-request
sequential burst to the Sociobot verification endpoint returned 200 invalid
responses for requests 1–30; request 31 was the first 429, and requests 31–50
all included `Retry-After: 4`.

## Deployment identity

The live deployment matches candidate output. Fresh local and live SHA-256
values are identical:

| Artifact | SHA-256 |
| --- | --- |
| `assets/index-DlSdgKEl.js` | `76ee3a3ccaacf04a9fc01c17ba3131c7741b5f1179295a5a5968ceea09959607` |
| `assets/index-D98tSA9x.css` | `a5b937c4a0ee16b0785635128d07248eb2c700973b5da01cdd121ea222d5dcba` |
| `assets/deadline-packet-hero.webp` | `a0194454dbba44f747862c860cb6e122580ceb8e4106dc8b0369a8b357567597` |
| `manifest.webmanifest` | `d82d5fd2c6ecbbfdc3e40c6c930f34979bcb11397dd5cd00e985fabed28c42aa` |

Normalized `index.html` and `sw.js` hashes also match after removing the
expected build-time timestamp from asset queries/cache names. This is a static
PWA with no product backend or sign-in, so consumer-package, backend health,
concurrency, persistence-boundary, and Entra checks are not applicable.

## Required remediation

1. Preserve in-progress form state across every asynchronous dashboard render;
   add a rapid checklist-to-question regression.
2. Fully validate backups before writes and make import atomic; add recovery
   for already-corrupt rows.
3. Make the paid claim test assert an authoritative price and inventory every
   public safety/capability claim.
4. Reject whitespace-only packet names, fix 200% workspace reflow, and meet
   44 px target and 16 px body-copy requirements.
5. Return a real 404 for unknown routes and refresh the copy audit.
