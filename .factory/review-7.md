# Prepare evidence for accountant review — review 7

Reviewed on 6 September 2026 against the live product at
<https://compliance-evidence-pack.sociobot.in>.

- Implementation candidate: `758ecb0b55b77186eeb8cc1f1b0ea6634bab4d55`
- Documentation base: `c3058a0ba76526345260740d135c3a9f3d06f749`
- The product files under `src/`, `public/`, and `index.html` do not differ
  between those commits. The later commits add tests and review evidence.
- The live JavaScript and CSS byte-match the clean build of that implementation.
- This was a report-only review. No product code was changed.

## Verdict

**FAIL.** There is one minor finding, zero untested claims, and no blocking or
major finding. A PASS requires zero findings of every severity.

| Result | Count |
| --- | ---: |
| Blocking findings | 0 |
| Major findings | 0 |
| Minor findings | 1 |
| Untested claims | 0 |

## Finding

### F-7-1 — A direct dependency has a moderate denial-of-service advisory

**Severity: Minor.** A clean `npm ci` succeeds but reports one moderate
vulnerability. `npm audit --omit=dev` identifies direct production dependency
`fflate@0.8.2` under GHSA-px8p-9vwx-vf98. Its `unzipSync` function can loop
forever on a malformed ZIP64 archive. The patched release is `0.8.3`, with no
major-version change required.

The live risk is limited. Production imports `zipSync` to create ZIP files and
does not accept ZIP imports. The affected `unzipSync` name is absent from the
minified production JavaScript. Tests use `unzipSync` only to inspect a ZIP
created by the app. No live user-controlled path to the affected function was
found. This is therefore a dependency-maintenance finding, not evidence of a
working attack against the deployed product.

**Required fix:** update `fflate` and its lock entry to `0.8.3` or later. Then
rerun `npm audit --omit=dev`, all 25 claim commands, `CI=1 npm test`, the build,
and the live asset comparison.

## First screen before scrolling

Fresh Chromium contexts were used for a 1440 × 900 desktop and an emulated
Pixel 5 phone. No saved state was shared between them.

| Question | Answer visible before scrolling |
| --- | --- |
| Job | Prepare one filing period’s evidence for accountant review. |
| Audience | Freelancers with cross-border income. |
| First action | **Try it with sample data**. The next line says the sample opens with files, evidence gaps, and accountant questions. |

All three privacy, offline, and price facts fit both first screens. Their last
edges were 843.56 px in the 900 px desktop viewport and 787.98 px in the
390 × 844 mobile viewport. The heading, audience, action, and facts use plain
words. The live night-counter, paper, cyan, lime, and coral treatment matches
`.factory/design.md` and is not a generic framework screen.

Evidence: [desktop](./qa-artifacts/review-7-live/first-screen-desktop.png) and
[phone](./qa-artifacts/review-7-live/first-screen-mobile.png).

## Demo and real-data isolation

The first landing action opened `/demo` in one click. The first populated view
contained the Apr–Jun cross-border packet, two files, four evidence gaps, and
two accountant questions. The persistent banner said “Demo — sample data,
nothing is saved to your real packets” and kept **Reset demo** and **Start for
real** available.

- Reset restored the original unchecked receipt item and sample counts.
- A real packet and real license marker created in the same fresh context were
  unchanged after demo editing, sample-license activation, reset, and exit.
- Start for real removed the demo database and every `demo:` license key.
- The complete landing-to-demo request log contained no third-party request.
- Offline reload, checklist editing, the offline status, and accountant ZIP
  download all worked after service-worker control.

No existing user profile or real data was used. Each browser context was
disposable. Evidence: [populated phone demo](./qa-artifacts/review-7-live/demo-mobile.png),
[offline phone demo](./qa-artifacts/review-7-live/demo-offline-mobile.png), and
[live audit data](./qa-artifacts/review-7-live/live-report.json).

## Normal, invalid, boundary, and recovery paths

| Path | Result |
| --- | --- |
| Create, edit, attach, question, reload, and export | PASS |
| ZIP members, PDF signature, JSON export, and JSON re-import | PASS |
| Ten rapid checklist-to-question edits through reload | PASS |
| Whitespace-only packet name | PASS; dialog stays open with a clear error |
| Reversed period dates | PASS; form explains the correction |
| Invalid and incomplete JSON backups | PASS; rejected before storage |
| Legacy corrupt stored row | PASS; removed with a recovery notice while the app opens |
| File-size boundary | PASS; 25 MiB accepted and 25 MiB + 1 byte rejected |
| Question removal | PASS; cancel keeps it and confirmation removes it |
| Invalid live lifetime license | PASS; rejected after one request to `api.sociobot.in`, with free use still available |
| One complete free packet and second-packet limit | PASS; free ZIP contains its attachment and the next packet is gated |
| Hosted checkout | PASS; 303 to Sociobot/Dodo and the hosted page showed Deadline Packet at US$12 |
| Cleared storage | PASS; packet, ciphertext, browser key, and recovery action are absent |
| Service-worker update | PASS; the new cache replaces the old cache and a reload action appears |

## Declared claims

`.factory/claims.json` contains 25 entries. Every exact command was run
separately from clean clone `/tmp/compliance-evidence-pack-review7-67LmcS`.

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `demo-seed` | PASS |
| `privacy-local` | PASS |
| `encrypted-storage` | PASS |
| `packet-exports` | PASS |
| `missing-evidence` | PASS |
| `offline-reload` | PASS |
| `free-and-paid` | PASS |
| `hero-art-provenance` | PASS |
| `account-free` | PASS |
| `file-size-limit` | PASS |
| `tracker-free` | PASS |
| `local-retention` | PASS |
| `cleared-data-recovery` | PASS |
| `license-nonblocking` | PASS |
| `license-network-boundary` | PASS |
| `license-local-storage` | PASS |
| `editable-handoff-date` | PASS |
| `question-retention` | PASS |
| `demo-exit` | PASS |
| `no-tax-calculation` | PASS |
| `no-legal-determination` | PASS |
| `no-document-validation` | PASS |
| `no-return-submission` | PASS |
| `no-ocr` | PASS |

The landing page, workspace, Privacy, Terms, README, demo contract, metadata,
and footer were compared with this list. No missing, false, incomplete, or
untested public claim was found.

## Accessibility, mobile, and routes

- The factory URL verifier passed: title, `lang=en`, one h1, main landmark,
  complete image alt text, labelled buttons, and no console error.
- Axe found zero violations on `/`, `/demo`, `/privacy`, `/terms`, and the 404.
- First Tab focused the skip link. Space opened the create dialog. Focus moved
  to Close, Escape closed it, and route navigation and Back focused the new h1.
- A Pixel 5 context at 200% text had no horizontal overflow. No visible demo
  target was smaller than 44 × 44 CSS pixels.
- With reduced motion requested, no animation remained running after the route
  settled.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with their own titles,
  canonical URLs, one h1, and the shared header/footer links.
- Every discovered internal link returned 200. The checkout link returned its
  expected 303.
- `/review-7-missing` returned HTTP 404 and the designed “Page not found.”
  screen. Its browser resource message is the expected result of a deliberate
  404, not a defect. There were no unexpected console or page errors.

Evidence: [URL verifier](./qa-artifacts/review-7-verify/verify.json),
[designed 404](./qa-artifacts/review-7-live/404-desktop.png), and
[live audit data](./qa-artifacts/review-7-live/live-report.json).

## Privacy and network behavior

The root, demo, and Privacy flows made only same-origin requests. Demo sample
license activation made no Sociobot request. A deliberately invalid real
license made exactly one request to the documented Sociobot verification
origin and was rejected. No analytics, advertising script, CDN font, Azure
model endpoint, or embedded provider credential was found.

This is a static PWA with no product backend. Tenant isolation, backend restart
persistence, health endpoints, and product-owned 429/Retry-After behavior do
not apply. It is not a CLI, library, or desktop installer.

## Offline, install, and update behavior

The manifest has a versioned start URL, standalone display, product colors,
192 px and 512 px icons, and maskable purpose. The service worker precaches the
app routes and offline page, removes the prior cache during update, and shows
an in-app reload action. The independent offline browser context reloaded the
demo, saved an edit, and downloaded a ZIP without network access.

## Quality and performance

| Check | Result |
| --- | --- |
| `npm ci` | Completed; F-7-1 records its audit warning |
| 25 exact claim commands | PASS, 25/25 |
| `CI=1 npm test` | PASS; 11 Vitest and 33 Chromium tests |
| `npm run build` | PASS; `dist/index.html` produced |
| Initial JavaScript | 56,043 B raw / 20.04 kB gzip |
| CSS | 26,408 B raw / 6.50 kB gzip |
| Live asset identity | PASS; JS and CSS SHA-256 values match the clean build |
| Lighthouse 12.8.2 mobile | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse metrics | FCP 959 ms, LCP 1,034 ms, TBT 0 ms, CLS 0 |

The first Lighthouse collection reached 99/100/100/100 but Chromium crashed
while collecting the unscored full-page screenshot. A rerun skipped only that
artifact, completed without a runtime error, and scored 100/100/100/100.
Separate desktop and phone screenshots are included above.

## Earlier findings

All earlier review and verification records, including minor findings, were
read and checked against the live product and the rerun tests.

| Earlier findings | Current proof |
| --- | --- |
| F-1-1 | Rapid checklist and question changes survive ten iterations and reload. |
| F-1-2 through F-1-10 | Demo, date, question, exit, license-network, price, and retention claims are listed and their exact commands pass. Removed merchant/refund and retry wording remains absent. |
| F-1-11 through F-1-15 | No text below 16 px, all facts fit, phone navigation is visible, the populated preview precedes How it works, and the demo h1 comes first. |
| F-1-16 through F-1-27 | The earlier overstatement, subjective wording, jargon, long sentence, mixed terms, and unclear restore label remain removed. The source-linked copy policy passes. |
| F-2-1 | The phone price fact ends above the first-screen boundary. |
| F-3-1 through F-3-4 | Demo licenses stay namespaced, license storage is tested, entitlement naming is consistent, and the offline phone label is complete. |
| F-3-5 through F-3-8 | Singular grammar, metadata terms, the 180 px Apple icon, and packet naming remain corrected. |
| F-4-1 and F-4-2 | Final demo text meets 16 px; cleared packet, file, ciphertext, and key recovery behavior is tested. |
| F-4-3 through F-4-7 | README test/setup/project-map wording and every recorded copy count match current source. |
| F-5-1 and F-5-2 | A complete free packet export and original-art provenance are both exercised by exact claim tests. |
| F-5-3 | Privacy navigation and browser Back focus the destination h1. |
| F-5-4 through F-5-10 | The former slogans, mood caption, vague headings, service-worker jargon, and 404 metaphor remain absent. |
| Initial verification P0 findings | Required claims, isolated demo, and first-screen structure are present. |
| Initial verification P1 findings | CSP and immutable hashed-asset caching are present in live headers. |
| Initial verification P2 findings | Route titles, designed HTTP 404, update behavior, and manifest MIME all pass. |
| Verification 2 price, data-loss, and claim findings | Hosted price is US$12; rapid edits persist; claim inventory is complete. |
| Verification 2 scaling, targets, focus, removal, performance, and 404 findings | 200% reflow, 44 px controls, h1 focus, confirmation, Lighthouse budgets, and HTTP 404 all pass. |
| Verification 3 rapid edits, malformed import, and claims findings | Rapid edits persist; incomplete data is rejected before storage; legacy corruption recovers; claims are complete. |
| Verification 3 name, scaling, size, 404, and copy findings | Whitespace names are rejected; 200% reflows; text/targets pass; HTTP 404 and copy audit pass. |

No earlier functional, accessibility, copy, route, demo, privacy, offline, or
claim finding has regressed. F-7-1 is new since the previous clean install.

## Missing feature check

No obvious job step is missing. The product covers the editable filing period,
files, evidence gaps, accountant questions, ZIP/PDF/JSON handoff, backup import,
local retention, and offline work. Cloud sync would conflict with the local
privacy model. OCR or model-based extraction is an explicit non-goal, so no AI
runtime feature is required.
