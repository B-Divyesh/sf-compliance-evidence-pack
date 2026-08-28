# Independent verification 2 — FAIL

Verified 2026-08-28 against candidate commit
`5d7b310d9599bf6616ce78d520f30bf4a303ebf9` and
<https://compliance-evidence-pack.sociobot.in/>. The checkout was followed only
far enough to inspect the order; no purchase was made. No product code was
modified.

## Verdict

**FAIL — do not release.** The live hosted checkout contradicts the advertised
price, rapid normal edits can be lost, and the claims inventory is incomplete.
There are also accessibility and performance acceptance failures. This result
comes from fresh evidence; the earlier deployment record is not proof.

## Mandatory preflight

### First-read test — pass

Opened the live root in a fresh Chromium context with no stored state.

- What it does: turns a filing period's invoices, receipts, gaps, and questions
  into an accountant-ready packet.
- Who it is for: freelancers with cross-border income.
- What to click first: **Try it with sample data**. The adjacent sentence says
  the sample opens as a complete working packet.

The action is visible on the first desktop and 390 px screens and opens the
seeded `/demo` workspace in one click. Evidence:
[desktop](./qa-artifacts/live-first-read-desktop.png) and
[390 px](./qa-artifacts/live-first-read-mobile-390.png).

### Declared claim commands — all commands pass

`.factory/claims.json` exists. Each of its seven IDs occurs in exactly one
`@claim:<id>` Playwright test. I ran every listed command separately after
`npm ci` and before the broader suite.

| Claim ID | Exact command result |
| --- | --- |
| `demo-isolation` | Pass, 1/1 |
| `privacy-local` | Pass, 1/1 |
| `encrypted-storage` | Pass, 1/1 |
| `packet-exports` | Pass, 1/1 |
| `missing-evidence` | Pass, 1/1 |
| `offline-reload` | Pass, 1/1 |
| `free-and-paid` | Pass, 1/1 |

The claims acceptance contract still fails. The `free-and-paid` test checks
only the page's `US$19` copy and checkout URL, then mocks verification. It does
not inspect the hosted checkout price. Fresh navigation through that link shows
**Deadline Packet — $12.00**, including a $12.00 subtotal and total, while the
landing page, terms, README, and claim promise **US$19 once**. The listed claim
is false in the actual purchase flow. Evidence:
[hosted checkout](./qa-artifacts/live-checkout-price-mismatch.png).

The public copy also contains claim-like statements without their own claim
entries/tests. Examples include **No account**, the quantitative **Up to 25 MB
per file**, **We do not run analytics or advertising trackers**, the stated
retention/deletion behavior, and the promise that license verification never
blocks the free experience. The 25 MiB behavior has an untagged browser test,
but it is still absent from the required claims inventory.

## Release-blocking defects

### P0 — advertised purchase price does not match checkout

The product repeatedly promises a US$19 one-time license. The real buy link
returned 303 to a live Dodo checkout whose order summary, subtotal, and total
were all $12.00. This is a material commerce mismatch and disproves the
`free-and-paid` claim despite its passing test.

Reproduce: open the live root, select **Buy lifetime access**, and read the
hosted order summary before entering personal data. Two fresh sessions showed
`Deadline Packet`, `$12.00`, one-time unlock; the product promises `US$19 once`.

### P0 — rapid edits can disappear after they appear saved

In eight fresh live demo contexts, I added a question and immediately attached
a file, waited for the file to appear, then reloaded. The new question was gone
in 2/8 runs. In one of those runs the just-displayed file was also gone after
reload. The initial broader flow independently hit the same missing-question
failure.

This is core local-first data loss under ordinary, quick interaction. A paced
flow that waited for each render completed successfully, which explains why
the serial happy-path tests pass.

Reproduce from fresh `/demo` contexts: enter and add a question, immediately
attach a small file, wait for the file name, reload, and inspect both records.
Repeat. Overlapping async saves/renders can restore stale packet state.

### P0 — claim inventory is incomplete

The unlisted public promises named above are not covered by
`.factory/claims.json`. The attached claims contract defines an unlisted claim
as failing. The hosted price mismatch also proves the current paid claim test
does not assert the promised observable outcome.

## Other defects

### P1 — 200% text scaling loses headline content

At 390 CSS px, the headline's rendered right edge is already 395.2 px and is
clipped by the hero's hidden overflow. With root text scaled to 200%, its right
edge becomes 613.7 px while the document remains 390 px wide, so much of the
job headline is hidden rather than reflowed.

### P1 — several mobile touch targets are below 44 px

Measured live at 390 px:

- **Import a JSON backup:** 36 px high.
- **Buy lifetime access:** 40 px high.
- **Verify and restore license:** 42 px high.
- **Reset demo:** 36 px high.
- **Start for real:** 40 px high.
- Footer Privacy/Terms links: 15 px high.

### P1 — SPA route focus is not moved or announced reliably

After keyboard-activating the header Privacy link, focus remained on the header
link rather than moving to the new heading/main. After browser Back, focus was
on `BODY`. There is no route announcement.

The rest of the keyboard smoke test passed: first Tab reached the skip link
with a 3 px cyan outline, Enter opened the creation dialog, Close received
focus, Escape closed it, and focus returned to the trigger.

### P1 — removing a question is immediate and irreversible

Selecting **Remove question** deleted the question with zero confirmation
dialogs and no undo. File, checklist, and packet deletion have confirmation;
question deletion does not.

### P1 — mobile performance does not pass consistently

Two fresh Lighthouse 12.8.2 simulated-mobile runs scored:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | **86** | 100 | 100 | 100 | 1.5 s | 540 ms | 0 |
| 2 | 92 | 100 | 100 | 100 | 1.5 s | 340 ms | 0 |

The first run misses the required 90 score, and both exceed 200 ms total
blocking time. Lighthouse reports about 94 KiB of avoidable image transfer:
the 95,956-byte hero is fetched with high priority though the phone layout
hides it. Raw reports: [run 1](./qa-artifacts/lighthouse-live.json) and
[run 2](./qa-artifacts/lighthouse-live-repeat.json).

### P2 — unknown routes are soft 404s

`/definitely-missing-qa-route` returns HTTP 200 with the SPA shell, then renders
the designed not-found page in JavaScript. The visual state is good, but the
HTTP response is not a real 404.

## Clean repository verification

The checkout was clean at the requested SHA before QA. `npm ci` installed 61
packages and reported zero vulnerabilities.

| Check | Result |
| --- | --- |
| Type check | Pass via `tsc --noEmit` in `npm test` |
| Lint | No separate lint script is configured |
| Vitest | Pass, 3/3 |
| Playwright | Pass, 12/12 |
| Full gate | Pass: `npm test` |
| Exact production build | Pass: `npm run build`; `dist/` produced |

Build sizes are within budget: JavaScript 48,891 B raw / 18.30 kB gzip; CSS
23,540 B raw / 6.05 kB gzip; hero WebP 95,956 B; no downloaded fonts.

This is a static PWA, not a library or CLI, so consumer testing is not
applicable. It has no product backend or sign-in, so backend health/concurrency
and Entra authority checks are not applicable.

## Live functional evidence

Passing fresh live checks:

- The sample opens with one Apr–Jun packet, seven checklist groups, four gaps,
  two files, two questions, an accountant, and history.
- In a paced flow, a checklist edit, question, and attachment survived reload.
  The gap count changed from four to three.
- Known attachment plaintext was absent from the IndexedDB record and the
  record had `encrypted: true`.
- ZIP contained the HTML index, PDF, packet JSON, and all three evidence files.
  The PDF began `%PDF-1.4`; JSON contained three files and the new question.
- The JSON backup imported into the real namespace with two files and four
  gaps; the demo banner was absent.
- Invalid JSON produced a recovery message. Empty name triggered required
  validation. A reversed period stayed editable and announced the correction.
  An 80-character name and exact 25 MiB file were accepted; 25 MiB + 1 byte was
  rejected and not listed.
- Cold root and the complete demo flow made same-origin requests only. No
  console/page errors occurred. Source and request inspection found no
  analytics, CDN scripts, or automatic document upload.
- All crawled product links returned 200; the buy link returned the expected
  redirect, though the destination price is wrong.

Visual evidence: [desktop demo](./qa-artifacts/live-demo-desktop.png) and
[390 px demo](./qa-artifacts/live-demo-mobile-390.png).

## Accessibility and responsive evidence

- Axe serious/critical: zero on live `/`, `/demo`, `/privacy`, and `/terms` at
  390 px.
- `prefers-reduced-motion: reduce` left zero running animations.
- The demo workbench had no horizontal document overflow at 390 px.
- Semantic title, `lang=en`, one `h1`, `main`, labels, image alt, and
  route-specific titles passed.
- Text scaling, touch targets, route focus, and destructive action remain
  acceptance failures that axe does not detect.

## PWA, policies, deployment identity, and API

- Live offline reload passed after service-worker control. The demo remained
  available, accepted a checklist edit, exported a ZIP, and showed **Offline —
  edits still save**. Cache observed: `deadline-packet-v2`.
- The repository's production-worker update test passed: v2 took control,
  removed v1, and exposed the reload notice.
- Manifest MIME, 192/512 icons, standalone display, colors, scope, and versioned
  start URL passed.
- Root has CSP, HSTS, referrer, nosniff, and permissions policies. Hashed JS is
  immutable for one year; `sw.js` is `no-cache`.
- Live and local SHA-256 values match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `881004c42cabaad1e0fb01f4c914fbfcbdddca17b7171f31b53e4b88236efb8c` |
| `assets/index-C1JtUNRV.js` | `1c47ecef5b22bcc70868513c7c417b64c6bf5035b2d73570dbbedb0bd8ee016f` |
| `assets/index-BjFPVpUn.css` | `00dd646d7b8fee1214ae52c9fe4368ed0971e50bca05e559aa564f6d140077ab` |
| `sw.js` | `c19370ce1a1c7b9430acf4ec0584af7738d734131d40377dcf11aec4bc615780` |

The deployed static artifact matches the candidate build.

The Sociobot verification endpoint was tested with 50 rapid sequential invalid
tokens. Requests 1–30 returned 200 with `valid:false`; request 31 was the first
429. Requests 31–50 returned 429 and every 429 included `Retry-After: 4`.

## Required remediation and re-run

1. Make hosted and public prices identical; make the claim test inspect the
   actual hosted order or an authoritative billing response.
2. Remove the overlapping save/render race and add a rapid-action reload test.
3. Inventory every public promise with one observable demo test, or remove it.
4. Reflow at 390 px and 200% text, enlarge touch targets, repair route focus and
   announcements, and confirm or undo question deletion.
5. Stop fetching the hidden mobile hero and stabilize Lighthouse at 90+.

Then rerun every claim command, `npm test`, `npm run build`, both Lighthouse
runs, and the complete live checkout and rapid-save flows.
