# Polish 3 — cumulative finding reconciliation

Verified 2026-08-28 at repair commit
`270d696e6da8e1e60d5bbdde9ce55724f45d982a` and after deployment
`0e9a00ef-39f0-49f5-a260-7d41fd24f490` at
<https://compliance-evidence-pack.sociobot.in>.

Evidence used below:

- [final live report](./qa-artifacts/polish-3-live/live-report.json)
- [factory URL verifier](./qa-artifacts/polish-3-live/verify/verify.json)
- [mobile first screen](./qa-artifacts/polish-3-live/first-screen-mobile.png)
- [mobile demo](./qa-artifacts/polish-3-live/demo-mobile.png)
- [mobile offline demo](./qa-artifacts/polish-3-live/offline-demo-mobile.png)
- [desktop demo](./qa-artifacts/polish-3-live/demo-desktop.png)
- [Lighthouse report](./qa-artifacts/polish-3-live/lighthouse.json)

## Finding matrix

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept serialized saves and active drafts so a concurrent checklist repaint cannot replace a submitted question. | `@claim:question-retention`; full 31-browser-test run. |
| F-1-2 | The first screen names the visible sample contents instead of calling the incomplete packet complete. | `@claim:demo-seed`; mobile first screen; live `/demo`. |
| F-1-3 | README gives the two-file, four-gap, two-question seed covered by the declared claim. | `@claim:demo-seed`; mobile demo. |
| F-1-4 | The chosen handoff date remains editable, stored, locale-safe, and durable after reload. | `@claim:editable-handoff-date`. |
| F-1-5 | Accountant questions remain beside files through rapid edits and reload. | `@claim:question-retention`. |
| F-1-6 | Start for real deletes every demo namespace and reopens unchanged real work. | `@claim:demo-exit`; `@claim:demo-isolation`; live report. |
| F-1-7 | The public network statement is limited to buying or verifying a lifetime license. | `@claim:license-network-boundary`; live report records zero Sociobot demo requests. |
| F-1-8 | Removed unprovable merchant/refund assertions; copy now says checkout opens on Sociobot/Dodo. | `@claim:free-and-paid`; live checkout returned 303 to Dodo at US$12. |
| F-1-9 | Removed the unproved retry promise and retained the tested non-blocking behavior. | `@claim:license-nonblocking`; live `/privacy`. |
| F-1-10 | The retention test clears IndexedDB, Cache Storage, and localStorage and proves the packet cannot return. | `@claim:local-retention`. |
| F-1-11 | Retained the 16 px minimum for readable phone text. | `all visible readable text meets…`; mobile demo; axe reports. |
| F-1-12 | Retained compact desktop hero geometry with all three facts in the first screen. | `landing and demo keep…`; full browser suite. |
| F-1-13 | Demo, Privacy, and Terms remain visible in the compact mobile header. | `landing and demo keep…`; mobile first screen. |
| F-1-14 | Retained the packet preview before How it works. | `landing and demo keep…`; live `/`. |
| F-1-15 | The workbench h1 remains first in the demo heading outline. | `landing and demo keep…`; URL verifier reports one h1. |
| F-1-16 | Removed the remaining “accountant-ready” wording from the manifest; all public copy says accountant review. | `ships exact plain metadata…`; `.factory/copy-audit.md`; live metadata. |
| F-1-17 | The landing states the observable checklist result, not “without guesswork.” | `.factory/copy-audit.md`; live `/`. |
| F-1-18 | The boundary copy names evidence gaps and accountant questions directly. | `.factory/copy-audit.md`; live `/`. |
| F-1-19 | Standardized UI, notices, README, policies, and claim copy on **lifetime license**. | `@claim:free-and-paid`; `ships exact plain metadata…`; live root/demo. |
| F-1-20 | Standardized UI, metadata, manifest, README, offline page, and generated ZIP/PDF/HTML copy on **evidence gap**. | `@claim:missing-evidence`; export unit tests; copy audit. |
| F-1-21 | Landing storage copy remains “Stored in this browser.” | `.factory/copy-audit.md`; live `/`. |
| F-1-22 | README storage wording remains user-facing; implementation details stay in the project map. | `.factory/copy-audit.md`; README. |
| F-1-23 | README explains browser encryption in plain words; technical detail remains on Privacy. | `@claim:encrypted-storage`; copy audit. |
| F-1-24 | Demo docs explain the separate browser store and now include the separate demo license namespace. | `@claim:demo-isolation`; `.factory/demo.md`. |
| F-1-25 | README names Playwright 1.58.2 as an exact requirement. | `package.json`; copy audit. |
| F-1-26 | Build and deployment guidance remains split into short, single-purpose sentences. | `.factory/copy-audit.md`; README. |
| F-1-27 | The disclosure remains “Restore a lifetime license.” | `@claim:free-and-paid`; live `/`. |
| F-2-1 | Retained the compact 390 × 844 hero; all privacy, offline, and price facts fit. | `landing and demo keep…`; mobile first screen; live fact bottoms 751.19, 781.98, 837.58 px. |
| F-3-1 | Split license storage by mode. Demo uses `demo:sb_license:*`, canned verification, no purchase/real-token input, and reset/exit cleanup. | `@claim:demo-isolation`; live report; desktop demo. |
| F-3-2 | Rewrote the privacy promise in plain words and declared a restore/reload/remove test for both real license keys. | `@claim:license-local-storage`; live `/privacy`. |
| F-3-3 | Replaced every “one-time license” and “unlock” entitlement reference with **lifetime license**. | `@claim:free-and-paid`; `ships exact plain metadata…`; copy audit. |
| F-3-4 | Kept the full “Offline — edits still save” badge visible on a dedicated phone row without clipping. | `@claim:offline-reload`; mobile offline demo; live geometry 250 px client/scroll width. |
| F-3-5 | Summary pluralizes by count: “1 open question,” otherwise “N open questions.” | `@claim:demo-seed`; mobile demo. |
| F-3-6 | Replaced marketing jargon and bare “gaps” in route, Open Graph, and Twitter descriptions with exact evidence-gap language. | `ships exact plain metadata…`; live report route metadata. |
| F-3-7 | Added and linked a dedicated 180 × 180 Apple touch icon and precached it. | `ships exact plain metadata…`; live report records 180 × 180. |
| F-3-8 | Renamed the create-dialog eyebrow from “New filing folder” to “New packet.” | `ships exact plain metadata…`; route/dialog browser test. |

## Retained earlier acceptance work

The full suite also rechecked every earlier verification issue cited by the
reviews: clean one-click `?demo=1`, reset and exit isolation, complete claim
inventory, titles and route focus, legal links, real HTTP 404, CSP/cache/MIME,
service-worker updates, checkout price, save races, malformed imports, corrupt
legacy rows, whitespace names, confirmation and undo, 200% phone reflow,
44 px targets, hidden hero loading, capability boundaries, privacy, exports,
and offline reload/export. All pass.

## Final evidence

- Clean clone `/tmp/compliance-evidence-pack-polish3-final-PF3VyG` at the repair
  commit: `npm ci` passed with zero vulnerabilities; all 23 exact commands in
  `.factory/claims.json` passed separately.
- `CI=1 npm test`: TypeScript passed, 9 unit/policy tests passed, and all 31
  Chromium tests passed.
- `npm run build`: `dist/` produced; initial JS is 56.15 kB raw / 20.10 kB
  gzip and CSS is 26.33 kB raw / 6.48 kB gzip.
- Final factory URL verification: HTTP 200, correct title/lang/h1/main/alt and
  button labels, and zero console errors.
- Final live axe sweep: zero serious or critical issues on `/`, `/demo`,
  `/privacy`, and `/terms`; an unknown route returned HTTP 404.
- Lighthouse 12.7.0 mobile: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Final live assets byte-match the repair build and use immutable caching.

No finding of any severity remains unresolved.
