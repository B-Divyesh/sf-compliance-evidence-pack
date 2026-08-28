# First-read review 2 — Deadline Packet

Reviewed 2026-08-28 against `e07c4ab714a606690820c1aea4e5e7f116f5e44d` and <https://compliance-evidence-pack.sociobot.in>.

## Verdict

**FAIL.** F-2-1 remains. All declared claims passed; the demo is realistic and isolated; the remaining copy, route, history, and visual checks pass.

## Findings

### Major

#### F-2-1 — The 390 px first screen hides the price fact

- **Exact quote/location:** landing hero, “One packet free. Unlimited use costs US$12 once.”
- **Evidence:** at 390 × 844, its rectangle starts at 839.98 px and ends at 889.58 px. The first two facts end at 803.19 px and 833.98 px. See [mobile cold screen](./qa-artifacts/review-2-first-read-mobile.png).
- **Why this matters:** the required first screen must show privacy, offline, and price facts together. A visitor can identify the job and try the demo, but must scroll to see price.
- **Concrete fix:** reduce mobile hero vertical space or compact the facts so every `.hero-facts li` ends at or before 844 px. Add a 390 × 844 bounding-rectangle regression test.

## Cold first read

Fresh Chromium contexts, no saved data and no scrolling:

| Viewport | What it does | Who it is for | First action |
| --- | --- | --- | --- |
| 390 × 844 | Organizes evidence and questions into a packet for accountant review. | Freelancers with cross-border income. | **Try it with sample data**. |
| 1440 × 900 | Same. | Same. | **Try it with sample data**. |

The exact cues are “Prepare evidence for your accountant.”, “For freelancers with cross-border income…”, and “Try it with sample data”. The first-read clarity gate passes. [Desktop evidence](./qa-artifacts/review-2-first-read-desktop.png) shows all facts; F-2-1 is mobile-only.

## Copy audit

Word counts treat hyphens and prices as one word. No landing or README sentence exceeds 22 words; no banned marketing word, inconsistent public term, unclear heading, or non-result-naming button was found. The development jargon in README is limited to installation/test/deployment instructions.

### Landing sentences

| Text | Words |
| --- | ---: |
| Evidence in order. | 3 |
| Questions in view. | 3 |
| Prepare evidence for your accountant. | 5 |
| For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 18 |
| The sample opens with files, evidence gaps, and accountant questions. | 9 |
| No account. | 2 |
| Data stays in this browser. | 5 |
| Works offline after your first visit. | 6 |
| One packet free. | 3 |
| Unlimited use costs US$12 once. | 5 |
| From scattered evidence to one reviewable handoff. | 8 |
| See the evidence gaps before handoff. | 6 |
| Files, checklist states, and questions stay together in one packet. | 9 |
| 3 of 7 evidence groups ready | 7 |
| Business expense receipts | 3 |
| Evidence gap | 2 |
| Relevant contracts | 2 |
| Which exchange-rate record should I use? | 6 |
| Open question | 2 |
| 2 attached sample files · Export bar ready | 7 |
| Choose your own handoff date. | 5 |
| See which checklist items are still missing. | 7 |
| ZIP + PDF index for review. | 6 |
| Not another filing portal. | 4 |
| Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 |
| It keeps evidence gaps and accountant questions in the same packet. | 11 |
| Stored in this browser | 4 |
| Attachments included in your ZIP | 5 |
| Evidence gaps follow the checklist | 5 |
| Open questions stay beside the files | 6 |
| US$12 once. | 2 |
| Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 |
| Checkout opens on Sociobot/Dodo. | 4 |
| Prepare filing-period evidence for accountant review. | 6 |
| Built by Param Factory. | 4 |
| Original still-life artwork was AI-generated for Deadline Packet. | 8 |

Labels/buttons reviewed: **Try it with sample data**, **Start your packet**, **Import a JSON backup**, **Sample packet view**, **Open the sample packet**, **Apr–Jun / Review desk**, **Set the period**, **Gather the proof**, **Export one packet**, **Built for human review**, **Lifetime license**, **Keep every filing period**, **Buy a lifetime license**, and **Restore a lifetime license**. Each is clear in context; the actions name their result. Terms remain consistent: packet, evidence gap, accountant, demo, lifetime license.

### README sentences

| Text | Words |
| --- | ---: |
| Prepare evidence packets for accountant review. | 6 |
| Deadline Packet organizes one filing period’s invoices, receipts, statements, evidence gaps, notes, and questions. | 14 |
| It exports them for accountant review. | 6 |
| It does not calculate tax, decide legal requirements, submit returns, or run OCR. | 13 |
| Stores packet details and attached files in this browser. | 9 |
| When supported, your browser encrypts attached files before storing them. | 10 |
| Builds an evidence-gap list from the editable checklist. | 8 |
| Exports an accountant ZIP, PDF index, and JSON backup you can import. | 12 |
| Keeps edits and exports working offline after the first visit. | 10 |
| Includes one packet free. | 4 |
| A US$12 one-time license adds unlimited packets and duplication. | 9 |
| The app does not upload packet contents automatically. | 8 |
| The app contacts Sociobot only when you buy or verify a lifetime license. | 13 |
| Clearing browser site data removes local packets, so keep an exported backup somewhere safe. | 14 |
| Open `/demo` or `/?demo=1`. | 4 |
| It opens an Apr–Jun cross-border packet with two sample files, four evidence gaps, and two accountant questions. | 17 |
| Demo changes stay in a separate browser store named `deadline-packet-demo`. | 9 |
| Reset demo restores the sample. | 5 |
| Start for real deletes demo changes and opens your real workspace. | 11 |
| See the demo contract. | 5 |
| Requirements: Node.js 22+ and npm. | 5 |
| No backend or environment variable is required. | 7 |
| The project requires Playwright 1.58.2. | 5 |
| Install its Chromium binary outside the factory image with `npx playwright install chromium`. | 10 |
| `npm test` runs TypeScript, Vitest, and Chromium coverage. | 8 |
| Claim-specific commands are listed in `.factory/claims.json`. | 6 |
| The production build lands in `dist/`, with `index.html` at its root. | 10 |
| Build with `npm run build` and deploy `dist/` as a static site. | 10 |
| The build includes pages for the demo, policies, and 404 errors. | 11 |
| It also includes offline app files and Azure Static Web Apps configuration. | 11 |
| The factory owns DNS and infrastructure. | 6 |
| Read the in-app `/privacy` and `/terms` pages. | 7 |
| The software is an organizational tool, not tax, accounting, or legal advice. | 12 |
| MIT — see LICENSE. | 4 |

## Demo, claims, and sandbox

- One click from cold root opens `/demo` with a working Apr–Jun packet, two files, four evidence gaps, and two accountant questions. [Mobile demo evidence](./qa-artifacts/review-2-demo-mobile.png).
- The persistent banner says “Demo — sample data, nothing is saved to your real packets.” Reset restores the seed. A live exercise preserved `Review real packet` while resetting demo work; Start for real removed `deadline-packet-demo` and reopened that real packet.
- Source confirms separate `deadline-packet-demo` / `demo:deadline-packet:current` storage. Live network recording contained only the product origin. An offline service-worker reload accepted an edit, exported a ZIP, and showed “Offline — edits still save”.
- All 22 exact `.factory/claims.json` commands passed individually after `npm ci`: `demo-isolation`, `demo-seed`, `privacy-local`, `encrypted-storage`, `packet-exports`, `missing-evidence`, `offline-reload`, `free-and-paid`, `account-free`, `file-size-limit`, `tracker-free`, `local-retention`, `license-nonblocking`, `license-network-boundary`, `editable-handoff-date`, `question-retention`, `demo-exit`, `no-tax-calculation`, `no-legal-determination`, `no-document-validation`, `no-return-submission`, and `no-ocr`.
- `npm test` passed: TypeScript, 7 Vitest/policy tests, and 30 Chromium tests. `npm run build` passed and produced `dist/`.
- Landing, README, privacy, and terms claims map to those entries. No unlisted-claim finding was identified.

## Structure and identity

- Direct checks of `/`, `/demo`, `/privacy`, `/terms`, and an unknown path found route-specific titles, one h1, description, canonical, Open Graph image/title, favicon, `lang=en`, consistent header/footer, and no 390 px horizontal overflow. The unknown path returns a styled HTTP 404.
- Crawl: every internal link returned 200; checkout returned the expected 303 to Sociobot/Dodo. Keyboard route navigation/Back, dialog behavior, 44 px controls, 200% reflow, reduced motion, and serious/critical axe checks pass in the browser suite.
- The dark desk, paper surfaces, receipt folios, cyan/lime/coral signals, and disclosed original night-market still life conform to `.factory/design.md` and are distinct from a generic SaaS template. No runtime AI feature or provider key exists; AI is not required for this local evidence-organizing job.

## Earlier-finding reconciliation

Every prior review, verification, polish, and handoff document was read. Each prior review finding was confirmed on the live product and in the current code/tests:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Ten rapid checklist/question additions persist after reload. |
| F-1-2 | Landing seed wording is observable and `demo-seed` passes. |
| F-1-3 | README seed counts are covered by `demo-seed`. |
| F-1-4 | Editable-date creation, update, and persistence pass. |
| F-1-5 | Question retention passes before and after reload. |
| F-1-6 | Start for real removes only demo work. |
| F-1-7 | Sociobot license-network boundary passes. |
| F-1-8 | Unverified merchant/refund wording is absent. |
| F-1-9 | Unproved retry wording is absent; non-blocking verification passes. |
| F-1-10 | Retention test clears IndexedDB, cache, and localStorage. |
| F-1-11 | Current 390 px readable-text test passes. |
| F-1-12 | All facts fit desktop; F-2-1 is separate mobile geometry. |
| F-1-13 | Demo, Privacy, and Terms are visible at 390 px. |
| F-1-14 | Preview precedes the three-step section. |
| F-1-15 | Demo h1 precedes its section headings. |
| F-1-16 | “Accountant-ready” is absent from landing/README copy. |
| F-1-17 | The checklist step uses the concrete missing-items wording. |
| F-1-18 | Boundary copy names gaps and questions directly. |
| F-1-19 | Paid capability consistently says lifetime license. |
| F-1-20 | Missing-item concept consistently says evidence gap. |
| F-1-21 | Landing says “Stored in this browser”. |
| F-1-22 | README storage copy is user-facing. |
| F-1-23 | README encryption copy is user-facing. |
| F-1-24 | Demo documentation explains separate stores. |
| F-1-25 | README names the required Playwright version. |
| F-1-26 | Build/deploy copy uses short sentences. |
| F-1-27 | Disclosure says “Restore a lifetime license”. |

The unnumbered verification findings are also confirmed through their current tests: claim/demo/CSP/cache/title/404/manifest/update checks, checkout price, rapid edits, 200% reflow, targets, route focus, deletion confirmation, malformed import recovery, whitespace-only names, and copy audit. F-2-1 is new mobile geometry, not the resolved desktop condition in F-1-12.

## What would make this perfect

Fit all three hero facts within 390 × 844, add the geometry regression test, deploy it, and repeat this fresh-context review. With F-2-1 resolved and no new finding, the verdict can be PASS.
