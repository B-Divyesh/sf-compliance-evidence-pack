# Polish 5 — cumulative finding reconciliation

Verified 2026-08-28 from clean repair commit
`758ecb0b55b77186eeb8cc1f1b0ea6634bab4d55` and after Azure Static Web Apps
deployment `ff8f9599-7b8f-4bdf-b84e-e10ad902ae5a` at
<https://compliance-evidence-pack.sociobot.in>.

Current evidence:

- [mobile first screen](./qa-artifacts/polish-5-live/first-screen-mobile.png)
- [desktop first screen](./qa-artifacts/polish-5-live/first-screen-desktop.png)
- [mobile demo](./qa-artifacts/polish-5-live/demo-mobile.png)
- [mobile offline demo](./qa-artifacts/polish-5-live/demo-offline-mobile.png)
- [designed 404](./qa-artifacts/polish-5-live/404-desktop.png)
- [live route, demo, isolation, offline, axe, and asset report](./qa-artifacts/polish-5-live/live-report.json)
- [factory URL verifier](./qa-artifacts/polish-5-live/verify/verify.json)
- [Lighthouse report](./qa-artifacts/polish-5-live/lighthouse.json)

## Finding matrix

| Finding | Change made | Test, screenshot, and live evidence |
| --- | --- | --- |
| F-1-1 | Serialized saves and preserved active drafts prevent checklist repaints from replacing a submitted question. | `@claim:question-retention`; 10 rapid questions survived reload; [live demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-1-2 | The first screen names the sample’s files, evidence gaps, and questions instead of calling it complete. | `@claim:demo-seed`; [mobile first screen](./qa-artifacts/polish-5-live/first-screen-mobile.png); [live `?demo=1`](https://compliance-evidence-pack.sociobot.in/?demo=1). |
| F-1-3 | README gives the tested two-file, four-gap, two-question sample counts. | `@claim:demo-seed`; `live-report.json` records 2/4/2; [live demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-1-4 | User-chosen handoff dates remain editable, stored, and durable. | `@claim:editable-handoff-date`; created and retained 20 Nov 2026; [live demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-1-5 | Questions remain beside files through rapid edits and reload. | `@claim:question-retention`; [mobile demo](./qa-artifacts/polish-5-live/demo-mobile.png); [live demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-1-6 | Start for real deletes demo changes and reopens unchanged real work. | `@claim:demo-exit`; live audit restored `Round 5 real marker` with no demo keys; [live `?demo=1`](https://compliance-evidence-pack.sociobot.in/?demo=1). |
| F-1-7 | Public network copy is limited to buying or verifying a lifetime license. | `@claim:license-network-boundary`; live demo request log has no third-party request; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-1-8 | Removed merchant/refund assertions; copy states only the observable checkout destination. | `@claim:free-and-paid`; live crawl records the checkout endpoint returning 303; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-9 | Removed the unproved retry promise and retained tested non-blocking verification. | `@claim:license-nonblocking`; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-1-10 | The retention test clears IndexedDB, Cache Storage, and localStorage. | `@claim:local-retention`; clean-clone claim run passed. |
| F-1-11 | Every readable mobile label and control remains at least 16 px. | `all visible readable text meets the documented 16px minimum at 390px`; live report has `undersized: []`; [mobile demo](./qa-artifacts/polish-5-live/demo-mobile.png). |
| F-1-12 | Compact desktop hero geometry keeps all three facts before the fold. | `landing and demo keep the reviewed first-screen…`; live bottoms 781.97, 812.77, and 843.56 px at 1440×900; [desktop](./qa-artifacts/polish-5-live/first-screen-desktop.png). |
| F-1-13 | Demo, Privacy, and Terms remain visible in the phone header. | Mobile structure regression; [mobile first screen](./qa-artifacts/polish-5-live/first-screen-mobile.png); [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-14 | A real sample packet preview remains between the hero and How it works. | Landing-order regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-15 | The workbench h1 precedes every demo h2 in DOM order. | Heading-structure regression; live report records one h1; [demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-1-16 | Removed “accountant-ready” in favor of accountant-review wording. | `ships exact plain metadata…`; `.factory/copy-audit.md`; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-17 | Checklist copy states the observable missing-item result. | Copy-audit regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-18 | Capability copy names evidence gaps and accountant questions directly. | Copy-audit regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-19 | Public entitlement language uses only “lifetime license.” | `@claim:free-and-paid`; metadata terminology regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-20 | Public missing-item language uses only “evidence gap.” | `@claim:missing-evidence`; copy audit; [demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-1-21 | Landing storage language says “Stored in this browser.” | Copy-audit regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-1-22 | README describes browser storage in user-facing terms. | Copy-audit source/count regression; README. |
| F-1-23 | README explains browser encryption in plain words. | `@claim:encrypted-storage`; README; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-1-24 | Demo docs describe separate packet and sample-license stores. | `@claim:demo-isolation`; `.factory/demo.md`; live report shows no demo keys after exit. |
| F-1-25 | README names Playwright 1.58.2 and its direct Chromium setup command. | Package pin plus copy-audit regression. |
| F-1-26 | Build and deployment guidance uses short sentences. | Copy-audit source/count regression; README. |
| F-1-27 | The disclosure says “Restore a lifetime license.” | `@claim:free-and-paid`; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-2-1 | Mobile hero spacing keeps the price fact above 844 px. | Exact 390×844 geometry regression; live fact bottom 787.98 px; [mobile first screen](./qa-artifacts/polish-5-live/first-screen-mobile.png). |
| F-3-1 | Demo license state uses `demo:` keys, canned verification, and reset/exit cleanup. | `@claim:demo-isolation`; live report shows unchanged real license, no demo keys, and no Sociobot demo request; [demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-3-2 | Privacy uses browser-facing license-storage copy backed by restore/reload/remove coverage. | `@claim:license-local-storage`; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-3-3 | Removed all one-time-license and unlock entitlement variants. | Metadata terminology regression and `@claim:free-and-paid`; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-3-4 | The full offline status remains visible and unclipped on phones. | `@claim:offline-reload`; [offline screenshot](./qa-artifacts/polish-5-live/demo-offline-mobile.png); [demo](https://compliance-evidence-pack.sociobot.in/demo). |
| F-3-5 | Seed summary pluralizes one open question correctly. | `@claim:demo-seed`; [mobile demo](./qa-artifacts/polish-5-live/demo-mobile.png). |
| F-3-6 | Route and social descriptions use plain evidence-gap language. | Route metadata regression; live report records exact metadata on all routes. |
| F-3-7 | Every route links the dedicated 180×180 Apple touch icon. | `ships exact plain metadata…`; live factory verifier. |
| F-3-8 | The create dialog consistently says “New packet.” | Route/dialog keyboard regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-4-1 | Native `small` labels use the 16 px floor, and the regression waits for the complete seeded UI. | Final-state readable-text regression; live report `undersized: []`; [mobile demo](./qa-artifacts/polish-5-live/demo-mobile.png). |
| F-4-2 | Added encrypted packet/file/key destruction and no-recovery coverage. | `@claim:cleared-data-recovery`; clean-clone claim run passed; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-4-3 | README accurately says `npm test` checks types, unit tests, and browser tests. | Copy-audit regression; clean-clone full suite passed. |
| F-4-4 | README gives the direct “If Chromium is missing…” instruction. | Copy-audit regression. |
| F-4-5 | README describes database behavior before implementation detail. | Copy-audit regression. |
| F-4-6 | README describes service-worker behavior as offline caching and updates. | Copy-audit regression. |
| F-4-7 | Corrected every recorded count and tied rows to source with one counting rule. | `keeps every recorded copy-audit count tied to product source`; 11 unit/policy tests passed. |
| F-5-1 | Kept the stronger promise and expanded its claim: an unlicensed real packet now reaches 100%, stores an attachment, and exports a ZIP whose evidence member is inspected before the second-packet gate is tested. | `@claim:free-and-paid the first complete packet and core exports are free…`; all 25 clean-clone claim commands passed; [lifetime license section](https://compliance-evidence-pack.sociobot.in/). |
| F-5-2 | Added `hero-art-provenance`, source/derivative SHA-256 records, and a browser test for the matching factory-image sidecars, retained source, exact served hero/social bytes, live references, and footer disclosure. | `@claim:hero-art-provenance`; provenance hash policy test; [desktop first screen](./qa-artifacts/polish-5-live/first-screen-desktop.png); [root](https://compliance-evidence-pack.sociobot.in/). |
| F-5-3 | Route transitions add `tabindex=-1` to the new h1, focus it, and keep the polite announcement. Back does the same. | `route titles, designed 404, keyboard dialog, mobile layout, CSP, and accessibility pass`; live audit directly checks Privacy and Back h1 focus; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-5-4 | Deleted the first-screen “Evidence in order. Questions in view.” slogan. | Copy regression forbids both fragments; [mobile](./qa-artifacts/polish-5-live/first-screen-mobile.png) and [desktop](./qa-artifacts/polish-5-live/first-screen-desktop.png). |
| F-5-5 | Replaced the mood caption with “Sample filing-period evidence.” | Copy-audit regression; [desktop first screen](./qa-artifacts/polish-5-live/first-screen-desktop.png); [root](https://compliance-evidence-pack.sociobot.in/). |
| F-5-6 | Renamed the capability h2 to “What Deadline Packet does not do.” | Copy-audit regression; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-5-7 | Made “Lifetime license” the paid-section h2 and “Pricing” its factual label. | Copy-audit regression plus `@claim:free-and-paid`; [root](https://compliance-evidence-pack.sociobot.in/). |
| F-5-8 | Replaced the Privacy h1 with “How Deadline Packet stores and sends data.” | Route/heading regression and live h1-focus audit; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-5-9 | Replaced service-worker jargon with the observable offline result. | `@claim:offline-reload`; copy regression; [Privacy](https://compliance-evidence-pack.sociobot.in/privacy). |
| F-5-10 | Replaced the packet metaphor with “Page not found” and the label “Error 404.” | Live missing route returns HTTP 404 with the correct title/h1 and zero axe violations; [404 screenshot](./qa-artifacts/polish-5-live/404-desktop.png); [live 404](https://compliance-evidence-pack.sociobot.in/round-5-missing). |

## Final verification

- Clean clone `/tmp/compliance-evidence-pack-polish5-clean-1THc7H` at
  `758ecb0b55b77186eeb8cc1f1b0ea6634bab4d55`: `npm ci` found zero
  vulnerabilities. All 25 exact `.factory/claims.json` commands passed
  separately. `CI=1 npm test` then passed 11 unit/policy and 33 Chromium tests.
- `npm run build` produced `dist/`: initial JavaScript 56,043 B raw / 20.04 kB
  gzip and CSS 26,408 B raw / 6.50 kB gzip.
- The live audit recorded 200 responses for `/`, `/demo`, `/privacy`, and
  `/terms`; the missing route returned 404. Every crawled internal link returned
  200 and checkout returned its expected 303.
- Live axe scans found zero violations on root, demo, Privacy, Terms, and 404.
  The factory URL verifier found the title, `lang`, one h1, main landmark,
  complete image alt text, labelled buttons, and zero console errors on root.
- Live demo isolation, reset, exit, offline edit, and offline ZIP export passed.
  The live audit recorded no demo third-party request and no undersized text.
- Live assets byte-match `dist/`: JavaScript SHA-256
  `41ea4a1816b5f13f73152e02540722ccf5954a7ff9fc7a89bee264fa56354680`;
  CSS SHA-256
  `bd15702f933a84729f53561316ff2eb299f32dafc79f237b2cd20b46fa8312a8`.
- Lighthouse 12.7.0 mobile: Performance 97, Accessibility 100, Best Practices
  100, SEO 100; FCP 991 ms, LCP 998 ms, TBT 190.5 ms, CLS 0.

No finding of any severity remains unresolved.
