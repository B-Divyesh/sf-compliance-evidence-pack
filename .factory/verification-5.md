# Prepare filing-period evidence for accountant review — verification 5

Verified 2026-09-06 against the static product at
<https://compliance-evidence-pack.sociobot.in>.

- Implementation candidate: e4659b715215dbd56081cb611f891e0f64ee538d
  (fix: patch fflate security advisory).
- Documentation base: e9e04820b5eec2cff97c17b3c35b958fa59481e7
  (docs: identify repair implementation).
- The documentation commits after the implementation do not change the
  deployed product files. The live JS and CSS byte-match a clean build of the
  implementation candidate.

## Verdict

**PASS.** There are zero findings of every severity and zero untested claims.

| Measure | Result |
| --- | ---: |
| Findings | 0 |
| Untested claims | 0 |
| Declared claims passed | 25 / 25 |

## First screen

Fresh desktop (1440 x 900) and phone (390 x 844) browser contexts opened the
root without scrolling or shared state.

| Required answer | What was visible |
| --- | --- |
| Job | Prepare evidence for your accountant. |
| Audience | Freelancers with cross-border income. |
| First action | Try it with sample data. It says the sample opens with files, evidence gaps, and accountant questions. |

All three facts fit the first screen on both devices. The lowest fact ended at
843.56 px on desktop and 787.98 px on phone. The live page had no unexpected
console or page error.

## Sample, privacy, and offline work

The first action opened /demo in one click. The populated sample contained two
files, four evidence gaps, and two accountant questions. Its persistent banner
identified sample data and kept Reset demo and Start for real available.

Reset restored the sample. A real packet and real license marker were created
in the same disposable context, then demo license activation and exit were
exercised. The real marker and license were unchanged; all demo: keys and the
demo database were gone on exit. The landing-to-demo request log had no
third-party request.

After service-worker control, a separate phone context went offline, reloaded
the demo, changed a checklist item, showed “Offline — edits still save”, and
downloaded apr-jun-cross-border-evidence-accountant-packet.zip.

## Claims and local quality gates

An isolated clone at /tmp/compliance-evidence-pack-verify-5 ran npm ci, then
every exact command in .factory/claims.json separately. All passed.

| Claim | Result |
| --- | --- |
| demo-isolation | PASS |
| demo-seed | PASS |
| privacy-local | PASS |
| encrypted-storage | PASS |
| packet-exports | PASS |
| missing-evidence | PASS |
| offline-reload | PASS |
| free-and-paid | PASS |
| hero-art-provenance | PASS |
| account-free | PASS |
| file-size-limit | PASS |
| tracker-free | PASS |
| local-retention | PASS |
| cleared-data-recovery | PASS |
| license-nonblocking | PASS |
| license-network-boundary | PASS |
| license-local-storage | PASS |
| editable-handoff-date | PASS |
| question-retention | PASS |
| demo-exit | PASS |
| no-tax-calculation | PASS |
| no-legal-determination | PASS |
| no-document-validation | PASS |
| no-return-submission | PASS |
| no-ocr | PASS |

CI=1 npm test then passed: production audit with zero vulnerabilities,
TypeScript, 11 Vitest policy/unit tests, and 33 serial Chromium tests. The full
browser suite covers normal use plus whitespace names, reversed dates, invalid
and incomplete backups, legacy corrupt rows, 25 MiB file boundary,
question-removal confirmation, invalid license, free-packet boundary, cleared
storage, update recovery, keyboard dialog behavior, 200% reflow, and reduced
motion.

npm run build passed and produced dist/index.html. Initial app assets are
56,050 B JavaScript (20.05 kB gzip) and 26,408 B CSS (6.50 kB gzip).

## Live routes and accessibility

The live audit used Playwright Axe on /, /demo, /privacy, /terms, and a
designed unknown route. Each scan had zero violations, including zero serious
or critical issues. The root has the expected title, English language, single
h1, main landmark, alt text, labels, skip link, focus treatment, and no
unexpected console errors.

The root, demo, privacy, and terms routes each returned 200 with route-specific
titles, canonical URLs, metadata, one h1, and the shared header/footer.
Navigation and browser Back focused the destination h1. All discovered internal
links returned 200. The hosted checkout correctly returned 303. The deliberate
unknown route returned HTTP 404 with title Page not found — Deadline Packet and
h1 Page not found. Its expected browser 404 resource message is not a defect.

Live assets matched the clean candidate build exactly:

| Asset | SHA-256 |
| --- | --- |
| assets/index-GE7wjP2i.js | eb5162720ff176b50c833a8d14ab451025e5e92e8ef486506b3b7273896aac88 |
| assets/index-B7DxW8FR.css | bd15702f933a84729f53561316ff2eb299f32dafc79f237b2cd20b46fa8312a8 |

This is a static PWA with no product backend, tenant, health endpoint, or
product-owned rate-limit API. Backend persistence, tenant isolation, and
429/Retry-After checks therefore do not apply. It is not a CLI, library, or
desktop artifact.

## Earlier findings

All previous verification, review, and polish records were read. Their current
disposition is verified below; “pass” means current behavior plus the relevant
regression or claim coverage was exercised in this run.

| Earlier findings | Current disposition |
| --- | --- |
| Initial verification P0–P2 | PASS — claim inventory, isolated sample, clear first screen, CSP, immutable asset caching, route titles, HTTP 404, update behavior, and manifest MIME are present. |
| Verification 2 | PASS — US$12 checkout, rapid edit retention, complete claims, 200% reflow, 44 px controls, h1 focus, reversible removal, performance structure, and HTTP 404 remain covered. |
| Verification 3 | PASS — rapid edits persist; malformed or incomplete imports recover safely; whitespace names reject clearly; text, targets, reflow, 404, and copy audit pass. |
| F-1-1 through F-1-10 | PASS — rapid question saves, sample wording/counts, date, question retention, demo exit, license boundary, checkout wording, non-blocking use, and cleared-storage retention are tested. |
| F-1-11 through F-1-15 | PASS — 16 px text floor, first-screen facts, phone navigation, populated preview, and heading order pass. |
| F-1-16 through F-1-27 | PASS — removed overstatement, subjective copy, jargon, mixed terms, long wording, and unclear restore label remain absent under the source-linked copy policy. |
| F-2-1 | PASS — the US$12 fact remains visible at 390 x 844. |
| F-3-1 through F-3-8 | PASS — demo license isolation, license-storage coverage, consistent terms, visible offline status, grammar, metadata language, Apple icon, and packet naming pass. |
| F-4-1 through F-4-7 | PASS — final demo text is at least 16 px; clearing removes data/key without recovery; README and copy-audit wording/counts pass. |
| F-5-1 through F-5-10 | PASS — complete free export, art provenance, h1 route focus, literal section wording, and literal 404 language are tested. |
| F-7-1 | PASS — fflate is 0.8.3 and npm audit --omit=dev --audit-level=moderate reports zero vulnerabilities. That audit is now part of npm test. |

No public claim was missing, false, incomplete, or untested. No new issue was
found.

## Reproduce

    npm ci
    CI=1 npm test
    npm run build
    node scripts/live-audit.mjs https://compliance-evidence-pack.sociobot.in .factory/qa-artifacts/verification-5-live

