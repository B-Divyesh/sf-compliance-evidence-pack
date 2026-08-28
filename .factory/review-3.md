# Adversarial first-read review 3 — Deadline Packet

Reviewed 2026-08-28 at commit `89671c17ebe83497678fc36fbfcdb52b6ad39dad`
and against <https://compliance-evidence-pack.sociobot.in>. The live JavaScript
and CSS byte-match a clean build of that commit. No product code was changed.

## Verdict

**FAIL.** The core packet workflow, one-click sample, exports, offline behavior,
routes, and all 22 declared claim tests pass. Acceptance still fails because
demo mode reads and writes real license storage, a public storage claim is not
listed in `claims.json`, and earlier terminology finding F-1-19 remains partly
unfixed. Five additional copy and structure defects also remain. PASS requires
zero findings.

## Findings

### Blocking

#### F-3-1 — Demo mode reads and writes the real lifetime-license store

- **Exact location:** live `/demo`; the **Restore a lifetime license** control,
  `src/main.ts` startup, and the unprefixed `sb_license:compliance-evidence-pack`
  / `:verdict` localStorage keys in `src/license.ts`.
- **Evidence:** a fresh context seeded with a current real-license verdict
  opened `/demo` showing **Unlimited packets active**, proving the demo read
  real state. In another fresh context, restoring `demo-mode-write-marker`
  while the demo banner was visible wrote that value and a verification verdict
  to the unprefixed real keys. Both values remained after **Start for real**.
  Packet IndexedDB isolation, Reset demo, and demo exit otherwise passed.
- **Why this blocks:** the sandbox contract says nothing done in demo mode may
  read or persist to real storage. The current `demo-isolation` test checks only
  the real packet database, so it cannot detect this leak across the boundary.
- **Concrete fix:** hide real purchase/restore controls in demo mode or use
  `demo:sb_license:*` fixture keys and canned verification. Add a claim test
  that snapshots every real IndexedDB/localStorage key, restores a demo
  license, resets and exits, then proves the snapshot is byte-for-byte unchanged
  and that no Sociobot request occurred.

#### F-3-2 — The privacy page makes an unlisted license-storage claim

- **Exact quote/location:** live `/privacy`, “A lifetime-license token and its
  last verification result stay in localStorage.”
- **Why this blocks:** no `.factory/claims.json` entry owns this public storage
  promise. The untagged license-capture test checks the token only; it does not
  make the claim listed or prove retention/removal of both values. `localStorage`
  is also implementation jargon in user-facing policy copy.
- **Concrete fix:** write “Your lifetime-license token and its last check stay
  in this browser.” Add a `license-local-storage` claim and one tagged test that
  restores, reloads, verifies, removes, and inspects both keys in a real—not
  demo—workspace.

#### F-3-3 — Earlier finding F-1-19 is only partly fixed

- **Exact quotes/locations:** README, “A US$12 one-time license adds unlimited
  packets and duplication.” Live gated notice, “Unlimited packets require the
  one-time unlock.” Live restore feedback uses “Lifetime unlock restored” and
  “Lifetime unlock verified.” Landing and claims use **lifetime license**.
- **Why this blocks:** F-1-19 required **lifetime license** everywhere. A new
  visitor still has to decide whether a one-time license, unlock, and lifetime
  license are different products. The later polish reports marked this fixed,
  but the README and code confirm otherwise. The history rule makes a half-fixed
  earlier finding blocking again.
- **Concrete fix:** use **lifetime license** for the entitlement everywhere.
  Rewrite the README sentence as “A US$12 lifetime license adds unlimited
  packets and duplication.” Rewrite notices as “Unlimited packets require a
  lifetime license,” “Lifetime license restored,” and “Lifetime license
  verified.”

### Major

#### F-3-4 — The offline status is hidden on phones

- **Exact location:** live `/demo` at 390 px after a controlled offline reload.
  `#network-status` contains “Local Offline — edits still save,” but its computed
  `display` is `none`; `src/styles.css` hides `.status-badge` below 760 px.
- **Why this matters:** edits and ZIP export work offline, but a phone user gets
  no persistent labelled state confirming that. This contradicts the design
  contract’s persistent offline badge and removes useful feedback in the
  primary review viewport.
- **Concrete fix:** keep a compact visible **Offline — edits still save** badge
  on phones without displacing the three first-screen facts. Add a 390 px
  offline visibility assertion to `@claim:offline-reload`.

### Minor

#### F-3-5 — The sample summary has incorrect singular grammar

- **Exact quote/location:** live `/demo` packet summary, “1 open questions.”
- **Why this matters:** this is the product’s first realistic sample screen and
  the first quantitative summary a visitor reads.
- **Concrete fix:** pluralize by count: “1 open question”; otherwise “N open
  questions.” Add a seeded-summary text assertion.

#### F-3-6 — Search and social descriptions use jargon and an inconsistent term

- **Exact quotes/locations:** every route’s meta description, “Prepare a calm,
  local-first packet of filing-period evidence for your accountant.” Open Graph
  and Twitter descriptions, “Prepare invoices, receipts, gaps, and questions
  for accountant review.”
- **Why this matters:** “calm” is an unmeasurable marketing adjective,
  “local-first” is implementation/product jargon, and “gaps” breaks the declared
  public term **evidence gaps**.
- **Concrete fix:** meta: “Organize one filing period’s invoices, receipts,
  evidence gaps, and questions for accountant review.” Social: “Prepare
  invoices, receipts, evidence gaps, and questions for accountant review.”

#### F-3-7 — The Apple touch icon is not the required 180 px asset

- **Exact location:** every route links `apple-touch-icon` to
  `/icons/icon-192.png`; the file is 192×192.
- **Why this matters:** the site-structure contract requires a dedicated 180 px
  Apple touch icon.
- **Concrete fix:** export the existing original mark at 180×180 as
  `/icons/apple-touch-icon.png`, link it, and add a dimension check.

#### F-3-8 — The create dialog renames a packet as a folder

- **Exact quote/location:** landing **Start your packet** dialog eyebrow, “New
  filing folder.” The declared product term is **packet**.
- **Why this matters:** a first-time visitor should not have to decide whether
  a folder and a packet are different objects.
- **Concrete rewrite:** “New packet.”

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900 without scrolling.

| Question | Answer from the first screen | Exact cue |
| --- | --- | --- |
| What does it do? | Organizes evidence and questions for accountant review. | “Prepare evidence for your accountant.” |
| For whom? | Freelancers with cross-border income. | “For freelancers with cross-border income…” |
| What should I click first? | Try the realistic sample. | “Try it with sample data” plus “The sample opens with files, evidence gaps, and accountant questions.” |

The required privacy, offline, and price facts are also visible. Their mobile
bottom edges are 751.19, 781.98, and 837.58 px; the price now fits inside the
844 px screen. Desktop fact bottoms are 796.36, 827.16, and 857.95 px inside a
900 px screen. The first-read clarity gate passes.

## Copy audit

Counts below treat whitespace-separated text as words; standalone `+`, `/`,
and `·` marks count as displayed tokens. No sentence exceeds 22 words and no
banned plain-words term appears. Findings are attached to the exact affected
copy. Repeated visible phrases are marked once with their occurrence count.

### Landing page, metadata, dialog, and footer

| Exact copy | Words | Result |
| --- | ---: | --- |
| Deadline Packet | 2 | Pass |
| Skip to main content | 4 | Pass; skip-link result |
| Local Online | 2 | Pass; network status |
| Install app | 2 | Pass; result-naming action |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Evidence in order. | 3 | Pass |
| Questions in view. | 3 | Pass |
| Prepare evidence for your accountant. | 5 | Pass |
| For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 18 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Start your packet | 3 | Pass; result-naming action |
| The sample opens with files, evidence gaps, and accountant questions. | 9 | Pass |
| No account. | 2 | Pass |
| Data stays in this browser. | 5 | Pass |
| Works offline after your first visit. | 6 | Pass |
| One packet free. | 3 | Pass |
| Unlimited use costs US$12 once. | 5 | Pass |
| Import a JSON backup | 4 | Pass; result-naming action |
| A kraft evidence folder, receipts, invoice sheets, and a calculator arranged on a rain-dark night-market counter | 16 | Pass; meaningful image alt |
| From scattered evidence to one reviewable handoff. | 8 | Pass |
| Sample packet view | 3 | Pass |
| See the evidence gaps before handoff. | 6 | Pass |
| Files, checklist states, and questions stay together in one packet. | 10 | Pass |
| Open the sample packet → | 5 | Pass; result-naming action |
| Apr–Jun / Review desk | 4 | Pass |
| 3 of 7 evidence groups ready | 6 | Pass |
| Business expense receipts | 3 | Pass |
| Evidence gap (twice) | 2 | Pass |
| Relevant contracts | 2 | Pass |
| Which exchange-rate record should I use? | 6 | Pass |
| Open question | 2 | Pass |
| 2 attached sample files · Export bar ready | 8 | Pass |
| Set the period | 3 | Pass |
| Choose your own handoff date. | 5 | Pass |
| Gather the proof | 3 | Pass |
| See which checklist items are still missing. | 7 | Pass |
| Export one packet | 3 | Pass |
| ZIP + PDF index for review. | 6 | Pass |
| Built for human review | 4 | Pass |
| Not another filing portal. | 4 | Pass |
| Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 | Pass |
| It keeps evidence gaps and accountant questions in the same packet. | 11 | Pass |
| Stored in this browser | 4 | Pass |
| Attachments included in your ZIP | 5 | Pass |
| Evidence gaps follow the checklist | 5 | Pass |
| Open questions stay beside the files | 6 | Pass |
| Lifetime license | 2 | Pass |
| Keep every filing period | 4 | Pass |
| US$12 once. | 2 | Pass |
| Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 | Pass |
| Buy a lifetime license | 4 | Pass; result-naming action |
| Restore a lifetime license | 4 | Pass; result-naming action |
| License token | 2 | Pass |
| Verify and restore | 3 | Pass; result-naming action |
| Checkout opens on Sociobot/Dodo. | 4 | Pass |
| New filing folder | 3 | **F-3-8** |
| Start a packet | 3 | Pass |
| Close dialog | 2 | Pass; result-naming action |
| Packet name | 2 | Pass |
| Period starts | 2 | Pass |
| Period ends | 2 | Pass |
| Your handoff deadline | 3 | Pass |
| Use the date you want the packet with your accountant—not a statutory deadline. | 13 | Pass |
| Accountant or contact · Optional | 5 | Pass |
| This creates an organizational checklist, not a filing or legal determination. | 10 | Pass |
| Cancel | 1 | Pass; names the result |
| Create packet | 2 | Pass; result-naming action |
| Prepare filing-period evidence for accountant review. | 6 | Pass |
| Built by Param Factory · v1.0.0. | 6 | Pass |
| Original still-life artwork was AI-generated for Deadline Packet. | 8 | Pass |
| Prepare a calm, local-first packet of filing-period evidence for your accountant. | 11 | **F-3-6**, meta description |
| Prepare invoices, receipts, gaps, and questions for accountant review. | 9 | **F-3-6**, OG/Twitter description |

### README sentences

Inline commands and paths count as one technical token.

| Exact sentence | Words | Result |
| --- | ---: | --- |
| Prepare evidence packets for accountant review. | 6 | Pass |
| Deadline Packet organizes one filing period’s invoices, receipts, statements, evidence gaps, notes, and questions. | 14 | Pass |
| It exports them for accountant review. | 6 | Pass |
| It does not calculate tax, decide legal requirements, submit returns, or run OCR. | 13 | Pass |
| Stores packet details and attached files in this browser. | 9 | Pass |
| When supported, your browser encrypts attached files before storing them. | 10 | Pass |
| Builds an evidence-gap list from the editable checklist. | 8 | Pass |
| Exports an accountant ZIP, PDF index, and JSON backup you can import. | 12 | Pass |
| Keeps edits and exports working offline after the first visit. | 10 | Pass |
| Includes one packet free. | 4 | Pass |
| A US$12 one-time license adds unlimited packets and duplication. | 9 | **F-3-3 / F-1-19** |
| The app does not upload packet contents automatically. | 8 | Pass |
| The app contacts Sociobot only when you buy or verify a lifetime license. | 13 | Pass |
| Clearing browser site data removes local packets, so keep an exported backup somewhere safe. | 14 | Pass |
| Open `/demo` or `/?demo=1`. | 4 | Pass |
| It opens an Apr–Jun cross-border packet with two sample files, four evidence gaps, and two accountant questions. | 17 | Pass |
| Demo changes stay in a separate browser store named `deadline-packet-demo`. | 9 | Pass for packet data; F-3-1 covers shared license storage |
| Reset demo restores the sample. | 5 | Pass |
| Start for real deletes demo changes and opens your real workspace. | 11 | Pass for packet data; F-3-1 covers shared license storage |
| See the demo contract. | 4 | Pass |
| Requirements: Node.js 22+ and npm. | 5 | Pass |
| No backend or environment variable is required. | 7 | Pass |
| The project requires Playwright 1.58.2. | 5 | Pass |
| Install its Chromium binary outside the factory image with `npx playwright install chromium`. | 10 | Pass; contributor instruction |
| `npm test` runs TypeScript, Vitest, and Chromium coverage. | 8 | Pass; contributor instruction |
| Claim-specific commands are listed in `.factory/claims.json`. | 6 | Pass |
| The production build lands in `dist/`, with `index.html` at its root. | 10 | Pass |
| Build with `npm run build` and deploy `dist/` as a static site. | 10 | Pass |
| The build includes pages for the demo, policies, and 404 errors. | 11 | Pass |
| It also includes offline app files and Azure Static Web Apps configuration. | 11 | Pass; deployment context |
| The factory owns DNS and infrastructure. | 6 | Pass |
| `src/main.ts` — screens, demo seed, routing, and interaction logic. | 9 | Pass; project map |
| `src/db.ts` — isolated real/demo IndexedDB persistence and encryption. | 8 | Pass; project map |
| `src/export.ts` — ZIP, PDF, and JSON generation. | 7 | Pass; project map |
| `public/sw.js` — versioned offline shell and update lifecycle. | 8 | Pass; project map |
| `.factory/design.md` — product visual system and asset provenance. | 8 | Pass; project map |
| `.factory/handoff.md` — exact release verification evidence. | 6 | Pass; project map |
| Read the in-app `/privacy` and `/terms` pages. | 7 | Pass |
| The software is an organizational tool, not tax, accounting, or legal advice. | 12 | Pass |
| MIT — see LICENSE. | 4 | Pass |

README headings and labels are clear in isolation: **Deadline Packet** (2),
**Live product** (2), **One-click demo** (2), **What it does** (3), **Try the
isolated demo** (4), **Run locally** (2), **Test and build** (3), **Deploy**
(1), **Project map** (2), **Privacy and law** (3), and **License** (1). No
README button exists. All landing buttons name their result; F-3-3 and F-3-8
are the terminology failures.

## Demo and sandbox

- One click from the cold landing opens `/demo` and immediately shows **Apr–Jun
  cross-border evidence**, 2 files, 4 evidence gaps, and 2 accountant questions.
  The banner says “Demo — sample data, nothing is saved to your real packets”
  and exposes **Reset demo** and **Start for real**.
- After a checklist edit and added question, Reset removed the question and
  restored the unchecked sample item. A valid real packet remained unchanged.
  Start for real removed `deadline-packet-demo`, discarded the demo-only
  question, and reopened the valid real packet.
- After service-worker control, a network-intercepted offline reload retained
  the sample, accepted a checklist edit, and downloaded
  `apr-jun-cross-border-evidence-accountant-packet.zip`. The full packet flow
  requested only the product origin.
- The packet database and `demo:deadline-packet:current` key are separate.
  F-3-1 records the remaining real-license-storage breach. F-3-4 records the
  hidden phone status.

The sample is realistic and immediately usable. The one-click demo gate passes;
the sandbox-isolation gate does not.

## Declared claims

A clean clone at `/tmp/compliance-evidence-pack-review3-ZNbO9h` ran `npm ci`,
then every exact `test` command from `.factory/claims.json` separately.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS, 1/1; test is too narrow for F-3-1 |
| `demo-seed` | PASS, 1/1 |
| `privacy-local` | PASS, 1/1 |
| `encrypted-storage` | PASS, 1/1 |
| `packet-exports` | PASS, 1/1 |
| `missing-evidence` | PASS, 1/1 |
| `offline-reload` | PASS, 1/1 |
| `free-and-paid` | PASS, 1/1; hosted checkout shows $12.00 |
| `account-free` | PASS, 1/1 |
| `file-size-limit` | PASS, 1/1 |
| `tracker-free` | PASS, 1/1 |
| `local-retention` | PASS, 1/1 |
| `license-nonblocking` | PASS, 1/1 |
| `license-network-boundary` | PASS, 1/1 |
| `editable-handoff-date` | PASS, 1/1 |
| `question-retention` | PASS, 1/1 |
| `demo-exit` | PASS, 1/1 |
| `no-tax-calculation` | PASS, 1/1 |
| `no-legal-determination` | PASS, 1/1 |
| `no-document-validation` | PASS, 1/1 |
| `no-return-submission` | PASS, 1/1 |
| `no-ocr` | PASS, 1/1 |

Every claim tag occurs exactly once. No listed claim test failed. The public
license-storage sentence in F-3-2 is the unlisted claim. `CI=1 npm test` also
passed 7 unit/policy tests and all 30 Chromium tests. `npm run build` produced
`dist/`; JS is 54,324 bytes raw / 19.76 kB gzip.

## Earlier-finding reconciliation

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. Each numbered
review finding was checked against the current live site and code/tests.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: 10 rapid checklist/question submissions persist after reload. |
| F-1-2 | Fixed: observable sample wording and `demo-seed` pass. |
| F-1-3 | Fixed: README counts match the live sample and tagged test. |
| F-1-4 | Fixed: chosen and edited handoff dates persist. |
| F-1-5 | Fixed: questions persist beside files. |
| F-1-6 | Fixed for packet data: demo exit restores a valid real packet; F-3-1 is the newly exposed license-store boundary. |
| F-1-7 | Fixed: the licensed request boundary test passes. |
| F-1-8 | Fixed: merchant/refund claims remain absent. |
| F-1-9 | Fixed: unproved retry wording remains absent. |
| F-1-10 | Fixed: retention test clears IndexedDB, Cache Storage, and localStorage. |
| F-1-11 | Fixed: no visible readable text below 16 px at 390 px. |
| F-1-12 | Fixed: all facts end above 900 px on desktop. |
| F-1-13 | Fixed: Demo, Privacy, and Terms remain visible at 390 px. |
| F-1-14 | Fixed: product preview precedes the three-step band. |
| F-1-15 | Fixed: the demo h1 precedes all h2/h3 headings. |
| F-1-16 | Fixed: “accountant-ready” is absent from landing and README. |
| F-1-17 | Fixed: the checklist step states its observable result. |
| F-1-18 | Fixed: boundary copy names gaps and questions. |
| F-1-19 | **BLOCKING / half-fixed: F-3-3.** README and live status messages still use license/unlock variants. |
| F-1-20 | Fixed: public missing-item language uses evidence gap. |
| F-1-21 | Fixed: landing says “Stored in this browser.” |
| F-1-22 | Fixed: README uses browser-facing storage wording. |
| F-1-23 | Fixed: README explains encryption without algorithm jargon. |
| F-1-24 | Fixed for packet data: separate demo browser store is documented and observed. |
| F-1-25 | Fixed: README names Playwright 1.58.2 explicitly. |
| F-1-26 | Fixed: build/deploy copy is split below 22 words. |
| F-1-27 | Fixed: disclosure says “Restore a lifetime license.” |
| F-2-1 | Fixed: phone price fact ends at 837.58 px in the 844 px viewport. |

The prior unnumbered verification defects also remain covered by the 30-test
suite: real 404, malformed import recovery, whitespace-name validation, 200%
reflow, 44 px targets, focus/announcement, destructive confirmation, update
flow, CSP/cache/MIME, and checkout price.

## Structure, accessibility, and identity

- `/`, `/demo`, `/privacy`, `/terms`, and a missing route return the expected
  200/404 statuses, route-specific titles, one h1, `lang=en`, main landmark,
  canonical, description, OG/Twitter image, SVG favicon, and consistent
  header/footer. F-3-6 and F-3-7 record the metadata/icon exceptions.
- SPA navigation moves focus to `#main`, updates the live announcement, and
  browser Back restores the root title, focus, and announcement. Direct deep
  links work. Every internal link returned 200; checkout returned its expected
  303 to Dodo. No dead link was found.
- Fresh Playwright axe scans found zero serious/critical issues on all five
  routes. The factory URL verifier reported one h1, title/lang/main/alt success,
  zero console errors, and a 684 ms load. At 390 px there is no overflow, all
  exposed targets are at least 44 px, 200% text reflows, reduced motion is
  covered, and visible text is at least 16 px.
- The night-market desk, receipt geometry, paper surfaces, cyan/lime/coral
  signals, original folder mark, and disclosed still life are recognizably
  product-specific. It is not a generic centered SaaS template.

## Missed leverage and AI check

No missed-leverage finding. JSON import/backup and ZIP/PDF exports implement
the obvious handoff loop. Cross-device sync would weaken the explicit local
privacy model unless introduced as a separate opt-in feature. AI is not needed
to organize user-selected evidence and could imply legal or sufficiency
judgment; there is no runtime AI call, provider key, Azure endpoint, or
decorative AI control. The build-time still-life provenance is disclosed.

## What would make this perfect

Isolate or remove license actions from demo mode and expand the isolation test
to every browser store. List and test the public license-storage claim. Finish
F-1-19 by using **lifetime license** everywhere. Keep the offline badge visible
on phones, pluralize the sample summary, rewrite metadata in plain consistent
terms, provide the 180 px Apple icon, and rename “New filing folder” to “New
packet.” Re-run every claim and the full live review; PASS is appropriate only
when none of these findings remains.
