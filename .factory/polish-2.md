# Polish 2 — final finding reconciliation

Verified 2026-08-28 at repair commit `8d07e107745ede130a57c820f0380f34af9ea06f` and after deployment `9cf85005-0fdb-45b7-a0c8-6cf215fc6159`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Serialized saves and preserved active drafts through workbench repaint. | `@claim:question-retention`; full 30-browser-test run. |
| F-1-2 | Replaced the ambiguous demo wording with the observable seeded contents. | `@claim:demo-seed`; live `/demo`. |
| F-1-3 | Documented the two-file, four-gap, two-question seed in README. | `@claim:demo-seed`. |
| F-1-4 | Kept the editable handoff date durable and locale-safe. | `@claim:editable-handoff-date`. |
| F-1-5 | Kept accountant questions durable beside attached files. | `@claim:question-retention`. |
| F-1-6 | Made demo exit discard only demo changes and reopen real work. | `@claim:demo-exit`; live demo banner. |
| F-1-7 | Limited the Sociobot network statement to buying or verifying a license. | `@claim:license-network-boundary`. |
| F-1-8 | Removed untestable merchant/refund assertions. | `@claim:free-and-paid`; live checkout redirect. |
| F-1-9 | Removed the unproved retry wording; retained tested non-blocking behavior. | `@claim:license-nonblocking`. |
| F-1-10 | Extended retention coverage to IndexedDB, Cache Storage, and localStorage clearing. | `@claim:local-retention`. |
| F-1-11 | Set readable mobile labels and controls to at least 16 px. | 390 px readable-text browser test. |
| F-1-12 | Tightened the desktop hero without reducing readable text. | Desktop first-screen geometry test. |
| F-1-13 | Kept Demo, Privacy, and Terms in the 390 px top rail. | Mobile structure browser test; live root screenshot. |
| F-1-14 | Added the seeded packet preview before How it works. | Landing-order browser test. |
| F-1-15 | Put the workbench and its h1 before drawer headings in DOM order. | Demo heading-outline browser test. |
| F-1-16 | Replaced “accountant-ready” with accountant-review language. | Copy audit. |
| F-1-17 | Replaced subjective gap copy with the checklist result. | Copy audit. |
| F-1-18 | Named evidence gaps and accountant questions directly. | Copy audit. |
| F-1-19 | Standardized the purchase as a lifetime license. | `@claim:free-and-paid`; copy audit. |
| F-1-20 | Standardized missing checklist items as evidence gaps. | `@claim:missing-evidence`; copy audit. |
| F-1-21 | Replaced landing storage jargon with browser language. | Copy audit. |
| F-1-22 | Rewrote README storage language for people, not implementation. | Copy audit. |
| F-1-23 | Rewrote README encryption language in plain words. | `@claim:encrypted-storage`; copy audit. |
| F-1-24 | Documented separate demo storage in user-facing terms. | `@claim:demo-isolation`; `.factory/demo.md`. |
| F-1-25 | Named the exact required Playwright version. | README and `package.json`. |
| F-1-26 | Split the long build/deploy sentence. | Copy audit. |
| F-1-27 | Named the restore result “Restore a lifetime license.” | `@claim:free-and-paid`. |
| F-2-1 | Removed the false phone hero viewport reservation; compacted mobile hero spacing and added the exact 390 × 844 assertion. | `landing and demo keep…`; live mobile facts end at 751.19, 781.98, and 837.58 px; [`mobile-first-screen.png`](./qa-artifacts/polish-2-live/mobile-first-screen.png). |

## Earlier verification findings

The full suite also retains coverage for isolated demo storage and reset, every
declared claim, one-click `?demo=1`, route titles and focus announcements,
designed HTTP 404, CSP/cache/MIME, update flow, offline reload/export,
malformed-import recovery, whitespace-name validation, deletion confirmation,
mobile 200% reflow and 44 px controls, and the no-tax/no-legal/no-validation/
no-submission/no-OCR boundaries. No previously recorded finding remains open.

## Final evidence

- A separate clean clone at the repair commit ran `npm ci`, then every one of
  the 22 exact commands in `.factory/claims.json` individually: all passed.
- `CI=1 npm test` passed: TypeScript, 7 Vitest/policy tests, and 30 Chromium
  tests. `npm run build` produced `dist/`.
- Live cold checks at `/`, `/demo`, `/privacy`, and `/terms` found the correct
  titles, one h1 each, and zero serious/critical axe issues. `/polish-2-missing`
  returned HTTP 404. The live demo banner included Reset demo and Start for real.
- Factory URL verification report: `qa-artifacts/polish-2-live/verify.json`.
  Screenshots: `qa-artifacts/polish-2-live/mobile-first-screen.png` and
  `qa-artifacts/polish-2-live/mobile-demo.png`.
- Lighthouse mobile: Performance 99, Accessibility 100, FCP 1.5 s, LCP 1.9 s,
  TBT 60 ms, CLS 0 (`qa-artifacts/polish-2-live/lighthouse-live.json`).
