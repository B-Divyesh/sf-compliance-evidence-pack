# Adversarial first-read review 5 — Deadline Packet

Reviewed 2026-08-28 at commit `367e07fc0866a4371183e170f9adb5e544379cad`
and against <https://compliance-evidence-pack.sociobot.in>. The deployed
JavaScript and CSS byte-match the clean build. Product code was not changed.

## Verdict

**FAIL.** The first screen is clear, the live demo is immediate and isolated,
all 24 declared claim commands pass, and the core workflow works online and
offline. Acceptance still has two blocking claim-accountability gaps, one
route-focus defect, and seven plain-words defects. PASS requires zero findings.

## Findings

### Blocking

#### F-5-1 — The free-tier test does not prove the advertised “complete packet”

- **Exact quote/location:** landing lifetime-license section, “Your first
  complete packet is free.”
- **Evidence:** `@claim:free-and-paid` creates an empty first packet, confirms
  that a second packet is gated, and checks paid duplication. It never finishes
  the first packet or exports it without a license. The separate export claim
  runs in demo mode, where the sample license path is different.
- **Why this blocks:** the public promise is stronger than the observable
  outcome asserted by its one tagged test. A visitor can reasonably read
  “complete” as including checklist completion, attachments, and handoff
  export.
- **Concrete fix:** either write “Your first packet is free,” matching the
  current test, or extend `@claim:free-and-paid` to complete an unlicensed real
  packet, attach a file, and download its accountant ZIP before checking the
  second-packet gate.

#### F-5-2 — The AI-art provenance statement is an unlisted claim

- **Exact quote/location:** landing footer, “Original still-life artwork was
  AI-generated for Deadline Packet.”
- **Evidence:** `.factory/claims.json` has no provenance entry. The repository
  contains source art and generation sidecars, but no claim-tagged test owns
  the public statement.
- **Why this blocks:** provenance is a factual transparency statement a visitor
  can rely on. The claims contract requires every such public statement to have
  one listed test.
- **Concrete fix:** add `hero-art-provenance` to `claims.json`. Its one tagged
  test should verify the retained source image, factory-image sidecars, prompt
  record, and the deterministic derivative used by the live hero and social
  image.

### Major

#### F-5-3 — SPA route changes focus `<main>`, not the new `<h1>`

- **Exact location:** live navigation from `/` to `/privacy`, then browser Back;
  `src/main.ts:359`; `tests/e2e/app.spec.ts:544-548`.
- **Evidence:** after both navigation actions, `document.activeElement` is
  `<main id="main">`. The announcer contains the new heading, but the heading
  itself is not focused. The current browser test explicitly expects `#main`,
  so it locks in behavior that contradicts the route-focus contract.
- **Why this matters:** keyboard and screen-reader users are placed at a broad
  container instead of the page headline. The required behavior is to focus
  and announce the new `<h1>`.
- **Concrete fix:** give the rendered h1 `tabindex="-1"`, focus it after each
  pushState/popstate render, and keep the polite announcement. Change the test
  to require the route h1 after forward navigation and Back.

### Minor copy and heading findings

#### F-5-4 — The first-screen eyebrow is a slogan

- **Exact quote/location:** landing first screen, “Evidence in order. Questions
  in view.”
- **Why this matters:** the paired fragments restate the mood of the product
  without adding a usable fact. They are the decorative tagline prohibited by
  the plain-words contract.
- **Concrete rewrite:** delete the line. The h1 and audience sentence already
  state the job and result.

#### F-5-5 — The hero caption is another mood line

- **Exact quote/location:** landing hero image caption, “From scattered
  evidence to one reviewable handoff.”
- **Why this matters:** it does not describe the image or name a section. It
  repeats a generic before/after slogan.
- **Concrete rewrite:** “Sample filing-period evidence” if a caption is needed,
  or remove the caption.

#### F-5-6 — A landing h2 does not name its section

- **Exact quote/location:** landing capability-boundary h2, “Not another filing
  portal.”
- **Why this matters:** heard in the heading list, this comparison does not say
  which capabilities or limits follow.
- **Concrete rewrite:** “What Deadline Packet does not do.”

#### F-5-7 — The paid-section h2 hides the section name

- **Exact quote/location:** landing paid-section h2, “Keep every filing period.”
- **Why this matters:** the nearby “Lifetime license” eyebrow is not a heading.
  A heading-only scan does not identify this as pricing or licensing.
- **Concrete rewrite:** make the h2 “Lifetime license.” Put “Keep every filing
  period” in body copy only if it adds necessary information.

#### F-5-8 — The Privacy h1 contains an untestable marketing qualifier

- **Exact quote/location:** `/privacy` h1, “Privacy, without fine print.”
- **Why this matters:** “without fine print” is subjective and does not tell the
  reader what the policy covers.
- **Concrete rewrite:** “How Deadline Packet stores and sends data.”

#### F-5-9 — The Privacy page exposes implementation jargon

- **Exact quote/location:** `/privacy`, “The app shell is cached by a service
  worker.”
- **Why this matters:** “app shell” and “service worker” describe the
  implementation, not the offline result a visitor needs.
- **Concrete rewrite:** “After your first visit, the browser saves the app so
  packet work remains available offline.”

#### F-5-10 — The 404 h1 uses a packet metaphor

- **Exact quote/location:** designed 404 h1, “This page is not in the packet.”
- **Why this matters:** a person reaching a bad URL should not have to decode a
  product metaphor to identify the error.
- **Concrete rewrite:** “Page not found.” Keep the folder illustration as
  decorative product identity.

## Cold first read

Fresh Chromium contexts opened `/` without scrolling at 390×844 and 1440×900.

| Question | Answer available on the first screen | Exact cue |
| --- | --- | --- |
| What does it do? | Organizes filing-period evidence and questions for accountant review. | “Prepare evidence for your accountant.” |
| For whom? | Freelancers with cross-border income. | “For freelancers with cross-border income…” |
| What should I click first? | Open the seeded example. | “Try it with sample data” plus the adjacent sample description. |

All three privacy/offline/price facts also fit. Their phone bottom edges are
751.19, 781.98, and 837.58 px; their desktop bottom edges are 796.36, 827.16,
and 857.95 px. No console error occurred. Evidence:
[mobile](./qa-artifacts/review-5-first-read-mobile.png) and
[desktop](./qa-artifacts/review-5-first-read-desktop.png).

## Copy audit

Counts use displayed whitespace-separated tokens, ignore a standalone em dash,
and retain hyphenated terms, prices, URLs, and inline commands as one token.
Repeated navigation text is consolidated and marked. The tables include
headings, labels, actions, and fragments because the plain-words rules apply to
them too. No unit exceeds 22 words and no banned marketing word appears.

### Landing page

| # | Exact copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Deadline Packet | 2 | Pass; wordmark |
| 2 | Skip to main content | 4 | Pass; action |
| 3 | Local Online | 2 | Pass; status |
| 4 | Install app | 2 | Pass; action |
| 5 | Demo | 1 | Pass; navigation |
| 6 | Privacy | 1 | Pass; navigation, header and footer |
| 7 | Terms | 1 | Pass; navigation, header and footer |
| 8 | Evidence in order. | 3 | **F-5-4** |
| 9 | Questions in view. | 3 | **F-5-4** |
| 10 | Prepare evidence for your accountant. | 5 | Pass; h1 |
| 11 | For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 18 | Pass |
| 12 | Try it with sample data | 5 | Pass; result-naming action |
| 13 | Start your packet | 3 | Pass; result-naming action |
| 14 | The sample opens with files, evidence gaps, and accountant questions. | 10 | Pass |
| 15 | No account. | 2 | Pass |
| 16 | Data stays in this browser. | 5 | Pass |
| 17 | Works offline after your first visit. | 6 | Pass |
| 18 | One packet free. | 3 | Pass |
| 19 | Unlimited use costs US$12 once. | 5 | Pass |
| 20 | Import a JSON backup | 4 | Pass; result-naming action |
| 21 | A kraft evidence folder, receipts, invoice sheets, and a calculator arranged on a rain-dark night-market counter | 16 | Pass; image alt |
| 22 | From scattered evidence to one reviewable handoff. | 7 | **F-5-5** |
| 23 | Sample packet view | 3 | Pass |
| 24 | See the evidence gaps before handoff. | 6 | Pass; h2 |
| 25 | Files, checklist states, and questions stay together in one packet. | 10 | Pass |
| 26 | Open the sample packet | 4 | Pass; result-naming action |
| 27 | Apr–Jun / Review desk | 4 | Pass |
| 28 | 3 of 7 evidence groups ready | 6 | Pass |
| 29 | Business expense receipts | 3 | Pass |
| 30 | Evidence gap | 2 | Pass; twice |
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
| 42 | Built for human review | 4 | Pass; scope label |
| 43 | Not another filing portal. | 4 | **F-5-6** |
| 44 | Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 | Pass |
| 45 | It keeps evidence gaps and accountant questions in the same packet. | 11 | Pass |
| 46 | Stored in this browser | 4 | Pass |
| 47 | Attachments included in your ZIP | 5 | Pass |
| 48 | Evidence gaps follow the checklist | 5 | Pass |
| 49 | Open questions stay beside the files | 6 | Pass |
| 50 | Lifetime license | 2 | Pass; section label |
| 51 | Keep every filing period | 4 | **F-5-7** |
| 52 | US$12 once. | 2 | Pass |
| 53 | Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 | **F-5-1** |
| 54 | Buy a lifetime license | 4 | Pass; result-naming action |
| 55 | Restore a lifetime license | 4 | Pass; result-naming disclosure |
| 56 | License token | 2 | Pass; label |
| 57 | Verify and restore | 3 | Pass; accessible name adds “lifetime license” |
| 58 | Checkout opens on Sociobot/Dodo. | 4 | Pass |
| 59 | New packet | 2 | Pass |
| 60 | Start a packet | 3 | Pass; dialog h2 |
| 61 | Close dialog | 2 | Pass; action name |
| 62 | Packet name | 2 | Pass; label |
| 63 | Period starts | 2 | Pass; label |
| 64 | Period ends | 2 | Pass; label |
| 65 | Your handoff deadline | 3 | Pass; label |
| 66 | Use the date you want the packet with your accountant—not a statutory deadline. | 13 | Pass |
| 67 | Accountant or contact · Optional | 5 | Pass; label |
| 68 | This creates an organizational checklist, not a filing or legal determination. | 11 | Pass |
| 69 | Cancel | 1 | Pass; action |
| 70 | Create packet | 2 | Pass; result-naming action |
| 71 | Prepare filing-period evidence for accountant review. | 6 | Pass; footer |
| 72 | Built by Param Factory · v1.0.0. | 6 | Pass; attribution/build id |
| 73 | Original still-life artwork was AI-generated for Deadline Packet. | 8 | **F-5-2** |

### README

| # | Exact copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Deadline Packet | 2 | Pass; heading |
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
| 29 | No backend or environment variable is required. | 7 | Pass; contributor setup fact |
| 30 | Test and build | 3 | Pass; heading |
| 31 | The project requires Playwright 1.58.2. | 5 | Pass |
| 32 | If Chromium is missing, run `npx playwright install chromium`. | 9 | Pass |
| 33 | `npm test` checks types, unit tests, and browser tests. | 9 | Pass |
| 34 | Claim-specific commands are listed in `.factory/claims.json`. | 6 | Pass |
| 35 | The production build lands in `dist/`, with `index.html` at its root. | 11 | Pass |
| 36 | Deploy | 1 | Pass; heading |
| 37 | Build with `npm run build` and deploy `dist/` as a static site. | 12 | Pass |
| 38 | The build includes pages for the demo, policies, and 404 errors. | 11 | Pass |
| 39 | It also includes offline app files and Azure Static Web Apps configuration. | 12 | Pass; deployment context |
| 40 | The factory owns DNS and infrastructure. | 6 | Pass; ownership note |
| 41 | Project map | 2 | Pass; heading |
| 42 | `src/main.ts` — screens, demo seed, routing, and interaction logic. | 8 | Pass |
| 43 | `src/db.ts` — stores and encrypts real and demo data separately in the browser. | 12 | Pass |
| 44 | `src/export.ts` — ZIP, PDF, and JSON generation. | 6 | Pass |
| 45 | `public/sw.js` — caches the app for offline use and installs updates. | 10 | Pass |
| 46 | `.factory/design.md` — product visual system and asset provenance. | 7 | Pass |
| 47 | `.factory/handoff.md` — exact release verification evidence. | 5 | Pass |
| 48 | Privacy and law | 3 | Pass; heading |
| 49 | Read the in-app `/privacy` and `/terms` pages. | 7 | Pass |
| 50 | The software is an organizational tool, not tax, accounting, or legal advice. | 12 | Pass |
| 51 | License | 1 | Pass; heading |
| 52 | MIT — see LICENSE. | 3 | Pass |

README has no over-22-word, banned-word, terminology, heading, or action flag.
Its setup and build statements were checked by `npm ci`, `npm test`, and
`npm run build`; they are contributor instructions rather than live product
promises.

## Demo and sandbox

- One click from the cold root opens `/demo` with **Apr–Jun cross-border
  evidence**, two real-looking text files, four evidence gaps, and two
  accountant questions. The product is already in use on the first demo screen.
- The banner says “Demo — sample data, nothing is saved to your real packets”
  and provides **Reset demo** and **Start for real**.
- A live real packet named `Review 5 real marker` was created first. Demo edits
  and sample-license activation used `deadline-packet-demo` and `demo:` keys;
  no real license key appeared. Reset restored the unchecked sample item and
  removed the sample license. Start for real removed all demo stores and
  reopened the unchanged real packet.
- The full live demo exercise made no third-party request and logged no console
  error. Evidence: [demo at 390 px](./qa-artifacts/review-5-demo-mobile.png).
- After service-worker control, a live offline reload retained the sample,
  accepted a checklist edit, displayed the unclipped “Offline — edits still
  save” badge, and downloaded the accountant ZIP. Evidence:
  [offline demo](./qa-artifacts/review-5-demo-offline-mobile.png).

The one-click demo, realistic first screen, reset, real-data isolation, privacy,
and offline sandbox gates pass.

## Claims

The repository was cloned cleanly to
`/tmp/compliance-evidence-pack-review5-4556cx`. `npm ci` completed with zero
vulnerabilities. Every exact command from `.factory/claims.json` was then run
separately.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `demo-seed` | PASS |
| `privacy-local` | PASS |
| `encrypted-storage` | PASS |
| `packet-exports` | PASS |
| `missing-evidence` | PASS |
| `offline-reload` | PASS |
| `free-and-paid` | PASS, but incomplete for the stronger landing wording; F-5-1 |
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

All listed commands returned zero. F-5-1 records one listed test whose assertion
does not cover the complete public wording. F-5-2 records the only unlisted
visitor-reliant claim found on the landing page or in README.

The full clean-clone command `CI=1 npm test && npm run build` also passed:
10 Vitest/policy tests, 32 Chromium tests, and a generated `dist/`. Initial JS
is 56,145 bytes raw / 20.10 kB gzip; CSS is 26,408 bytes raw / 6.50 kB gzip.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns a
  designed HTTP 404. Each route has its required title pattern, one h1, one
  main landmark, description, canonical, Open Graph image, favicon, `lang=en`,
  consistent site header, and footer links to Privacy and Terms.
- `robots.txt`, `sitemap.xml`, the web manifest, SVG favicon, 180 px Apple icon,
  1200×630 social image, and offline page all return 200 with correct types.
- Every crawled internal link returned 200. The checkout link returned its
  expected 303 to the hosted payment flow. No dead link was found.
- Live axe scans found zero serious or critical violations on root, demo,
  Privacy, Terms, and the 404 route. The factory URL verifier found one h1,
  `lang`, main, complete image alt text, labelled buttons, zero console errors,
  and a 796 ms load. Evidence: [`review-5-verify`](./qa-artifacts/review-5-verify/verify.json).
- The night-market desk, paper/receipt surfaces, cyan/lime/coral signals,
  narrow display type, and original still-life art match `.factory/design.md`.
  This is visually distinct from a generic centered-hero SaaS template.
- F-5-3 is the remaining route-focus failure. F-5-6 through F-5-10 are the
  remaining heading/plain-language failures.

## Earlier-finding reconciliation

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. Current live
assets byte-match the reviewed source, so live and code confirmation are tied
to the same build.

| Earlier finding | Current live and code confirmation |
| --- | --- |
| F-1-1 | `@claim:question-retention` keeps ten rapid questions through reload; serialized saves remain in `src/main.ts`. |
| F-1-2 | Landing names observable sample contents; `@claim:demo-seed` passes live/local. |
| F-1-3 | README counts two files, four evidence gaps, and two questions; the tagged seed test asserts them. |
| F-1-4 | Editable date creation, update, storage, and reload pass. |
| F-1-5 | Questions remain beside files before and after rapid edits/reload. |
| F-1-6 | Start for real removes demo storage and reopens unchanged real work. |
| F-1-7 | License-network boundary passes; the live demo made no third-party request. |
| F-1-8 | Merchant/refund claims remain absent; copy only names the observed checkout destination. |
| F-1-9 | Retry wording remains absent; non-blocking verification passes. |
| F-1-10 | Retention test clears IndexedDB, Cache Storage, and localStorage. |
| F-1-11 | Final seeded mobile UI has no text below the 16 px design minimum. |
| F-1-12 | All three desktop facts end above 900 px. |
| F-1-13 | Demo, Privacy, and Terms are visible in the 390 px header. |
| F-1-14 | The seeded packet preview precedes How it works. |
| F-1-15 | The demo h1 precedes all h2 headings in DOM order. |
| F-1-16 | “Accountant-ready” remains absent from public source and metadata. |
| F-1-17 | “Without guesswork” remains absent; checklist copy names missing items. |
| F-1-18 | “Clearly labelled” remains absent; the copy names gaps and questions. |
| F-1-19 | Public entitlement copy consistently uses “lifetime license.” |
| F-1-20 | Public missing-item copy consistently uses “evidence gap.” |
| F-1-21 | Landing says “Stored in this browser,” not IndexedDB. |
| F-1-22 | README storage copy remains user-facing. |
| F-1-23 | README encryption copy remains user-facing; the encryption claim passes. |
| F-1-24 | Demo docs and code use separate packet/license namespaces. |
| F-1-25 | README names the exact Playwright 1.58.2 requirement. |
| F-1-26 | Build/deploy copy remains split into sentences below 22 words. |
| F-1-27 | The disclosure remains “Restore a lifetime license.” |
| F-2-1 | The phone price fact ends at 837.58 px inside 844 px. |
| F-3-1 | Live demo license activation uses only `demo:` state; reset/exit remove it and real storage is unchanged. |
| F-3-2 | Plain browser-language license storage copy is listed and its restore/reload/remove test passes. |
| F-3-3 | No one-time-license or lifetime-unlock entitlement variant remains. |
| F-3-4 | Offline phone badge is visible, complete, and unclipped. |
| F-3-5 | Seed summary correctly says “1 open question.” |
| F-3-6 | Route/social descriptions use “evidence gaps” and omit “calm”/“local-first.” |
| F-3-7 | Live Apple touch icon is the dedicated 180×180 PNG. |
| F-3-8 | Create dialog says “New packet.” |
| F-4-1 | The live final demo labels all compute at 16 px or above; the test waits for seeded rows/files. |
| F-4-2 | `cleared-data-recovery` is listed and proves packet/file/key erasure with no recovery path. |
| F-4-3 | README accurately says `npm test` checks types, unit tests, and browser tests. |
| F-4-4 | README uses the direct “If Chromium is missing…” instruction. |
| F-4-5 | Database map entry describes separate browser storage/encryption behavior. |
| F-4-6 | Service-worker map entry says it caches the app and installs updates. |
| F-4-7 | Recorded copy-audit rows now use the documented counting rule and their source-linked test passes. |

No earlier numbered finding is unfixed or regressed. F-5-1 through F-5-10 are
new findings from the full round-5 checklist.

## Missed leverage

No missing obvious feature was found. The brief asks for local packet building,
evidence gaps, attachments, a ZIP/PDF handoff, and import/export; all exist.
Cloud sync would weaken the stated local-first privacy model. Runtime AI would
not improve the core organization job enough to justify sending evidence to a
gateway, and no provider key or decorative AI control is embedded.

## What would make this perfect

Close F-5-1 through F-5-10: align or fully test the free-packet promise, list
and test art provenance, focus route h1 elements, and replace the remaining
slogans, vague headings, jargon, and 404 metaphor with the exact rewrites
above. Then deploy, rerun every claim from a clean clone, and repeat the live
390 px, desktop, demo-isolation, offline, link, axe, and route-focus checks.
