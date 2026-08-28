# Adversarial first-read review 4 — Deadline Packet

Reviewed 2026-08-28 at commit `29d862e3069b7a223daef4bc9e0b0e56c8b84986`
and against <https://compliance-evidence-pack.sociobot.in>. The live JavaScript
and CSS byte-match the clean local build. Product code was not modified.

## Verdict

**FAIL.** The cold first screen, one-click demo, core workflow, storage
isolation, offline behavior, routing, and all 23 declared claim commands pass.
Acceptance still fails because the earlier 16 px typography blocker is present
on the live demo and its regression test produces a false pass. The Privacy
page also contains one safety claim that is absent from `claims.json`. Five
documentation/copy-audit defects remain. A PASS requires zero findings.

## Findings

### Blocking

#### F-4-1 — Reopened F-1-11: twelve demo labels render below the documented 16 px minimum

- **Exact location:** live `/demo` at 390 px. Seven **Ready for review / Still
  needed** checklist states, two file metadata lines, **Needs an answer**,
  **Answered**, and **15 Sept 2026** each compute to `13.3333px`.
- **Code evidence:** `src/styles.css` sets `:root` to 16 px but leaves the
  browser's smaller default for `.checklist small` and `.file-list small`.
  The due date is also rendered in a `small` element. This is the same defect
  previously recorded as F-1-11 and later marked fixed.
- **Test defect:** `all visible readable text meets the documented 16px
  minimum at 390px` calls `page.goto('/demo')` and immediately inspects the
  DOM. It often sees only the 16 px loading shell before IndexedDB seeding and
  the async dashboard render finish, so the test passes while the final UI
  fails. Waiting for the sample h1 reproduces all twelve failures locally and
  live.
- **Why this blocks:** the live product violates its explicit design contract
  (“Body is never below 16 px”), and a prior blocking finding was only
  test-masked rather than fixed. These are meaningful state and file labels in
  the main phone workflow.
- **Concrete fix:** set checklist/file metadata and the due-date `small`
  element to at least `1rem`. Make the regression test wait for **Apr–Jun
  cross-border evidence**, the seeded files, and the checklist before scanning
  every visible text-bearing element.

#### F-4-2 — The cleared-data recovery statement is an unlisted privacy claim

- **Exact quote/location:** live `/privacy`, “We cannot recover local data or a
  browser key after it is cleared.”
- **Why this blocks:** a visitor can rely on this as a privacy and recovery
  guarantee. No `claims.json` entry lists it. `local-retention` proves that a
  packet does not return after site storage is cleared, but it does not assert
  destruction of the stored encryption key or absence of any recovery path.
- **Concrete fix:** add a `cleared-data-recovery` claim and tagged test that
  creates an encrypted attachment, clears site storage, proves the packet and
  key are gone, and confirms that no recovery request or action exists. If
  that guarantee is intentionally out of scope, remove the sentence.

### Minor

#### F-4-3 — The README says “coverage” although no coverage report runs

- **Exact quote/location:** README, “`npm test` runs TypeScript, Vitest, and
  Chromium coverage.”
- **Why this matters:** “coverage” normally means measured code coverage. The
  command runs a type check, unit tests, and browser tests, but emits no
  coverage report.
- **Concrete rewrite:** “`npm test` checks types, unit tests, and browser
  tests.”

#### F-4-4 — The browser-install instruction uses unexplained factory jargon

- **Exact quote/location:** README, “Install its Chromium binary outside the
  factory image with `npx playwright install chromium`.”
- **Why this matters:** a new contributor must interpret “binary” and “factory
  image” before learning whether the command is needed.
- **Concrete rewrite:** “If Chromium is missing, run `npx playwright install
  chromium`.”

#### F-4-5 — The database project-map entry is implementation-first

- **Exact quote/location:** README, “`src/db.ts` — isolated real/demo IndexedDB
  persistence and encryption.”
- **Why this matters:** “IndexedDB persistence” hides the useful behavior and
  is harder to parse than the surrounding project map.
- **Concrete rewrite:** “`src/db.ts` — stores and encrypts real and demo data
  separately in the browser.”

#### F-4-6 — The service-worker project-map entry stacks unexplained jargon

- **Exact quote/location:** README, “`public/sw.js` — versioned offline shell
  and update lifecycle.”
- **Why this matters:** neither “offline shell” nor “update lifecycle” names
  what the file does for a contributor.
- **Concrete rewrite:** “`public/sw.js` — caches the app for offline use and
  installs updates.”

#### F-4-7 — The repository copy audit reports three incorrect word counts

- **Exact location:** `.factory/copy-audit.md` lists “The sample opens with
  files, evidence gaps, and accountant questions.” as 9 words (actual: 10),
  “From scattered evidence to one reviewable handoff.” as 8 (actual: 7), and
  “This creates an organizational checklist, not a filing or legal
  determination.” as 10 (actual: 11).
- **Why this matters:** the handoff cites this file as proof that copy was
  counted and rechecked. Incorrect counts make that evidence unreliable even
  though none of the affected sentences exceeds 22 words.
- **Concrete fix:** regenerate the audit from the rendered strings with one
  documented counting rule and test the recorded counts against source copy.

## Cold first read

Fresh Chromium contexts opened `/` without scrolling at 390×844 and 1440×900.

| Question | Answer available on the first screen | Exact cue |
| --- | --- | --- |
| What does it do? | Organizes filing-period evidence and questions for accountant review. | “Prepare evidence for your accountant.” |
| For whom? | Freelancers with cross-border income. | “For freelancers with cross-border income…” |
| What should I click first? | Open the seeded example. | “Try it with sample data” and the adjacent sample explanation. |

The three required facts also fit before scrolling. Their mobile bottom edges
are 751.19, 781.98, and 837.58 px; their desktop bottom edges are 796.36,
827.16, and 857.95 px. Evidence: [mobile](./qa-artifacts/review-4-first-read-mobile.png)
and [desktop](./qa-artifacts/review-4-first-read-desktop.png).

## Copy audit

Counts below use whitespace-separated displayed words. Repeated Privacy and
Terms links are consolidated with their occurrence counts. All landing and
README sentences are at or below 22 words. No banned marketing adjective or
inconsistent product term was found. Headings make sense out of context, and
actions name a result. The four README jargon/accuracy flags are F-4-3 through
F-4-6.

### Landing page

| # | Exact copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Deadline Packet | 2 | Pass; wordmark |
| 2 | Skip to main content | 4 | Pass; action |
| 3 | Local Online | 2 | Pass; status |
| 4 | Install app | 2 | Pass; action |
| 5 | Demo | 1 | Pass; navigation |
| 6 | Privacy (header and footer) | 1 | Pass; navigation |
| 7 | Terms (header and footer) | 1 | Pass; navigation |
| 8 | Evidence in order. | 3 | Pass |
| 9 | Questions in view. | 3 | Pass |
| 10 | Prepare evidence for your accountant. | 5 | Pass; h1 |
| 11 | For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 18 | Pass |
| 12 | Try it with sample data | 5 | Pass; action |
| 13 | Start your packet | 3 | Pass; action |
| 14 | The sample opens with files, evidence gaps, and accountant questions. | 10 | Pass |
| 15 | No account. | 2 | Pass |
| 16 | Data stays in this browser. | 5 | Pass |
| 17 | Works offline after your first visit. | 6 | Pass |
| 18 | One packet free. | 3 | Pass |
| 19 | Unlimited use costs US$12 once. | 5 | Pass |
| 20 | Import a JSON backup | 4 | Pass; action |
| 21 | A kraft evidence folder, receipts, invoice sheets, and a calculator arranged on a rain-dark night-market counter | 16 | Pass; image alt |
| 22 | From scattered evidence to one reviewable handoff. | 7 | Pass |
| 23 | Sample packet view | 3 | Pass |
| 24 | See the evidence gaps before handoff. | 6 | Pass; h2 |
| 25 | Files, checklist states, and questions stay together in one packet. | 10 | Pass |
| 26 | Open the sample packet | 4 | Pass; action |
| 27 | Apr–Jun / Review desk | 4 | Pass |
| 28 | 3 of 7 evidence groups ready | 6 | Pass |
| 29 | Business expense receipts | 3 | Pass |
| 30 | Evidence gap (twice) | 2 | Pass |
| 31 | Relevant contracts | 2 | Pass |
| 32 | Which exchange-rate record should I use? | 6 | Pass |
| 33 | Open question | 2 | Pass |
| 34 | 2 attached sample files · Export bar ready | 8 | Pass |
| 35 | How it works | 3 | Pass; section label |
| 36 | Set the period | 3 | Pass |
| 37 | Choose your own handoff date. | 5 | Pass |
| 38 | Gather the proof | 3 | Pass |
| 39 | See which checklist items are still missing. | 7 | Pass |
| 40 | Export one packet | 3 | Pass |
| 41 | ZIP + PDF index for review. | 6 | Pass |
| 42 | Built for human review | 4 | Pass |
| 43 | Not another filing portal. | 4 | Pass; h2 |
| 44 | Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 | Pass |
| 45 | It keeps evidence gaps and accountant questions in the same packet. | 11 | Pass |
| 46 | Stored in this browser | 4 | Pass |
| 47 | Attachments included in your ZIP | 5 | Pass |
| 48 | Evidence gaps follow the checklist | 5 | Pass |
| 49 | Open questions stay beside the files | 6 | Pass |
| 50 | Lifetime license | 2 | Pass |
| 51 | Keep every filing period | 4 | Pass; h2 |
| 52 | US$12 once. | 2 | Pass |
| 53 | Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 | Pass |
| 54 | Buy a lifetime license | 4 | Pass; action |
| 55 | Restore a lifetime license | 4 | Pass; disclosure action |
| 56 | License token | 2 | Pass; label |
| 57 | Verify and restore | 3 | Pass; the accessible name adds “lifetime license” |
| 58 | Checkout opens on Sociobot/Dodo. | 4 | Pass |
| 59 | New packet | 2 | Pass; dialog eyebrow |
| 60 | Start a packet | 3 | Pass; dialog h2 |
| 61 | Close dialog | 2 | Pass; icon-button name |
| 62 | Packet name | 2 | Pass; label |
| 63 | Period starts | 2 | Pass; label |
| 64 | Period ends | 2 | Pass; label |
| 65 | Your handoff deadline | 3 | Pass; label |
| 66 | Use the date you want the packet with your accountant—not a statutory deadline. | 13 | Pass |
| 67 | Accountant or contact · Optional | 5 | Pass; label |
| 68 | This creates an organizational checklist, not a filing or legal determination. | 11 | Pass |
| 69 | Cancel | 1 | Pass; action |
| 70 | Create packet | 2 | Pass; action |
| 71 | Prepare filing-period evidence for accountant review. | 6 | Pass; footer |
| 72 | Built by Param Factory · v1.0.0. | 6 | Pass; footer/build id |
| 73 | Original still-life artwork was AI-generated for Deadline Packet. | 8 | Pass; provenance |

### README

| # | Exact sentence or heading | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Deadline Packet | 2 | Pass |
| 2 | Prepare evidence packets for accountant review. | 6 | Pass |
| 3 | Deadline Packet organizes one filing period’s invoices, receipts, statements, evidence gaps, notes, and questions. | 14 | Pass |
| 4 | It exports them for accountant review. | 6 | Pass |
| 5 | It does not calculate tax, decide legal requirements, submit returns, or run OCR. | 13 | Pass |
| 6 | Live product: https://compliance-evidence-pack.sociobot.in | 3 | Pass |
| 7 | One-click demo: https://compliance-evidence-pack.sociobot.in/demo | 3 | Pass |
| 8 | What it does | 3 | Pass; heading |
| 9 | Stores packet details and attached files in this browser. | 9 | Pass |
| 10 | When supported, your browser encrypts attached files before storing them. | 10 | Pass |
| 11 | Builds an evidence-gap list from the editable checklist. | 8 | Pass |
| 12 | Exports an accountant ZIP, PDF index, and JSON backup you can import. | 12 | Pass |
| 13 | Keeps edits and exports working offline after the first visit. | 10 | Pass |
| 14 | Includes one packet free. | 4 | Pass |
| 15 | A US$12 lifetime license adds unlimited packets and duplication. | 9 | Pass |
| 16 | The app does not upload packet contents automatically. | 8 | Pass |
| 17 | The app contacts Sociobot only when you buy or verify a lifetime license. | 13 | Pass |
| 18 | Clearing browser site data removes local packets, so keep an exported backup somewhere safe. | 14 | Pass |
| 19 | Try the isolated demo | 4 | Pass; heading |
| 20 | Open `/demo` or `/?demo=1`. | 4 | Pass |
| 21 | It opens an Apr–Jun cross-border packet with two sample files, four evidence gaps, and two accountant questions. | 17 | Pass |
| 22 | Demo changes stay in separate browser storage, including sample license state. | 11 | Pass |
| 23 | Sample license activation never contacts Sociobot. | 6 | Pass |
| 24 | Reset demo restores the sample. | 5 | Pass |
| 25 | Start for real deletes demo changes and opens your real workspace. | 11 | Pass |
| 26 | See the demo contract. | 4 | Pass |
| 27 | Run locally | 2 | Pass; heading |
| 28 | Requirements: Node.js 22+ and npm. | 5 | Pass |
| 29 | No backend or environment variable is required. | 7 | Pass |
| 30 | Test and build | 3 | Pass; heading |
| 31 | The project requires Playwright 1.58.2. | 5 | Pass |
| 32 | Install its Chromium binary outside the factory image with `npx playwright install chromium`. | 13 | **F-4-4** |
| 33 | `npm test` runs TypeScript, Vitest, and Chromium coverage. | 8 | **F-4-3** |
| 34 | Claim-specific commands are listed in `.factory/claims.json`. | 6 | Pass |
| 35 | The production build lands in `dist/`, with `index.html` at its root. | 11 | Pass |
| 36 | Deploy | 1 | Pass; heading |
| 37 | Build with `npm run build` and deploy `dist/` as a static site. | 12 | Pass |
| 38 | The build includes pages for the demo, policies, and 404 errors. | 11 | Pass |
| 39 | It also includes offline app files and Azure Static Web Apps configuration. | 12 | Pass; deployment context |
| 40 | The factory owns DNS and infrastructure. | 6 | Pass |
| 41 | Project map | 2 | Pass; heading |
| 42 | `src/main.ts` — screens, demo seed, routing, and interaction logic. | 9 | Pass; project map |
| 43 | `src/db.ts` — isolated real/demo IndexedDB persistence and encryption. | 8 | **F-4-5** |
| 44 | `src/export.ts` — ZIP, PDF, and JSON generation. | 7 | Pass; project map |
| 45 | `public/sw.js` — versioned offline shell and update lifecycle. | 8 | **F-4-6** |
| 46 | `.factory/design.md` — product visual system and asset provenance. | 8 | Pass; project map |
| 47 | `.factory/handoff.md` — exact release verification evidence. | 6 | Pass; project map |
| 48 | Privacy and law | 3 | Pass; heading |
| 49 | Read the in-app `/privacy` and `/terms` pages. | 7 | Pass |
| 50 | The software is an organizational tool, not tax, accounting, or legal advice. | 12 | Pass |
| 51 | License | 1 | Pass; heading |
| 52 | MIT — see LICENSE. | 4 | Pass |

## Demo and sandbox

- One click on **Try it with sample data** opens `/demo` and immediately shows
  **Apr–Jun cross-border evidence**, two sample files, four evidence gaps, two
  accountant questions, a named accountant, and a handoff date. The mobile
  capture is [here](./qa-artifacts/review-4-demo-mobile.png).
- The persistent banner says “Demo — sample data, nothing is saved to your real
  packets” and exposes **Reset demo** and **Start for real**.
- A live exercise created **Review 4 real packet**, entered demo mode, changed
  the checklist, added a demo-only question, reset the sample, and exited.
  Reset removed the edit/question. Exit restored the real packet, removed the
  demo database and all `demo:` localStorage keys, and made no Sociobot request.
- A direct fresh `/demo` context created only `deadline-packet-demo` and the
  `demo:deadline-packet:current` key. It did not create or read the real packet
  database.
- After service-worker control, a live offline reload retained the sample,
  accepted a checklist edit, showed the full **Offline — edits still save**
  badge, and downloaded the accountant ZIP. All recorded requests were
  same-origin. Evidence: [offline mobile](./qa-artifacts/review-4-demo-offline-mobile.png).

The demo and sandbox gates pass.

## Claims

A clean clone at `/tmp/compliance-evidence-pack-review4-raWuna` ran `npm ci`
and then every exact `test` command in `.factory/claims.json` separately.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `demo-seed` | PASS |
| `privacy-local` | PASS |
| `encrypted-storage` | PASS |
| `packet-exports` | PASS |
| `missing-evidence` | PASS |
| `offline-reload` | PASS |
| `free-and-paid` | PASS |
| `account-free` | PASS |
| `file-size-limit` | PASS |
| `tracker-free` | PASS |
| `local-retention` | PASS |
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

No listed claim test failed. F-4-2 is the one public claim absent from the
inventory. The live unlicensed demo request log stayed entirely on
`compliance-evidence-pack.sociobot.in`; checkout returned 303 to Dodo.

## Earlier-finding reconciliation

Every earlier review, polish report, and handoff was read. Every numbered
review finding was checked in the current live site and source/tests.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: the tagged rapid-question test passes and the save queue retains drafts. |
| F-1-2 | Fixed: the landing names observable sample contents; `demo-seed` passes. |
| F-1-3 | Fixed: README counts match the seeded files/gaps/questions. |
| F-1-4 | Fixed: chosen/edited handoff dates persist through reload. |
| F-1-5 | Fixed: questions persist beside files through rapid edits and reload. |
| F-1-6 | Fixed: live Start for real removes demo work and restores untouched real work. |
| F-1-7 | Fixed: the declared Sociobot request-boundary test passes. |
| F-1-8 | Fixed: merchant/refund assertions remain absent; copy states only the checkout destination. |
| F-1-9 | Fixed: the untested online-retry statement remains absent. |
| F-1-10 | Fixed: the retention test clears IndexedDB, Cache Storage, and localStorage. |
| F-1-11 | **BLOCKING / reopened as F-4-1:** twelve final demo labels are 13.3333 px; the current test checks too early. |
| F-1-12 | Fixed: all three desktop facts end above 900 px. |
| F-1-13 | Fixed: Demo, Privacy, and Terms are visible at 390 px. |
| F-1-14 | Fixed: the product preview precedes How it works. |
| F-1-15 | Fixed: the demo h1 precedes all h2/h3 headings. |
| F-1-16 | Fixed: “accountant-ready” is absent from landing and README. |
| F-1-17 | Fixed: the checklist step names the observable missing-item result. |
| F-1-18 | Fixed: the boundary copy directly names evidence gaps and questions. |
| F-1-19 | Fixed: public entitlement copy consistently uses “lifetime license.” |
| F-1-20 | Fixed: missing-item copy consistently uses “evidence gap(s).” |
| F-1-21 | Fixed: landing says “Stored in this browser.” |
| F-1-22 | Fixed: the README storage description is user-facing. |
| F-1-23 | Fixed: the README encryption description leads with browser behavior. |
| F-1-24 | Fixed: demo documentation describes separate packet and license storage. |
| F-1-25 | Fixed: README names the exact Playwright version. |
| F-1-26 | Fixed: no README sentence exceeds 22 words. |
| F-1-27 | Fixed: the disclosure says “Restore a lifetime license.” |
| F-2-1 | Fixed: the mobile price fact ends at 837.58 px in the 844 px viewport. |
| F-3-1 | Fixed: direct demo uses only demo packet/license namespaces and makes no Sociobot request. |
| F-3-2 | Fixed: the license-storage statement is listed and its tagged test passes. |
| F-3-3 | Fixed: “one-time license” and “unlock” are absent as entitlement names. |
| F-3-4 | Fixed: the full offline label is visible and unclipped at 390 px. |
| F-3-5 | Fixed: the sample summary says “1 open question.” |
| F-3-6 | Fixed: route/social descriptions use the declared evidence-gap language. |
| F-3-7 | Fixed: the linked Apple touch icon is 180×180. |
| F-3-8 | Fixed: the create dialog says “New packet.” |

Earlier unnumbered verification findings were also rerun: the demo and claims
contract, checkout price, malformed/incomplete import handling, whitespace-only
names, question deletion confirmation, 200% reflow, 44 px targets, route focus
and announcements, CSP/cache/manifest behavior, update coverage, designed HTTP
404, and route-specific metadata all pass. The former stale-copy-audit issue is
not fully reliable because F-4-7 identifies new count errors.

## Structure, accessibility, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns a
  styled HTTP 404 with a return action. Every internal link crawled successfully.
- Each route has the required title pattern, one h1, ordered headings, `lang=en`,
  main/header/footer landmarks, description, canonical, Open Graph/Twitter
  data, favicon, and consistent Privacy/Terms links. The social image is
  1200×630 and the Apple icon is 180×180.
- SPA navigation pushes history, moves focus to `#main`, announces the new h1,
  and restores the root route through Back. The 390 px and 200% layouts have no
  horizontal overflow.
- Live axe-core scans found zero violations on root, demo, privacy, and terms.
  All exposed controls meet 44 px after excluding the intentionally hidden
  native checkbox inputs. Reduced-motion mode has no running animation.
  F-4-1 is a design-contract/readability defect that axe does not detect.
- The dark evidence desk, paper work surfaces, receipt-like folios, cyan/lime/
  coral signals, and original still life follow `.factory/design.md` and are
  visually distinct from a generic SaaS template.

## Quality gates

| Check | Result |
| --- | --- |
| Every exact claim command from a clean clone | PASS, 23/23 |
| `CI=1 npm test` | PASS, 9 unit/policy tests and 31 Chromium tests; F-4-1 documents the false-positive typography test |
| `npm run build` | PASS; `dist/` produced |
| Initial JavaScript | 56,145 B raw / 19,962 B gzip |
| CSS | 26,330 B raw / 6,512 B gzip |
| Live/candidate identity | PASS; JavaScript and CSS SHA-256 values match |
| 200-route console/page errors | PASS; none observed |
| Live axe serious/critical | PASS; zero (indeed zero violations) |

## Missed leverage and AI check

No missing obvious feature was identified. The brief calls for a local packet,
editable evidence checklist, attachments, missing-evidence list, and ZIP/PDF
handoff; all are present. JSON import/export and offline use already cover the
obvious portability need. Cloud sync would weaken the local-first promise, and
AI extraction is not required for the core organizing job. No runtime AI
feature, provider key, analytics script, or CDN dependency is present.

## What would make this perfect

Resolve F-4-1 through F-4-7, add the cleared-data claim test, make the readable-
text test wait for the final async demo state, regenerate the copy audit, deploy
the corrected build, and repeat this entire live review. Nothing else should
remain after that rerun.
