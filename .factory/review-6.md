# Adversarial first-read review 6 — Deadline Packet

Reviewed 2026-08-28 against commit `f6be34e7d40232b4c8bf0ba78a71fc0699386d1d` and the deployed site at <https://compliance-evidence-pack.sociobot.in>. This was a read-only review; no product code was changed.

## Verdict

**PASS.** There are zero findings, including zero blocking findings, no unlisted public claim, and no untested listed claim.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded the landing page with no console errors. Before scrolling, the page answered all three required questions:

| Question | Cold reading |
| --- | --- |
| What does it do? | It prepares one filing period’s invoices, receipts, evidence gaps, and accountant questions for review and export. |
| Who is it for? | “For freelancers with cross-border income…” |
| What should I click first? | “Try it with sample data”; the adjacent explanation says it opens files, evidence gaps, and accountant questions. |

The mobile first screen contained the headline, audience sentence, both first actions, explanatory line, and all three facts. The primary action is visually and semantically primary. The dark night-counter/paper visual system is distinct from a generic SaaS template, remains legible at phone width, and matches `.factory/design.md`.

## Copy audit

Counts use whitespace-delimited displayed words, with a hyphenated term and a price counted as one word. Labels, headings, and actions are included because a first-time visitor reads them as part of the landing page. No item exceeds 22 words. No banned marketing term, unexplained metaphor/mood heading, inconsistent public term, or non-result-naming action was found. “Evidence gap,” “packet,” “accountant ZIP,” “demo,” and “lifetime license” remain consistent.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Deadline Packet | 2 | Product name |
| Demo | 1 | Route label |
| Privacy | 1 | Route label |
| Terms | 1 | Route label |
| Prepare evidence for your accountant. | 5 | Plain job headline |
| For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 18 | Audience and outcome |
| Try it with sample data | 5 | Result-naming primary action |
| Start your packet | 3 | Result-naming real action |
| The sample opens with files, evidence gaps, and accountant questions. | 10 | Explains the demo result |
| No account. | 2 | Claim covered by `account-free` |
| Data stays in this browser. | 5 | Claim covered by `privacy-local` |
| Works offline after your first visit. | 6 | Claim covered by `offline-reload` |
| One packet free. | 3 | Claim covered by `free-and-paid` |
| Unlimited use costs US$12 once. | 5 | Claim covered by `free-and-paid` |
| Import a JSON backup | 4 | Result-naming action |
| A kraft evidence folder, receipts, invoice sheets, and a calculator arranged on a rain-dark night-market counter | 16 | Useful image alt text |
| Sample filing-period evidence | 3 | Literal image caption |
| Sample packet view | 3 | Literal section label |
| See the evidence gaps before handoff. | 6 | Literal section heading |
| Files, checklist states, and questions stay together in one packet. | 10 | Claim covered by `question-retention` and `missing-evidence` |
| Open the sample packet | 4 | Result-naming action |
| Apr–Jun / Review desk | 4 | Sample-state label |
| 3 of 7 evidence groups ready | 6 | Sample-state label |
| Business expense receipts | 3 | Sample evidence item |
| Evidence gap | 2 | Sample state |
| Relevant contracts | 2 | Sample evidence item |
| Which exchange-rate record should I use? | 6 | Sample accountant question |
| Open question | 2 | Sample state |
| 2 attached sample files · Export bar ready | 7 | Sample-state label |
| Set the period | 3 | How-it-works action |
| Choose your own handoff date. | 5 | Claim covered by `editable-handoff-date` |
| Gather the proof | 3 | How-it-works action |
| See which checklist items are still missing. | 7 | Claim covered by `missing-evidence` |
| Export one packet | 3 | How-it-works action |
| ZIP + PDF index for review. | 6 | Claim covered by `packet-exports` |
| Built for human review | 4 | Literal section label |
| What Deadline Packet does not do. | 6 | Literal section heading |
| Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 | Boundary claims covered by five `no-*` claims |
| It keeps evidence gaps and accountant questions in the same packet. | 11 | Claim coverage as above |
| Stored in this browser | 4 | Claim covered by `privacy-local` |
| Attachments included in your ZIP | 5 | Claim covered by `packet-exports` |
| Evidence gaps follow the checklist | 5 | Claim covered by `missing-evidence` |
| Open questions stay beside the files | 6 | Claim covered by `question-retention` |
| Pricing | 1 | Literal section label |
| Lifetime license | 2 | Literal paid-section heading |
| US$12 once. Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 | Claim covered by `free-and-paid` |
| Buy a lifetime license | 4 | Result-naming action |
| Restore a lifetime license | 4 | Result-naming action |
| Checkout opens on Sociobot/Dodo. | 4 | Claim covered by `free-and-paid` |
| Prepare filing-period evidence for accountant review. | 6 | Footer description |
| Built by Param Factory | 4 | Attribution |
| Original still-life artwork was AI-generated for Deadline Packet. | 8 | Claim covered by `hero-art-provenance` |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Prepare evidence packets for accountant review. | 6 | Plain summary |
| Deadline Packet organizes one filing period’s invoices, receipts, statements, evidence gaps, notes, and questions. | 14 | Plain product description |
| It exports them for accountant review. | 6 | Claim covered by `packet-exports` |
| It does not calculate tax, decide legal requirements, submit returns, or run OCR. | 13 | Boundary claims covered by five `no-*` claims |
| Live product | 2 | Link label |
| One-click demo | 2 | Link label |
| Stores packet details and attached files in this browser. | 9 | Claim covered by `privacy-local` |
| When supported, your browser encrypts attached files before storing them. | 9 | Claim covered by `encrypted-storage` |
| Builds an evidence-gap list from the editable checklist. | 7 | Claim covered by `missing-evidence` |
| Exports an accountant ZIP, PDF index, and JSON backup you can import. | 12 | Claim covered by `packet-exports` |
| Keeps edits and exports working offline after the first visit. | 9 | Claim covered by `offline-reload` |
| Includes one complete packet and its core exports free. | 9 | Claim covered by `free-and-paid` |
| A US$12 lifetime license adds unlimited packets and duplication. | 9 | Claim covered by `free-and-paid` |
| The app does not upload packet contents automatically. | 8 | Claim covered by `privacy-local` |
| The app contacts Sociobot only when you buy or verify a lifetime license. | 13 | Claim covered by `license-network-boundary` |
| Clearing browser site data removes local packets, so keep an exported backup somewhere safe. | 13 | Claim covered by `local-retention` and `cleared-data-recovery` |
| Open `/demo` or `/?demo=1`. | 4 | Direct demo instruction |
| It opens an Apr–Jun cross-border packet with two sample files, four evidence gaps, and two accountant questions. | 17 | Claim covered by `demo-seed` |
| Demo changes stay in separate browser storage, including sample license state. | 10 | Claim covered by `demo-isolation` |
| Sample license activation never contacts Sociobot. | 6 | Claim covered by `demo-isolation` |
| Reset demo restores the sample. | 5 | Claim covered by `demo-isolation` |
| Start for real deletes demo changes and opens your real workspace. | 11 | Claim covered by `demo-exit` |
| See the demo contract. | 5 | Useful documentation link |
| Requirements: Node.js 22+ and npm. | 5 | Developer prerequisite |
| No backend or environment variable is required. | 7 | Accurate setup information |
| The project requires Playwright 1.58.2. | 5 | Accurate developer prerequisite |
| If Chromium is missing, run `npx playwright install chromium`. | 9 | Direct recovery instruction |
| npm test checks types, unit tests, and browser tests. | 9 | Accurate test description |
| Claim-specific commands are listed in `.factory/claims.json`. | 7 | Useful verification link |
| The production build lands in `dist/`, with `index.html` at its root. | 11 | Accurate deploy information |
| Build with npm run build and deploy dist as a static site. | 11 | Direct deploy instruction |
| The build includes pages for the demo, policies, and 404 errors. | 11 | Accurate scope statement |
| It also includes offline app files and Azure Static Web Apps configuration. | 12 | Accurate scope statement |
| The factory owns DNS and infrastructure. | 6 | Scope boundary |
| screens, demo seed, routing, and interaction logic | 7 | Project-map fragment |
| stores and encrypts real and demo data separately in the browser | 10 | Project-map fragment |
| ZIP, PDF, and JSON generation | 5 | Project-map fragment |
| caches the app for offline use and installs updates | 9 | Project-map fragment |
| product visual system and asset provenance | 6 | Project-map fragment |
| exact release verification evidence | 5 | Project-map fragment |
| Read the in-app `/privacy` and `/terms` pages. | 7 | Direct legal-route instruction |
| The software is an organizational tool, not tax, accounting, or legal advice. | 12 | Plain scope boundary |
| MIT — see LICENSE. | 4 | License instruction |

## Demo and sandbox

The first click from a fresh landing page opened `/demo`, not a setup screen. Its first visible workspace was the seeded Apr–Jun packet with two attached sample files, four evidence gaps, and two accountant questions (one open and one answered). The persistent banner read exactly: “Demo — sample data, nothing is saved to your real packets.” It exposed both **Reset demo** and **Start for real**.

Reset restored the original unchecked evidence state. The browser request log for the complete landing-to-demo flow contained only same-origin requests. The fresh-clone isolation claim additionally created real packet and license markers, exercised demo edits and sample license activation, reset and exited, and proved the real state byte-identical while demo keys and database were removed. This confirms the sandbox does not persist into real storage. The offline claim test also reloaded, edited, and exported a ZIP while offline after the first visit.

## Claims and quality gates

`.factory/claims.json` contains 25 entries. Each exact command was run separately in a fresh clone at `/tmp/compliance-evidence-pack-review6-7ZZK3S`; all 25 passed. That includes request-log privacy checks, demo isolation/exit/reset, encryption, ZIP/PDF/JSON import-export, free and paid boundaries, file limit, retention and clearing, route capability boundaries, and artwork provenance.

`CI=1 npm test` then passed in the same clean clone: TypeScript, 11 Vitest policy/unit checks, and 33 Chromium tests. `npm run build` produced `dist/` locally; its initial application JavaScript is 56.04 kB raw / 20.04 kB gzip. The deployed HTML referenced the same current hashed JS and CSS filenames built locally. Fresh-browser request logging on root and demo recorded no console errors and no third-party request.

## Structure and routes

Checked root, `/demo`, `/privacy`, `/terms`, and a cold unknown route. The deployed root returned the title **Deadline Packet — Prepare accountant evidence**; the demo title was **Demo — Deadline Packet**. The landing has one h1, a main landmark, English language declaration, description, canonical, OG/Twitter metadata, SVG favicon, and Apple touch icon. The header/footer consistently provide the required Privacy and Terms links and a skip link.

The demo route used the expected one h1 and the sample state. Direct legal-route navigation and Back move focus to the new h1. The static configuration supplies SPA fallback, a response-header CSP including `frame-ancestors`, and a designed HTTP 404 route. The deployed root’s headers included `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and the expected CSP. Sitemap and robots routes are present. The full clean-suite route test verifies all internal links, 404 behavior, keyboard dialog operation, 390 px / 200% reflow, 44 px controls, metadata, focus, CSP, and serious/critical axe findings.

## Earlier findings rechecked

Every earlier finding was rechecked against both the deployed behavior and the current implementation/tests. “Pass” below means the original defect was not merely marked fixed: the relevant observable behavior and its regression coverage are present.

| Earlier id | Confirmation |
| --- | --- |
| F-1-1 | Pass — rapid checklist/question edits preserve the question across reload (`question-retention` plus non-claim stress test). |
| F-1-2 | Pass — landing demo wording is listed and matches the sample. |
| F-1-3 | Pass — README seed counts are listed and `demo-seed` passes. |
| F-1-4 | Pass — editable handoff date is listed and retained by `editable-handoff-date`. |
| F-1-5 | Pass — question retention is listed and tested through reload. |
| F-1-6 | Pass — demo exit clears only demo state; `demo-exit` passes. |
| F-1-7 | Pass — license network boundary is listed and request-logged. |
| F-1-8 | Pass — public checkout/price assertion is listed and tested. |
| F-1-9 | Pass — license verification does not block the free experience. |
| F-1-10 | Pass — retention test clears browser storage and verifies disappearance. |
| F-1-11 | Pass — the 390 px readable-text regression test and live demo both enforce 16 px. |
| F-1-12 | Pass — all three landing facts fit the reviewed mobile and desktop first screens. |
| F-1-13 | Pass — mobile header visibly retains Demo, Privacy, and Terms. |
| F-1-14 | Pass — landing includes a populated sample-packet preview. |
| F-1-15 | Pass — demo has one h1 before its h2 outline. |
| F-1-16 | Pass — “accountant-ready” was removed from public copy. |
| F-1-17 | Pass — subjective “without guesswork” copy was removed. |
| F-1-18 | Pass — vague “clearly labelled” copy was removed. |
| F-1-19 | Pass — public entitlement uses “lifetime license” consistently. |
| F-1-20 | Pass — public missing-item terminology uses “evidence gap.” |
| F-1-21 | Pass — landing describes browser storage in visitor terms. |
| F-1-22 | Pass — README browser-storage wording is visitor-facing. |
| F-1-23 | Pass — encryption wording leads with browser behavior. |
| F-1-24 | Pass — README demo wording explains isolation before implementation detail. |
| F-1-25 | Pass — README names the direct Chromium setup command. |
| F-1-26 | Pass — README build/deploy text is split into short instructions. |
| F-1-27 | Pass — restore action names its lifetime-license result. |
| F-2-1 | Pass — the US$12 fact remains visible on the 390 × 844 first screen. |
| F-3-1 | Pass — demo license is namespaced and cannot change a real license. |
| F-3-2 | Pass — privacy storage statement has `license-local-storage` coverage. |
| F-3-3 | Pass — competing paid-entitlement names remain removed. |
| F-3-4 | Pass — offline status remains visible at mobile width. |
| F-3-5 | Pass — the seed summary correctly says one open question. |
| F-3-6 | Pass — metadata uses the public “evidence gaps” term. |
| F-3-7 | Pass — every route supplies the 180 px Apple touch icon. |
| F-3-8 | Pass — creation consistently calls the object a packet. |
| F-4-1 | Pass — no rendered readable demo text falls below 16 px. |
| F-4-2 | Pass — storage clearing removes packet, ciphertext, and browser key with no recovery path. |
| F-4-3 | Pass — README accurately identifies the test categories. |
| F-4-4 | Pass — README’s install instruction is direct and plain. |
| F-4-5 | Pass — database project-map text describes behavior first. |
| F-4-6 | Pass — worker project-map text describes offline behavior first. |
| F-4-7 | Pass — current copy-audit counts align with the source and policy test. |
| F-5-1 | Pass — unlicensed complete packet, attachment, exports, and second-packet gate are exercised by `free-and-paid`. |
| F-5-2 | Pass — provenance is declared, catalogued, hash-checked, and covered by `hero-art-provenance`. |
| F-5-3 | Pass — direct route and Back both focus the destination h1. |
| F-5-4 | Pass — first-screen slogan text remains absent. |
| F-5-5 | Pass — hero caption literally names the sample evidence. |
| F-5-6 | Pass — the capability heading names its section. |
| F-5-7 | Pass — pricing label and lifetime-license heading name the paid section. |
| F-5-8 | Pass — Privacy h1 literally names storage and sending. |
| F-5-9 | Pass — privacy says the observable offline outcome instead of service-worker jargon. |
| F-5-10 | Pass — 404 has the literal “Page not found.” heading. |

## Missed leverage

No missing feature was found. The brief’s obvious handoff needs are present: editable filing-period packet, attachments, evidence-gap list, accountant questions, ZIP/PDF/JSON export, JSON import, browser-local storage, and offline operation. An AI document-reading feature would conflict with the explicit no-OCR scope and local-first privacy posture; no decorative AI runtime feature or embedded provider key is present.

## What would make this perfect

Maintain the present standard on future changes: keep the one-click sample as the first action, preserve strict demo/real storage separation, add a claim test before adding any visitor-relevant promise, and re-run the mobile first-screen and offline export checks whenever layout or storage code changes.
