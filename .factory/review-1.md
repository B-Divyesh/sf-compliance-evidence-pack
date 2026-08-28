# Adversarial first-read review 1 — Deadline Packet

Reviewed 2026-08-28 at commit `629f2d185b9121ef5f87def5d2e39a75651560d1`
and against <https://compliance-evidence-pack.sociobot.in>. The live JavaScript,
CSS, and social image byte-match the build from this commit. No product code
was changed.

## Verdict

**FAIL.** A normal rapid interaction still loses a submitted accountant
question. The earlier claim-inventory and minimum-type findings are also only
partly fixed. The demo itself is immediate, realistic, isolated, resettable,
and usable offline, but a PASS requires zero findings.

## Findings

### Blocking

#### F-1-1 — A rapid checklist edit can discard a submitted question

- **Exact location:** live `/demo`; check **Business expense receipts**, type
  into **Question for your accountant**, then activate **Add question** without
  waiting.
- **Evidence:** the submitted question was absent in 2 of 10 fresh concurrent
  contexts. A separate serial probe also failed once in three contexts. A
  capture of the replaced, empty form and its native required-field error is
  [here](./qa-artifacts/review-1-rapid-question-loss.png).
- **Why this blocks:** the visitor receives no saved question and no recovery
  message. This repeats the earlier “normal rapid edits still discard entered
  questions” blocker from `verification-3.md`. The current regression test
  loops only once, so `npm test` can pass while the race remains.
- **Concrete fix:** keep the active form node stable while a prior save renders,
  or serialize mutation, render, focus, and subsequent event handling so a
  click can never land on a replaced empty form. Add a deterministic test that
  pauses the checklist save/render between pointer down and question submit,
  plus a repeated stress case that must preserve every submitted question
  before and after reload.

#### F-1-2 — The landing demo promise is unlisted and contradicts the sample state

- **Exact quote/location:** landing, “The sample opens as a complete working
  packet.”
- **Why this blocks:** there is no matching claim entry. “Complete” also reads
  as evidence-complete, while the opened packet says **43%**, **3 of 7 evidence
  groups ready**, and **4 evidence gaps**. This keeps the earlier P0 “claim
  inventory is incomplete” finding open.
- **Concrete fix:** use “The sample opens with files, evidence gaps, and
  accountant questions.” Add a `demo-seed` claim whose test asserts those items
  are visible on the first demo screen.

#### F-1-3 — The README's quantified demo seed is an unlisted claim

- **Exact quote/location:** README, “It starts with a realistic Apr–Jun
  cross-border packet, two sample evidence files, four gaps, and two accountant
  questions.”
- **Why this blocks:** existing tests happen to assert parts of this sentence,
  but `.factory/claims.json` has no claim for the complete public promise.
- **Concrete fix:** change “realistic” to the observable contents and add the
  same `demo-seed` entry/test proposed in F-1-2, asserting all counts together.

#### F-1-4 — The editable handoff-date claim is unlisted

- **Exact quotes/locations:** landing, “Choose your own handoff date.” Terms,
  “Deadlines are dates you enter.”
- **Why this blocks:** no claim entry or tagged test proves that a visitor can
  set and later change this date.
- **Concrete fix:** add `editable-handoff-date` and test creation, editing,
  persistence after reload, and the displayed deadline.

#### F-1-5 — Keeping accountant questions is an unlisted claim

- **Exact quote/location:** landing, “Open questions kept beside the files.”
- **Why this blocks:** no claims entry covers question creation or retention;
  F-1-1 shows this promise can fail during ordinary use.
- **Concrete fix:** add `question-retention` and a deterministic test for rapid
  creation, display, and reload persistence after the race is repaired.

#### F-1-6 — “Start for real” makes an unlisted and sometimes false promise

- **Exact quote/location:** README, “Start for real clears demo data and opens
  the real, empty workspace.”
- **Why this blocks:** no claim test checks demo-store deletion on exit. “Empty”
  is false for a returning visitor who already has a real packet.
- **Concrete fix:** write “Start for real deletes demo changes and opens your
  real workspace.” Add `demo-exit` and assert the demo database/key are removed
  while a pre-existing real packet is unchanged and shown.

#### F-1-7 — The third-party network boundary is unlisted

- **Exact quotes/locations:** README, “License purchase and verification are
  the only optional third-party requests.” README, “Billing verification
  contacts the public Sociobot API only when a license token exists.”
- **Why this blocks:** tracker and local-data tests cover unlicensed flows;
  none inventories the complete licensed flow or owns these sentences.
- **Concrete fix:** use “The app contacts Sociobot only when you buy or verify a
  license.” Add `license-network-boundary`; intercept a purchase/verification
  flow and assert the destination, request contents, and absence of any other
  third-party request.

#### F-1-8 — Merchant and refund statements are unlisted

- **Exact quotes/locations:** landing, “Checkout is hosted by Sociobot/Dodo,
  the merchant of record. Refunds are handled there.” Terms also says refunds
  revoke the associated license.
- **Why this blocks:** `free-and-paid` proves the hosted Dodo page and price,
  but it does not prove merchant-of-record status, refund handling, or license
  revocation.
- **Concrete fix:** if only the tested host is needed, write “Checkout opens on
  Sociobot/Dodo.” Otherwise add an authoritative billing-policy claim and test
  the refund/revocation behavior against a recorded Sociobot fixture.

#### F-1-9 — License retry behavior is unlisted

- **Exact quote/location:** Privacy, “License verification is retried when a
  network is available and never blocks the free experience.”
- **Why this blocks:** `license-nonblocking` tests only the second clause. No
  claim or test proves retry after connectivity returns.
- **Concrete fix:** split the sentence. Keep the tested non-blocking clause and
  add `license-retry-online` with an offline-to-online verification test, or
  remove the retry clause.

#### F-1-10 — The listed retention test does not test clearing site storage

- **Exact quotes/locations:** README, “Clearing browser site data removes local
  packets…” Privacy, “Data remains until you delete a packet, clear this site’s
  browser storage, or uninstall it and clear its data.”
- **Why this blocks:** `@claim:local-retention` creates, reloads, and deletes a
  packet through the UI. It never clears browser storage, which is part of the
  listed claim. The command passes without proving the whole promise.
- **Concrete fix:** extend that tagged test to clear IndexedDB, Cache Storage,
  and localStorage in a fresh context, then verify the packet cannot reappear.

#### F-1-11 — Text remains below the product's 16 px minimum

- **Exact location:** live 390 px pages. **Buy lifetime access**, **Verify and
  restore**, and **Start for real** render at 14.08 px. Demo dates, checklist
  states, file metadata, and question states render at 13.33 px. The wordmark's
  “Deadline” renders at 15.68 px.
- **Why this blocks:** `.factory/design.md` says “Body is never below 16 px.”
  This is the unfixed typography half of the earlier `verification-3.md`
  finding “undersized text and one undersized mobile target remain.” Targets
  are now 44 px, but the type contract is still broken.
- **Concrete fix:** set all readable labels, metadata, statuses, and control
  text to at least 16 CSS px at 390 px, then add a computed-style assertion for
  every visible text-bearing element on landing and demo routes.

### Major

#### F-1-12 — The three required hero facts do not fit the desktop first screen

- **Exact location:** cold root at 1440×900 before scrolling. “No account. Data
  stays in this browser.” starts at 879 px and ends below the viewport; the
  offline and price facts start at 910 px and 941 px.
- **Why this matters:** the required privacy/offline/price facts are not all on
  the first screen. The 390×844 layout does show all three.
- **Concrete fix:** reduce desktop hero top spacing/headline size or tighten the
  hero layout so all three facts end above 900 px without shrinking body copy.

#### F-1-13 — Mobile removes all header navigation links

- **Exact location:** `src/styles.css` under `@media (max-width: 760px)` sets
  `.site-header nav > a` to `display: none`; live 390 px header shows only the
  wordmark and network badge.
- **Why this matters:** Demo, Privacy, and Terms disappear from the header on
  every phone route. The required consistent header navigation is not usable.
- **Concrete fix:** provide a keyboard- and screen-reader-operable compact menu,
  or keep the three links visible in a wrapping/scrolling mobile nav.

#### F-1-14 — The landing skeleton has no product preview

- **Exact location:** after the hero, the page jumps directly to the three-step
  band. The hero contains a still-life image, not the product or a live preview.
- **Why this matters:** the standard skeleton requires “The product itself or a
  live preview of it” before “How it works.” A visitor must leave the landing
  page to see the working interface.
- **Concrete fix:** place a read-only slice of the seeded evidence map, live gap
  list, and export bar between the hero and the three steps, with a direct demo
  action.

#### F-1-15 — The demo heading outline starts with an h2 before its h1

- **Exact location:** desktop `/demo` DOM order is `h2 Keep every filing period`
  in the packet drawer, then `h1 Apr–Jun cross-border evidence` in the workbench.
- **Why this matters:** the page's primary heading is not first in the heading
  outline, so the hierarchy is confusing when headings are navigated alone.
- **Concrete fix:** render the workbench h1 before sidebar subheadings in DOM
  order, or make the compact license label non-heading text.

### Minor copy findings

#### F-1-16 — “Accountant-ready” overstates what the tool verifies

- **Exact quotes/locations:** landing lede, “accountant-ready packet”; README
  summary, “accountant-ready evidence packets.”
- **Why this matters:** the product later says it does not validate document
  sufficiency. “Ready” can imply that validation already happened.
- **Concrete rewrite:** “For freelancers with cross-border income, organize one
  filing period’s invoices, receipts, evidence gaps, and questions for
  accountant review.” README: “Prepare evidence packets for an accountant to
  review.”

#### F-1-17 — “Without guesswork” is subjective marketing copy

- **Exact quote/location:** landing step, “Mark gaps without guesswork.”
- **Why this matters:** users define the checklist themselves, so the product
  cannot remove all guesswork.
- **Concrete rewrite:** “See which checklist items are still missing.”

#### F-1-18 — “Clearly labelled” is vague and unproved

- **Exact quote/location:** landing boundary section, “It helps you arrive at
  the accountant conversation with the evidence—and the unknowns—clearly
  labelled.”
- **Why this matters:** “clearly” is subjective and the sentence does not name
  the actual product behavior.
- **Concrete rewrite:** “It keeps evidence gaps and accountant questions in the
  same packet.”

#### F-1-19 — The paid entitlement has four names

- **Exact locations:** “Optional lifetime unlock,” “lifetime license,” “Buy
  lifetime access,” and README “one-time license.”
- **Why this matters:** a visitor cannot tell whether access, unlock, and
  license are different purchases.
- **Concrete fix:** use **lifetime license** everywhere; label the action “Buy a
  lifetime license” and the restore disclosure “Restore a lifetime license.”

#### F-1-20 — The missing-item concept has several names

- **Exact locations:** landing/README use “gaps,” “evidence gaps,” “missing
  evidence,” “missing items,” and “missing-evidence list.”
- **Why this matters:** `.factory/copy-audit.md` declares **evidence gap** as the
  single term, but the public copy does not follow it.
- **Concrete fix:** use **evidence gap** / **evidence gaps** throughout. For
  example, “Builds an evidence-gap list from the checklist.”

#### F-1-21 — The landing exposes implementation jargon

- **Exact quote/location:** landing feature list, “Local IndexedDB storage.”
- **Why this matters:** a first-time freelancer should not need to know a
  browser database API.
- **Concrete rewrite:** “Stored in this browser.”

#### F-1-22 — The README storage sentence uses unexplained jargon

- **Exact quote/location:** “Stores packet data and attachments in IndexedDB on
  this device.”
- **Why this matters:** “IndexedDB” names an implementation but does not tell a
  non-developer where the files are or whether they leave the browser.
- **Concrete rewrite:** “Stores packet details and attached files in this
  browser.” Put the IndexedDB name in the technical project map if needed.

#### F-1-23 — The README encryption sentence leads with implementation terms

- **Exact quote/location:** “Encrypts attachment bytes with device-local
  AES-256-GCM when Web Crypto is available.”
- **Why this matters:** “attachment bytes,” “AES-256-GCM,” and “Web Crypto” make
  the safety point harder to understand on a first read.
- **Concrete rewrite:** “When supported, your browser encrypts attached files
  before storing them.” Keep the algorithm in `/privacy` for readers who need
  it.

#### F-1-24 — The README demo-storage sentence is implementation-first

- **Exact quote/location:** “Demo work uses the separate
  `deadline-packet-demo` IndexedDB database.”
- **Why this matters:** the storage engine name obscures the useful assurance
  that demo changes are separated from real work.
- **Concrete rewrite:** “Demo changes stay in a separate browser store named
  `deadline-packet-demo`.”

#### F-1-25 — “Pinned” is unexplained tooling jargon

- **Exact quote/location:** README, “Playwright 1.58.2 is pinned.”
- **Why this matters:** a contributor must infer that “pinned” means this exact
  version is required.
- **Concrete rewrite:** “The project requires Playwright 1.58.2.”

#### F-1-26 — One README sentence exceeds 22 words and stacks build jargon

- **Exact quote/location:** “The generated output includes direct demo and
  policy entries, a designed 404, the PWA shell, and
  `staticwebapp.config.json` for routing, MIME types, cache rules, and security
  headers.” (26 words)
- **Why this matters:** the sentence exceeds the hard cap and combines five
  deployment concepts, so a contributor must unpack it twice.
- **Concrete rewrite:** “The build includes pages for the demo, policies, and
  404 errors. It also includes offline app files and Azure Static Web Apps
  configuration.”

#### F-1-27 — The license disclosure does not name its result

- **Exact quote/location:** landing interactive summary, “Already bought it?”
- **Why this matters:** expanding it reveals license restoration, but the label
  does not say that.
- **Concrete rewrite:** “Restore a lifetime license.”

## Cold first read

Fresh contexts were opened at 390×844 and 1440×900 without scrolling.

- **What it does:** organizes one filing period's invoices, receipts, evidence
  gaps, and questions into a packet for accountant review.
- **For whom:** freelancers with cross-border income.
- **First click:** **Try it with sample data**; the adjacent line says what the
  sample opens.

All three questions are answerable from both first screens, so the mandatory
first-read comprehension gate itself passes. Evidence:
[390 px](./qa-artifacts/review-1-first-read-mobile.png) and
[desktop](./qa-artifacts/review-1-first-read-desktop.png). F-1-12 covers the
separate three-facts layout failure.

## Copy audit

Counts use whitespace-separated words, matching the repository audit's
treatment of hyphenated terms. UI headings and actions are included because
they must also make sense in isolation. Landing average: 5.2 words across 42
units. README average: 7.6 words across 53 units. Only README item 40 exceeds
22 words.

### Landing page

| # | Exact copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Evidence in order. | 3 | — |
| 2 | Questions in view. | 3 | — |
| 3 | Prepare evidence for your accountant. | 5 | — |
| 4 | For freelancers with cross-border income, turn one filing period’s invoices, receipts, gaps, and questions into an accountant-ready packet. | 18 | F-1-16, F-1-20 |
| 5 | Try it with sample data | 5 | — |
| 6 | Start your packet | 3 | — |
| 7 | The sample opens as a complete working packet. | 8 | F-1-2 |
| 8 | No account. | 2 | — |
| 9 | Data stays in this browser. | 5 | — |
| 10 | Works offline after your first visit. | 6 | — |
| 11 | One packet free. | 3 | — |
| 12 | Unlimited use costs US$12 once. | 5 | — |
| 13 | Import a JSON backup | 4 | — |
| 14 | From scattered evidence to one reviewable handoff. | 7 | — |
| 15 | How it works | 3 | — |
| 16 | Set the period | 3 | — |
| 17 | Choose your own handoff date. | 5 | F-1-4 |
| 18 | Gather the proof | 3 | — |
| 19 | Mark gaps without guesswork. | 4 | F-1-17, F-1-20 |
| 20 | Export one packet | 3 | — |
| 21 | ZIP + PDF index for review. | 6 | — |
| 22 | Built for human review | 4 | — |
| 23 | Not another filing portal. | 4 | — |
| 24 | Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 | — |
| 25 | It helps you arrive at the accountant conversation with the evidence—and the unknowns—clearly labelled. | 14 | F-1-18 |
| 26 | Local IndexedDB storage | 3 | F-1-21 |
| 27 | Attachments included in your ZIP | 5 | — |
| 28 | Missing evidence listed automatically | 4 | F-1-20 |
| 29 | Open questions kept beside the files | 6 | F-1-5 |
| 30 | Optional lifetime unlock | 3 | F-1-19 |
| 31 | Keep every filing period | 4 | — |
| 32 | US$12 once. | 2 | — |
| 33 | Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 | F-1-19 |
| 34 | Buy lifetime access | 3 | F-1-19 |
| 35 | Already bought it? | 3 | F-1-27 |
| 36 | Checkout is hosted by Sociobot/Dodo, the merchant of record. | 9 | F-1-8 |
| 37 | Refunds are handled there. | 4 | F-1-8 |
| 38 | Prepare filing-period evidence for accountant review. | 6 | — |
| 39 | Privacy | 1 | — |
| 40 | Terms | 1 | — |
| 41 | Built by Param Factory · v1.0.0. | 6 | — |
| 42 | Original still-life artwork was AI-generated for Deadline Packet. | 8 | — |

### README

| # | Exact copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Deadline Packet | 2 | — |
| 2 | Prepare accountant-ready evidence packets for cross-border freelance filing periods. | 9 | F-1-16 |
| 3 | Deadline Packet organizes one filing period’s invoices, receipts, statements, missing items, notes, and questions. | 14 | F-1-20 |
| 4 | It exports them for accountant review. | 6 | — |
| 5 | It does not calculate tax, decide legal requirements, submit returns, or run OCR. | 13 | — |
| 6 | Live product: https://compliance-evidence-pack.sociobot.in | 3 | — |
| 7 | One-click demo: https://compliance-evidence-pack.sociobot.in/demo | 3 | — |
| 8 | What it does | 3 | — |
| 9 | Stores packet data and attachments in IndexedDB on this device. | 10 | F-1-22 |
| 10 | Encrypts attachment bytes with device-local AES-256-GCM when Web Crypto is available. | 11 | F-1-23 |
| 11 | Builds a missing-evidence list from the editable checklist. | 8 | F-1-20 |
| 12 | Exports an accountant ZIP, PDF index, and JSON backup you can import. | 12 | — |
| 13 | Keeps edits and exports working offline after the first visit. | 10 | — |
| 14 | Includes one packet free. | 4 | — |
| 15 | A US$12 one-time license adds unlimited packets and duplication. | 9 | F-1-19 |
| 16 | The app does not upload packet contents automatically. | 8 | — |
| 17 | License purchase and verification are the only optional third-party requests. | 10 | F-1-7 |
| 18 | Clearing browser site data removes local packets, so keep an exported backup somewhere safe. | 14 | F-1-10 |
| 19 | Try the isolated demo | 4 | — |
| 20 | Open `/demo` or `/?demo=1`. | 4 | — |
| 21 | It starts with a realistic Apr–Jun cross-border packet, two sample evidence files, four gaps, and two accountant questions. | 18 | F-1-3, F-1-20 |
| 22 | Demo work uses the separate `deadline-packet-demo` IndexedDB database. | 8 | F-1-24 |
| 23 | Reset demo restores the sample. | 5 | — |
| 24 | Start for real clears demo data and opens the real, empty workspace. | 12 | F-1-6 |
| 25 | See the demo contract. | 4 | — |
| 26 | Run locally | 2 | — |
| 27 | Requirements: Node.js 22+ and npm. | 5 | — |
| 28 | No backend or environment variable is required. | 7 | — |
| 29 | Billing verification contacts the public Sociobot API only when a license token exists. | 13 | F-1-7 |
| 30 | Test and build | 3 | — |
| 31 | Playwright 1.58.2 is pinned. | 4 | F-1-25 |
| 32 | Install its Chromium binary outside the factory image with `npx playwright install chromium`. | 13 | — |
| 33 | `npm test` | 2 | — |
| 34 | `npm run build` | 3 | — |
| 35 | `npm test` runs TypeScript, Vitest, and Chromium coverage. | 8 | — |
| 36 | Claim-specific commands are listed in `.factory/claims.json`. | 6 | — |
| 37 | The production build lands in `dist/`, with `index.html` at its root. | 11 | — |
| 38 | Deploy | 1 | — |
| 39 | Build with `npm run build` and deploy `dist/` as a static site. | 12 | — |
| 40 | The generated output includes direct demo and policy entries, a designed 404, the PWA shell, and `staticwebapp.config.json` for routing, MIME types, cache rules, and security headers. | 26 | F-1-26 |
| 41 | The factory owns DNS and infrastructure. | 6 | — |
| 42 | Project map | 2 | — |
| 43 | `src/main.ts` — screens, demo seed, routing, and interaction logic. | 9 | — |
| 44 | `src/db.ts` — isolated real/demo IndexedDB persistence and encryption. | 8 | — |
| 45 | `src/export.ts` — ZIP, PDF, and JSON generation. | 7 | — |
| 46 | `public/sw.js` — versioned offline shell and update lifecycle. | 8 | — |
| 47 | `.factory/design.md` — product visual system and asset provenance. | 8 | — |
| 48 | `.factory/handoff.md` — exact release verification evidence. | 6 | — |
| 49 | Privacy and law | 3 | — |
| 50 | Read the in-app `/privacy` and `/terms` pages. | 7 | — |
| 51 | The software is an organizational tool, not tax, accounting, or legal advice. | 12 | — |
| 52 | License | 1 | — |
| 53 | MIT — see `LICENSE`. | 4 | — |

No button besides the disclosure in F-1-27 lacks a result-naming verb. No
heading was unintelligible in isolation. No banned marketing word appears
outside the literal paid-license use of “unlock.”

## Demo and sandbox evidence

- The first-screen action opens `/demo` in one click. Its first render already
  shows **Apr–Jun cross-border evidence**, seven checklist groups, four evidence
  gaps, two files, two accountant questions, an accountant contact, and recent
  history. See [the 390 px demo](./qa-artifacts/review-1-demo-mobile.png).
- The persistent banner says “Demo — sample data, nothing is saved to your real
  packets” and exposes **Reset demo** and **Start for real**.
- After adding a question/file and changing the checklist, **Reset demo**
  removed the new file/question and restored the unchecked sample item.
- A marker written directly to the real `deadline-packet` database remained
  unchanged while demo data was edited and reset. Demo used
  `deadline-packet-demo` and the `demo:` localStorage prefix.
- **Start for real** removed the demo database and demo key and returned to `/`.
- After service-worker control, the demo reloaded offline, retained the seeded
  packet/banner, showed “Offline — edits still save,” and remained editable.
- The exercised landing/demo flow made requests only to
  `https://compliance-evidence-pack.sociobot.in`; no packet content left the
  origin. No console or page error occurred on normal routes.

The demo gate passes. F-1-1 is a product interaction race, not a sandbox leak.

## Declared claim tests

A fresh temporary clone was created from HEAD, followed by `npm ci`. Every
exact `test` command from `.factory/claims.json` was then run separately.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS, 1/1 |
| `privacy-local` | PASS, 1/1 |
| `encrypted-storage` | PASS, 1/1 |
| `packet-exports` | PASS, 1/1 |
| `missing-evidence` | PASS, 1/1 |
| `offline-reload` | PASS, 1/1 |
| `free-and-paid` | PASS, 1/1; followed the 303 and saw Deadline Packet at $12.00 |
| `account-free` | PASS, 1/1 |
| `file-size-limit` | PASS, 1/1 |
| `tracker-free` | PASS, 1/1 |
| `local-retention` | PASS, 1/1, but incomplete as described in F-1-10 |
| `license-nonblocking` | PASS, 1/1 |
| `no-tax-calculation` | PASS, 1/1 |
| `no-legal-determination` | PASS, 1/1 |
| `no-document-validation` | PASS, 1/1 |
| `no-return-submission` | PASS, 1/1 |
| `no-ocr` | PASS, 1/1 |

No declared command failed. F-1-2 through F-1-10 are the remaining unlisted or
partly untested public claims.

## Structure, accessibility, and crawl

Verified live from fresh contexts:

- `/`, `/demo`, `/privacy`, `/terms`, and a 404 each have `lang="en"`, one h1,
  a main landmark, route-appropriate title, route-specific canonical URL,
  description, OG/Twitter data, favicon, consistent header/footer, Privacy,
  and Terms links.
- The cold root title is **Deadline Packet — Prepare accountant evidence**.
  Demo and policy titles are **Demo — Deadline Packet**, **Privacy — Deadline
  Packet**, and **Terms — Deadline Packet**.
- `/definitely-missing-review-1` returns HTTP 404 and renders the designed
  “This page is not in the packet.” page with a route home.
- SPA navigation moves focus to `#main`, announces the new h1, and browser Back
  restores the root title, content, focus, and announcement.
- Every discovered internal link returned 200; the deliberate missing route
  returned 404; checkout returned the expected 303 to Dodo. No dead link was
  found.
- Playwright axe found zero serious/critical issues on root, demo, privacy,
  terms, and 404 at 390 px. The page reflows at 390 px with 200% root text,
  exposed targets measured at least 44 px, and reduced-motion mode had no
  persistent animation.
- JavaScript is 53,023 bytes raw / 19,440 bytes gzip. The hidden mobile hero
  made no WebP request. A fresh Lighthouse 12.7.0 mobile run scored Performance
  100 and Accessibility 100 (FCP 1.0 s, LCP 1.0 s, TBT 0 ms, CLS 0). `npm test`
  passed 5 Vitest and 24 Playwright tests; `npm run build` produced `dist/`.
- The night-market counter, receipt-slip geometry, paper panels, cyan/lime/coral
  palette, and bespoke folder marks are recognizably product-specific rather
  than a generic centered SaaS hero.

F-1-12 through F-1-15 record the remaining structure failures.

## Earlier-finding reconciliation

No earlier `review-*.md` or `polish-*.md` exists. The earlier handoff says there
were no gaps, so there is no handoff finding ID to replay. The repository does
contain four verification reports; every finding is checked below. Those
reports did not assign stable IDs, so recurring findings retain their exact
earlier headings and receive this review's IDs.

| Earlier source and finding | Current live/code result |
| --- | --- |
| `verification.md` — claims contract missing | Fixed: 17 entries and tags exist; every command passes. Inventory completeness is still blocked separately by F-1-2–F-1-10. |
| `verification.md` — isolated demo missing | Fixed: one-click seeded `/demo`, separate storage, reset, exit, and offline behavior verified. |
| `verification.md` — first-screen plain words fails | Fixed: what, who, and first action are clear in both cold contexts. |
| `verification.md` — CSP missing | Fixed in live response and `staticwebapp.config.json`. |
| `verification.md` — immutable asset caching missing | Fixed: hashed assets use one-year immutable caching; `sw.js` is no-cache. |
| `verification.md` — route titles not specific | Fixed on root, demo, privacy, terms, and 404. |
| `verification.md` — no designed/real 404 | Fixed: designed HTTP 404 verified. |
| `verification.md` — update behavior untested | Fixed: changed-worker regression passes in the 24-test suite. |
| `verification.md` — manifest MIME generic | Fixed: `application/manifest+json`. |
| `verification-2.md` — checkout price mismatch | Fixed: public and hosted checkout prices are US$12. |
| `verification-2.md` — rapid edits disappear | **Regressed/unfixed: F-1-1.** |
| `verification-2.md` — claims inventory incomplete | **Partly fixed: F-1-2–F-1-10.** |
| `verification-2.md` — 200% headline clipping | Fixed: root stays 390 px wide; h1 right edge is 370 px. |
| `verification-2.md` — mobile targets below 44 px | Fixed for all exposed links/buttons/controls measured. |
| `verification-2.md` — route focus/announcement fails | Fixed on push navigation and Back. |
| `verification-2.md` — question removal irreversible | Fixed: named confirmation appears and cancel keeps the question. |
| `verification-2.md` — unstable mobile performance/hidden hero fetched | Fixed: mobile did not request the hero; bundle is 19,440 bytes gzip; fresh Lighthouse Performance is 100. |
| `verification-2.md` — soft 404 | Fixed: HTTP 404. |
| `verification-3.md` — checklist-to-question loss | **Regressed/unfixed: F-1-1.** |
| `verification-3.md` — malformed backup bricks startup | Fixed: incomplete backup leaves zero rows and reload returns to landing. |
| `verification-3.md` — claims contract incomplete | **Partly fixed: F-1-2–F-1-10.** |
| `verification-3.md` — whitespace-only names accepted | Fixed: dialog remains open with “Enter a packet name with letters or numbers.” |
| `verification-3.md` — 200% demo reflow fails | Fixed: expanded demo remains 390 px wide. |
| `verification-3.md` — undersized text and target | **Half-fixed: targets pass; type remains under 16 px (F-1-11).** |
| `verification-3.md` — soft 404 | Fixed: HTTP 404. |
| `verification-3.md` — stale US$19 copy audit | Fixed: current audit says US$12. |

## Missed leverage and AI check

No missed-leverage finding. The brief's obvious import/export requirement is
implemented through JSON backup/import plus ZIP and PDF exports. Cross-device
sync would conflict with the local/private promise unless made explicit and
optional. AI is not necessary for this evidence-organizing job and could imply
legal or sufficiency judgments the product correctly avoids. The runtime has
no AI call, provider key, Azure endpoint, or decorative AI feature. The
AI-generated still-life is disclosed as build-time artwork.

## What would make this perfect

Repair the form replacement race and prove it with a deterministic stress
test. Finish the claims inventory and make each tagged test cover the whole
published sentence. Raise all visible type to 16 px, keep the three hero facts
inside the desktop first screen, restore usable mobile header navigation, add
the required landing-page product preview, correct the demo heading order, and
apply every copy rewrite above. Re-run this review from fresh contexts; PASS is
appropriate only if no finding remains.
