# Polish 4 — cumulative finding reconciliation

Verified 2026-08-28 at repair commits `16ca1a15055aa664af29c04607b26f4704b7d246`
and `a365b70680ab0abd894742a173b0092e7871414f`. The final static deployment is
Azure deployment `0481da0a-bb00-4181-9230-13391dbc3b1f` at
<https://compliance-evidence-pack.sociobot.in>.

Current live evidence:

- [mobile first screen](./qa-artifacts/polish-4-live/first-screen-mobile.png)
- [desktop first screen](./qa-artifacts/polish-4-live/first-screen-desktop.png)
- [mobile demo](./qa-artifacts/polish-4-live/demo-mobile.png)
- [mobile offline demo](./qa-artifacts/polish-4-live/offline-demo-mobile.png)
- [designed 404](./qa-artifacts/polish-4-live/404-desktop.png)
- [demo/isolation report](./qa-artifacts/polish-4-live/demo-report.json)
- [route, focus, link, and axe report](./qa-artifacts/polish-4-live/routes-report.json)
- [cleared-data report](./qa-artifacts/polish-4-live/cleared-data-report.json)
- [offline report](./qa-artifacts/polish-4-live/offline-report.json)
- [factory URL verification](./qa-artifacts/polish-4-live/verify/verify.json)
- [Lighthouse report](./qa-artifacts/polish-4-live/lighthouse.json)

## Finding matrix

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept serialized saves and preserved active drafts so a checklist repaint cannot replace a submitted question. | `@claim:question-retention`; [live demo](https://compliance-evidence-pack.sociobot.in/demo); [demo screenshot](./qa-artifacts/polish-4-live/demo-mobile.png). |
| F-1-2 | Replaced the misleading “complete” wording with the sample's observable files, evidence gaps, and questions. | `@claim:demo-seed`; [live `?demo=1`](https://compliance-evidence-pack.sociobot.in/?demo=1); [demo screenshot](./qa-artifacts/polish-4-live/demo-mobile.png). |
| F-1-3 | README states the exact two-file, four-gap, two-question sample covered by the declared claim. | `@claim:demo-seed`; README; [demo report](./qa-artifacts/polish-4-live/demo-report.json). |
| F-1-4 | The user-chosen handoff date is editable and durable. | `@claim:editable-handoff-date`; [live demo](https://compliance-evidence-pack.sociobot.in/demo); [demo screenshot](./qa-artifacts/polish-4-live/demo-mobile.png). |
| F-1-5 | Accountant questions remain beside files through rapid edits and reload. | `@claim:question-retention`; [live demo](https://compliance-evidence-pack.sociobot.in/demo); [demo screenshot](./qa-artifacts/polish-4-live/demo-mobile.png). |
| F-1-6 | Start for real deletes all demo namespaces and opens unchanged real work. | `@claim:demo-exit` and `@claim:demo-isolation`; [live `?demo=1`](https://compliance-evidence-pack.sociobot.in/?demo=1); `demo-report.json` shows no demo keys after exit. |
| F-1-7 | Public network copy is limited to buying or verifying a lifetime license. | `@claim:license-network-boundary`; [live Privacy](https://compliance-evidence-pack.sociobot.in/privacy); live demo report records zero third-party requests. |
| F-1-8 | Removed merchant/refund assertions and retained only the observable checkout destination. | `@claim:free-and-paid`; [live root](https://compliance-evidence-pack.sociobot.in/); link crawl records the checkout's HTTP 303. |
| F-1-9 | Removed the unproved online-retry promise and retained the tested non-blocking statement. | `@claim:license-nonblocking`; [live Privacy](https://compliance-evidence-pack.sociobot.in/privacy); [Privacy screenshot](./qa-artifacts/polish-4-live/privacy-desktop.png). |
| F-1-10 | The retention test now clears IndexedDB, Cache Storage, and localStorage and proves the packet does not return. | `@claim:local-retention`; [live cleared-data report](./qa-artifacts/polish-4-live/cleared-data-report.json). |
| F-1-11 | Raised every `small` label to 1rem and made the mobile typography test wait for all seven checklist rows and both files. | `all visible readable text meets the documented 16px minimum at 390px`; live demo report has `undersized: []`; [demo screenshot](./qa-artifacts/polish-4-live/demo-mobile.png). |
| F-1-12 | Retained compact desktop hero geometry so every required fact fits at 1440×900. | `landing and demo keep the reviewed first-screen…`; [live desktop](./qa-artifacts/polish-4-live/first-screen-desktop.png). |
| F-1-13 | Demo, Privacy, and Terms remain visible in the phone header. | `landing and demo keep the reviewed first-screen…`; [live mobile](./qa-artifacts/polish-4-live/first-screen-mobile.png). |
| F-1-14 | The read-only packet preview remains before How it works. | `landing and demo keep the reviewed first-screen…`; [live root](https://compliance-evidence-pack.sociobot.in/); desktop screenshot. |
| F-1-15 | The workbench h1 remains before drawer headings in DOM order. | `landing and demo keep the reviewed first-screen…`; [live demo](https://compliance-evidence-pack.sociobot.in/demo); route report records one h1. |
| F-1-16 | “Accountant-ready” remains removed in favor of “for accountant review.” | `ships exact plain metadata…` and copy-audit test; [live root](https://compliance-evidence-pack.sociobot.in/); first-screen screenshot. |
| F-1-17 | The checklist step names the observable missing-item result instead of “without guesswork.” | Copy-audit regression; [live root](https://compliance-evidence-pack.sociobot.in/); desktop screenshot. |
| F-1-18 | The boundary copy directly names evidence gaps and accountant questions. | Copy-audit regression; [live root](https://compliance-evidence-pack.sociobot.in/); desktop screenshot. |
| F-1-19 | Public entitlement language consistently uses “lifetime license.” | `@claim:free-and-paid` and `ships exact plain metadata…`; [live root](https://compliance-evidence-pack.sociobot.in/); demo screenshot. |
| F-1-20 | Public missing-item language consistently uses “evidence gap.” | `@claim:missing-evidence`; [live demo](https://compliance-evidence-pack.sociobot.in/demo); demo screenshot. |
| F-1-21 | Landing storage copy remains “Stored in this browser.” | Copy-audit regression; [live root](https://compliance-evidence-pack.sociobot.in/); desktop screenshot. |
| F-1-22 | README storage wording describes the user-visible browser behavior. | Copy-audit source/count regression and README project map. |
| F-1-23 | README explains encryption in browser-facing words; technical detail stays in Privacy. | `@claim:encrypted-storage`; [live Privacy](https://compliance-evidence-pack.sociobot.in/privacy); Privacy screenshot. |
| F-1-24 | Demo documentation describes separate packet and sample-license namespaces. | `@claim:demo-isolation`; `.factory/demo.md`; live report shows only `deadline-packet-demo` and `demo:` storage. |
| F-1-25 | README names Playwright 1.58.2 and gives a direct Chromium setup instruction. | Package pin plus copy-audit regression. |
| F-1-26 | Build and deploy guidance remains split into short sentences. | Copy-audit source/count regression; README. |
| F-1-27 | The disclosure names its result “Restore a lifetime license.” | `@claim:free-and-paid`; [live root](https://compliance-evidence-pack.sociobot.in/); desktop screenshot. |
| F-2-1 | Retained the compact 390×844 hero; the last fact ends at 837.58 px. | `landing and demo keep the reviewed first-screen…`; routes report; [mobile first screen](./qa-artifacts/polish-4-live/first-screen-mobile.png). |
| F-3-1 | Demo packet and license stores remain isolated; activation is canned and never calls Sociobot. | `@claim:demo-isolation`; [live `?demo=1`](https://compliance-evidence-pack.sociobot.in/?demo=1); demo report records zero third-party requests. |
| F-3-2 | The lifetime-license storage sentence is declared and tested through restore, reload, and removal. | `@claim:license-local-storage`; [live Privacy](https://compliance-evidence-pack.sociobot.in/privacy); Privacy screenshot. |
| F-3-3 | Removed all entitlement-name variants; “lifetime license” is the one public term. | `ships exact plain metadata…` and copy-audit regression; live root/demo checks. |
| F-3-4 | The full offline status stays visible and unclipped on phones. | `@claim:offline-reload`; live offline report has `statusFits: true`; [offline screenshot](./qa-artifacts/polish-4-live/offline-demo-mobile.png). |
| F-3-5 | The summary uses singular “1 open question.” | `@claim:demo-seed`; [live demo](https://compliance-evidence-pack.sociobot.in/demo); demo screenshot. |
| F-3-6 | Route, Open Graph, and Twitter descriptions use plain evidence-gap language. | `ships exact plain metadata…`; live route report; root verifier. |
| F-3-7 | The linked Apple touch icon remains a dedicated 180×180 PNG. | `ships exact plain metadata…`; live root metadata check. |
| F-3-8 | The create dialog consistently says “New packet.” | `ships exact plain metadata…`; dialog keyboard browser test; [live root](https://compliance-evidence-pack.sociobot.in/). |
| F-4-1 | Applied the 16 px minimum to native `small` elements and changed the test to inspect the final seeded workspace, not the loading shell. | `all visible readable text meets…`; live demo report `undersized: []`; [mobile demo](./qa-artifacts/polish-4-live/demo-mobile.png). |
| F-4-2 | Added `cleared-data-recovery` to the claim inventory with a real encrypted-attachment/key erasure test. | `@claim:cleared-data-recovery`; live report proves packet/file/key counts go from 1/1/1 to 0/0/0 with no recovery action or request. |
| F-4-3 | README now says `npm test` checks types, unit tests, and browser tests. | Copy-audit source/count regression; README. |
| F-4-4 | README now says “If Chromium is missing…” without factory-image jargon. | Copy-audit source/count regression; README. |
| F-4-5 | README describes `src/db.ts` by its storage, encryption, and separation behavior. | Copy-audit source/count regression; README. |
| F-4-6 | README describes `public/sw.js` as caching the app and installing updates. | Copy-audit source/count regression; README. |
| F-4-7 | Corrected all three word counts, documented the counting rule, and added a source-linked count/22-word/banned-word test. | `keeps every recorded copy-audit count tied to product source`; `.factory/copy-audit.md`. |

## Additional end-to-end hardening

The final live audit found that the mobile dashboard hid its entire tool block.
The 390 px layout now keeps backup import and the sample/lifetime-license card
reachable below the packet drawer. `landing and demo keep the reviewed
first-screen…` asserts both controls, and `demo-report.json` records both as
visible on the deployed phone layout.

## Final evidence

- Final clean clone `/tmp/compliance-evidence-pack-polish4-final-tTBh10` at
  `a365b70680ab0abd894742a173b0092e7871414f`: `npm ci` found zero
  vulnerabilities; all 24 exact commands from `.factory/claims.json` passed
  separately.
- Work-order build command `npm ci && CI=1 npm test && npm run build`: types
  passed, 10 unit/policy tests passed, 32 Chromium tests passed, and `dist/`
  was produced.
- Initial JavaScript is 56,145 B raw / 19,962 B gzip. CSS is 26,408 B raw /
  6,531 B gzip. Live and local SHA-256 values match for both files.
- Factory URL verifier: HTTP 200, correct title/lang/h1/main/alt/button names,
  2.33 s cold load, and zero console errors.
- Live axe scans: zero violations on `/`, `/demo`, `/privacy`, `/terms`, and
  the designed HTTP 404. Every crawled link returned 200; checkout returned
  its expected 303. SPA navigation and Back both focused `#main` and announced
  the new h1.
- Live offline reload retained the demo, saved a checklist edit, displayed the
  full offline badge, and downloaded the accountant ZIP.
- Lighthouse 12.7.0 mobile: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; FCP 974 ms, LCP 1,057 ms, TBT 109 ms, CLS 0.

No review finding of any severity remains unresolved.
