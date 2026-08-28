# Polish 1 — final finding reconciliation

Verified 2026-08-28 at commit `9d9021057420e2fd227a9c68990747d51f6a31df`
and at <https://compliance-evidence-pack.sociobot.in>.

Evidence keys used below:

- **Root screen:** `qa-artifacts/polish-1-retry2-live-root-desktop.png`.
- **Demo screen:** `qa-artifacts/polish-1-retry2-live-demo-mobile.png`.
- **Deadline screen:** `qa-artifacts/polish-1-retry2-live-deadline.png`.
- **Live report:** `qa-artifacts/polish-1-retry2-live-report.json`.
- **URL verifier:** `qa-artifacts/polish-1-retry2-verify/verify.json`.
- **Lighthouse:** `qa-artifacts/polish-1-retry2-lighthouse-live.json`.

| Finding | Change made | Test and live evidence |
| --- | --- | --- |
| F-1-1 | Serialized mutations, retained active drafts, delayed burst repainting, and preserved open disclosures. | `@claim:question-retention` keeps 10 rapid questions across reload; Demo screen; live `/demo` edit/reset/offline check passed. |
| F-1-2 | Replaced the “complete” promise with observable sample contents and declared `demo-seed`. | `@claim:demo-seed`; Root and Demo screens; live `/?demo=1` showed files, evidence gaps, and questions. |
| F-1-3 | README now states the exact sample counts covered by `demo-seed`. | `@claim:demo-seed`; Demo screen; live `/?demo=1` showed 2 files, 4 evidence gaps, and 2 questions. |
| F-1-4 | Declared editable handoff dates and made formatting, save completion, repaint, and persistence deterministic. | `@claim:editable-handoff-date`; Deadline screen; live `/` showed `20 Nov 2026` after save and reload. |
| F-1-5 | Declared retained accountant questions and protected their form from save repaints. | `@claim:question-retention`; Demo screen; live `/demo` remained editable. |
| F-1-6 | Corrected the wording and deletes only demo changes before opening the unchanged real workspace. | `@claim:demo-exit`; Demo screen; live `/?demo=1` exposed Reset demo and Start for real. |
| F-1-7 | Reduced the network statement to the tested Sociobot license boundary. | `@claim:license-network-boundary`; Live report; live demo requests stayed same-origin until license verification. |
| F-1-8 | Removed unverified merchant/refund statements and retained “Checkout opens on Sociobot/Dodo.” | `@claim:free-and-paid`; Root screen; live checkout link points to the Sociobot endpoint. |
| F-1-9 | Removed the unproved retry promise and retained the non-blocking statement. | `@claim:license-nonblocking`; live `/privacy` check passed. |
| F-1-10 | Clearing IndexedDB, Cache Storage, and localStorage is now part of the retention claim test. | `@claim:local-retention`; full 30-test run passed. |
| F-1-11 | Raised every readable mobile label, status, date, metadata line, and control to at least 16 px. | `all visible readable text meets…`; Demo screen; live `/demo` at 390 px inspected. |
| F-1-12 | Tightened desktop hero geometry without shrinking body text. | `landing and demo keep…`; Root screen; live fact bottoms were 795.83, 826.63, and 857.42 px at 1440×900. |
| F-1-13 | Kept Demo, Privacy, and Terms visible in a compact mobile rail. | `landing and demo keep…`; Demo screen; all three links visible live at 390 px. |
| F-1-14 | Added a read-only evidence-gap, question, and export preview before How it works. | `landing and demo keep…`; Root screen; live root preview present in the required order. |
| F-1-15 | Moved the workbench before the drawer in DOM order. | `landing and demo keep…`; Demo screen; live demo’s first main heading is its h1. |
| F-1-16 | Replaced “accountant-ready” with “for accountant review.” | `.factory/copy-audit.md`; Root screen; live root copy checked cold. |
| F-1-17 | Replaced “without guesswork” with the checklist’s observable result. | `.factory/copy-audit.md`; Root screen; live How it works says “See which checklist items are still missing.” |
| F-1-18 | Replaced “clearly labelled” with the concrete gap/question behavior. | `.factory/copy-audit.md`; Root screen; live boundary section checked. |
| F-1-19 | Standardized the paid capability as “lifetime license.” | `@claim:free-and-paid`; Root screen; live purchase and restore labels match. |
| F-1-20 | Standardized the missing-item concept as “evidence gap.” | `@claim:missing-evidence`; Root and Demo screens; live copy checked. |
| F-1-21 | Replaced landing-page IndexedDB jargon with “Stored in this browser.” | `.factory/copy-audit.md`; Root screen; live boundary list checked. |
| F-1-22 | Rewrote README storage copy in user-facing language. | README copy audit; repository at the verified commit. |
| F-1-23 | Rewrote README encryption copy in user-facing language. | `@claim:encrypted-storage`; repository at the verified commit. |
| F-1-24 | Rewrote demo storage documentation around separation from real work. | `@claim:demo-isolation`; `.factory/demo.md`; live `/?demo=1` used only `deadline-packet-demo`. |
| F-1-25 | Replaced “pinned” with the explicit Playwright 1.58.2 requirement. | README copy audit; `package.json` uses 1.58.2. |
| F-1-26 | Split the long build/deploy sentence into two plain sentences. | README copy audit; repository at the verified commit. |
| F-1-27 | Relabelled the disclosure “Restore a lifetime license.” | `@claim:free-and-paid`; Root and Deadline screens; live label checked. |
| Controller date failure | Fixed locale-dependent output, awaited the storage write and repaint, and asserted IndexedDB plus post-reload state. | `@claim:editable-handoff-date`; Deadline screen; live `/` showed `20 Nov 2026` before and after reload. |

## Earlier verification reconciliation

The full 30-test run also rechecked every earlier verification defect named in
`review-1.md`: isolated demo, claim inventory, CSP/cache/MIME, titles and real
404, checkout price, malformed imports and corrupt-row recovery, whitespace
names, mobile 200% reflow and 44 px targets, route focus/announcement, deletion
confirmation, hidden mobile hero loading, offline updates, and copy terminology.
All pass. No earlier finding remains open.

## Final evidence

- Clean clone `/tmp/compliance-evidence-pack-clean-AxD8Jl` at the verified SHA:
  `npm ci` passed and all 22 exact claim commands passed separately.
- `CI=1 npm test`: 7 unit/policy tests and all 30 Chromium tests passed.
- `npm run build`: `dist/` produced; JS 54.32 kB raw / 19.76 kB gzip and CSS
  25.98 kB raw / 6.43 kB gzip.
- Factory URL verifier: 200, correct title/lang/main/alt labels, zero console
  errors. Playwright axe: zero serious/critical issues on five live routes.
- Lighthouse 12.7.0 mobile: Performance 100, Accessibility 100, FCP 0.9 s,
  LCP 1.0 s, TBT 0 ms, CLS 0.
- Deployment `77b24693-dc20-4517-b745-e2239c0fc597`; live JS and CSS SHA-256
  values byte-match `dist/`.

No finding of any severity remains unresolved.
