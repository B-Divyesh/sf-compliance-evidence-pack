# Deadline Packet — build handoff

Work order: `compliance-evidence-pack-build-1`  
Completed: 2026-08-28

## What shipped

- A responsive, installable local-first PWA for assembling filing-period
  evidence into an accountant handoff.
- Packet creation and editing with user-defined period and handoff date,
  jurisdiction-neutral checklist, live missing-evidence list, local
  attachments, questions, contact, note, recent history, duplication, and
  confirmed deletion.
- Real IndexedDB persistence. Attachment bytes are encrypted at rest with
  AES-256-GCM and a non-exportable browser-profile key where Web Crypto is
  available; decryption happens only for display/export.
- Accountant ZIP export containing the original evidence files, a printable
  HTML index, generated PDF index, and machine-readable manifest. Standalone
  PDF and complete restorable JSON backup/import are also included.
- Versioned service-worker shell precache, cache-first local assets, navigation
  fallback, install prompt, online/offline status, and update toast. Packet
  state and export were explicitly tested after an offline reload.
- One fully usable packet is free. A US$19 one-time Sociobot/Dodo license adds
  unlimited packets and duplication. Query-token capture, local storage,
  once-daily verification, optimistic offline access, invalid-license locking,
  and paste-to-restore follow the paid-unlock contract. No product ID is
  embedded; the slug route is used.
- Original night-market evidence still life generated with `factory-image`,
  manually reviewed and shipped as a 94 KB WebP. Prompt, review, source, and
  licensing provenance are in `.factory/design.md` and `assets/src/`.
- Privacy and terms routes, expanded README, MIT license, robots/sitemap files,
  PWA icons, explicit retention copy, no analytics, no runtime CDN assets, and
  no automatic document transmission.

## How to run and verify

```sh
npm ci
npm test
npm run build
```

The deploy command is exactly `npm run build`. It creates `dist/index.html` at
the required static root plus direct-entry `privacy/index.html` and
`terms/index.html` files.

Verification completed from a clean production build:

- TypeScript `tsc --noEmit`: pass.
- Vitest: 2/2 pass (PDF signature/content and ZIP construction).
- Playwright 1.58.2 / Chromium: 6/6 pass (full create→attach→question→ZIP
  journey, encrypted-at-rest assertion, landing/dashboard/legal axe scans,
  JSON import, license capture/verification, 390 px overflow check, and
  service-worker-controlled offline reload with state intact).
- axe-core: no serious or critical findings on landing, working dashboard, or
  privacy page.
- `npm audit`: 0 vulnerabilities.
- Production output: initial JS 44.46 KB (16.98 KB gzip), CSS 21.93 KB
  (5.73 KB gzip), hero WebP 94 KB. All are below factory budgets.
- Lighthouse 12.8.2 mobile: Performance 98, Accessibility 100, Best Practices
  100, SEO 100. FCP 1.1 s, LCP 2.0 s, TBT 110 ms, CLS 0.
- One `<h1>` per rendered screen, `lang`, `<main>`, meaningful hero alt text,
  designed focus states, 44 px targets, reduced-motion fallback, and verified
  dark/paper contrast are present.

## Known limits and deliberate non-goals

- This is an organizational tool, not tax/legal advice, OCR, document
  validation, a filing calculation, or a government submission integration.
- Templates stay jurisdiction-neutral until qualified reviewers provide
  country-specific requirements.
- The 25 MB per-file guard and the browser's overall storage quota apply. The
  app cannot recover data or its device-bound encryption key after site data is
  cleared; the UI therefore keeps backup/export controls prominent.
- Live checkout depends on factory registration of the product slug. Browser
  coverage verifies the documented API contract with an intercepted valid
  response; no real purchase was made from this repository.

## Factory next step

Register `compliance-evidence-pack` in the Sociobot billing engine with the
production return URL, deploy `dist/`, then smoke-test one real checkout and
license return on the deployed origin. No DNS, billing, or infrastructure was
changed by this build.
