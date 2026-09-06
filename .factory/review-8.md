# Prepare filing-period evidence for accountant review — review 8

Reviewed on 6 September 2026 against
<https://compliance-evidence-pack.sociobot.in>.

- Implementation candidate: `e4659b715215dbd56081cb611f891e0f64ee538d`
- Documentation base at review start: `d7f0308dbbf30e988ffb27cdd9330a0d00a2bffa`
- Commits after the implementation change only reports and QA evidence. They do
  not change the product files.
- Live JavaScript and CSS byte-match a clean build of the implementation
  candidate.
- This review changed no product code.

## Verdict

**PASS.** There are zero findings of every severity and zero untested claims.

| Result | Count |
| --- | ---: |
| Blocking findings | 0 |
| Major findings | 0 |
| Minor findings | 0 |
| Untested claims | 0 |
| Declared claim commands passed | 25 / 25 |

## First screen before scrolling

Fresh 1440 × 900 desktop and 390 × 844 phone contexts opened the live root
without shared storage or scrolling.

| Required answer | Visible answer |
| --- | --- |
| Job | Prepare evidence for your accountant. |
| Audience | Freelancers with cross-border income. |
| First action | **Try it with sample data**. The next line says it opens files, evidence gaps, and accountant questions. |

The privacy, offline, and price facts also fit. The lowest fact ended at
843.56 px on desktop and 787.98 px on phone. The page used plain job language,
had no unexpected console error, and matched the product-specific night-counter
design in `.factory/design.md`.

Evidence: [desktop](./qa-artifacts/review-8-live/first-screen-desktop.png),
[phone](./qa-artifacts/review-8-live/first-screen-mobile.png), and
[live audit](./qa-artifacts/review-8-live/live-report.json).

## One-click sample and real-data isolation

The first action opened `/demo` in one click. Its first populated screen had
the Apr–Jun cross-border packet, two files, four evidence gaps, and two
accountant questions. The persistent banner said sample data was not saved to
real packets and kept **Reset demo** and **Start for real** available.

- Reset restored the sample checklist and counts.
- A real packet and real lifetime-license marker remained unchanged after demo
  edits, sample-license activation, reset, and exit.
- Start for real removed the demo database and every `demo:` browser key.
- The landing-to-demo request log contained no third-party request.
- The populated demo had no visible readable text below 16 px.

Evidence: [populated phone demo](./qa-artifacts/review-8-live/demo-mobile.png)
and [live audit](./qa-artifacts/review-8-live/live-report.json).

## Declared claims

A clean checkout at `/work/.review8-compliance-evidence-pack-2` checked out the
implementation candidate, ran `npm ci`, and then ran every exact `test` command
from `.factory/claims.json` separately. The discarded `/tmp` setup attempt is
not counted: its dependency directory did not persist between sandbox calls,
so it was stopped and the documented install was repeated in persistent
workspace storage before any result was accepted.

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| `demo-isolation` | PASS | `demo-seed` | PASS |
| `privacy-local` | PASS | `encrypted-storage` | PASS |
| `packet-exports` | PASS | `missing-evidence` | PASS |
| `offline-reload` | PASS | `free-and-paid` | PASS |
| `hero-art-provenance` | PASS | `account-free` | PASS |
| `file-size-limit` | PASS | `tracker-free` | PASS |
| `local-retention` | PASS | `cleared-data-recovery` | PASS |
| `license-nonblocking` | PASS | `license-network-boundary` | PASS |
| `license-local-storage` | PASS | `editable-handoff-date` | PASS |
| `question-retention` | PASS | `demo-exit` | PASS |
| `no-tax-calculation` | PASS | `no-legal-determination` | PASS |
| `no-document-validation` | PASS | `no-return-submission` | PASS |
| `no-ocr` | PASS |  |  |

The landing page, workspace, Privacy, Terms, README, demo contract, metadata,
and footer were compared with the inventory. No public claim was missing,
false, incomplete, or untested.

## Normal, invalid, boundary, and recovery paths

The complete serial browser suite passed these paths:

| Path | Result |
| --- | --- |
| Create, edit, attach, ask, reload, and export | PASS |
| ZIP members, PDF signature, JSON backup, and JSON import | PASS |
| Ten rapid checklist-to-question edits through reload | PASS |
| Whitespace-only packet name | PASS; the dialog stays open with a clear error |
| Reversed period dates | PASS; the form explains the correction |
| Invalid and incomplete backups | PASS; rejected before storage |
| Legacy corrupt stored row | PASS; removed with a recovery notice while the app opens |
| File-size boundary | PASS; 25 MiB accepted and 25 MiB + 1 byte rejected |
| Question removal | PASS; cancel keeps it and confirmation removes it |
| Invalid lifetime license | PASS; free use remains available |
| Complete free packet and second-packet limit | PASS; free ZIP includes its attachment and the next packet is gated |
| Hosted checkout | PASS; 303 to Sociobot/Dodo and the hosted product price is US$12 |
| Cleared storage | PASS; packet, ciphertext, browser key, and recovery action are absent |
| Service-worker update | PASS; the new cache replaces the old cache and a reload action appears |

## Accessibility, routes, privacy, and offline behavior

- The supplied URL verifier passed with a route title, `lang=en`, one h1, a
  main landmark, complete image alt text, labelled buttons, and no console
  error. [Verifier result](./qa-artifacts/review-8-verify/verify.json).
- Playwright Axe found zero violations on `/`, `/demo`, `/privacy`, `/terms`,
  and the designed 404.
- Keyboard tests cover the skip link, Enter navigation, Space activation,
  dialog focus, Escape, focus return, route h1 focus, and browser Back.
- At 390 px and 200% text, content reflows without horizontal loss and exposed
  controls meet 44 × 44 CSS px. Reduced-motion mode leaves no running
  animation.
- Root, demo, Privacy, and Terms return 200 with route-specific titles,
  canonical URLs, one h1, the shared header, and the shared footer. Every
  discovered internal link returns 200.
- `/round-5-missing` returns HTTP 404 with title **Page not found — Deadline
  Packet** and h1 **Page not found.** Its one 404 resource message is the
  expected result of deliberate HTTP status, not a defect.
- Live HTML has CSP, HSTS, nosniff, Referrer-Policy, and a restrictive
  Permissions-Policy. Hashed assets are immutable for one year. The manifest
  has the correct MIME type, and `/sw.js` uses `no-cache`.
- A separate controlled phone context reloaded `/demo` offline, saved a
  checklist edit, showed **Offline — edits still save**, and downloaded the
  accountant ZIP.
- Packet flows use the product origin only. Sociobot is contacted only for the
  tested lifetime-license actions. No tracker, third-party font, model endpoint,
  or embedded credential was found.
- There is no product account or server-held packet store, so a product data
  access or deletion request is not applicable. Local export, packet deletion,
  license removal, and complete browser-storage clearing were exercised.

This is a static local-first PWA. It has no product backend, tenant, health
endpoint, or product-owned rate-limit API. Backend restart persistence, tenant
isolation, and 429/Retry-After checks do not apply. It is not a CLI, library,
desktop product, or installed consumer package.

## Quality, build, and deployment identity

| Check | Result |
| --- | --- |
| `npm ci` | PASS; documented Node/npm setup completed |
| 25 exact claim commands | PASS, 25 / 25 |
| `CI=1 npm test` | PASS; zero production audit vulnerabilities, 11 Vitest tests, 33 Chromium tests |
| `npm run build` | PASS; `dist/index.html` produced |
| Initial JavaScript | 56,050 B raw / 20.05 kB gzip |
| CSS | 26,408 B raw / 6.50 kB gzip |
| Isolated Lighthouse run 1 | 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 904 ms, TBT 0 ms, CLS 0 |
| Isolated Lighthouse run 2 | 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 959 ms, TBT 29 ms, CLS 0 |

A preliminary Lighthouse collection ran while the separate claim suite was
building and launching browsers. It scored 85 performance with 579 ms TBT,
while LCP remained 1.11 s and CLS 0. That host-contention collection is kept
as evidence but is not the isolated budget measurement. Two quiet repeats
above both pass every budget.

The clean candidate and live bytes match exactly:

| Asset | SHA-256 |
| --- | --- |
| `assets/index-GE7wjP2i.js` | `eb5162720ff176b50c833a8d14ab451025e5e92e8ef486506b3b7273896aac88` |
| `assets/index-B7DxW8FR.css` | `bd15702f933a84729f53561316ff2eb299f32dafc79f237b2cd20b46fa8312a8` |

## Earlier findings

Every earlier review and verification record, including minor findings, was
read and rechecked against the live product and current regression coverage.

| Earlier findings | Current proof |
| --- | --- |
| Initial verification P0–P2 | PASS — the claim inventory, isolated sample, clear first screen, CSP, immutable caching, route titles, real HTTP 404, update behavior, and manifest MIME are present. |
| Verification 2 | PASS — checkout is US$12; rapid edits persist; claims are complete; 200% reflow, 44 px controls, h1 focus, reversible question removal, performance, and HTTP 404 pass. |
| Verification 3 | PASS — rapid edits persist; malformed and incomplete imports cannot brick startup; corrupt legacy rows recover; whitespace names reject; reflow, type size, targets, 404, and copy audit pass. |
| F-1-1 through F-1-10 | PASS — rapid question saves, sample wording and counts, dates, question retention, demo exit, license boundary, checkout wording, non-blocking use, and cleared-storage retention have direct tests. |
| F-1-11 through F-1-15 | PASS — the 16 px floor, both first screens, phone navigation, populated preview, and heading order pass live and in regression tests. |
| F-1-16 through F-1-27 | PASS — the former overstatement, subjective copy, jargon, mixed terms, long wording, and unclear restore label remain absent; the source-linked copy policy passes. |
| F-2-1 | PASS — the US$12 fact ends at 787.98 px in the 844 px phone viewport. |
| F-3-1 through F-3-8 | PASS — demo licenses are isolated, license storage is tested, entitlement names match, offline status is visible, grammar and metadata are plain, the Apple icon is 180 px, and packet naming is consistent. |
| F-4-1 through F-4-7 | PASS — final demo text is at least 16 px; clearing removes data and key with no recovery; README and copy-audit wording and counts pass. |
| F-5-1 through F-5-10 | PASS — a complete free export, artwork provenance, route h1 focus, literal section headings, plain privacy language, and literal 404 wording are tested. |
| F-7-1 | PASS — `fflate` is 0.8.3 and the production audit reports zero vulnerabilities as part of `npm test`. |

No earlier functional, accessibility, copy, route, demo, privacy, offline,
performance, dependency, or claims finding has regressed.

## Missing feature check

No obvious job step is missing. The product covers filing periods, files,
evidence gaps, accountant questions, ZIP/PDF/JSON handoff, backup import,
local retention, and offline work. Cloud sync would conflict with the stated
local privacy model. OCR and model-based extraction are explicit non-goals, so
an AI feature is not required.

## Reproduce

    git checkout e4659b715215dbd56081cb611f891e0f64ee538d
    npm ci
    # Run each exact command in .factory/claims.json separately.
    CI=1 npm test
    npm run build
    node scripts/live-audit.mjs https://compliance-evidence-pack.sociobot.in .factory/qa-artifacts/review-8-live
