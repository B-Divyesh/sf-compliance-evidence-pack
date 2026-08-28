# Deadline Packet — repair handoff

Work order: `compliance-evidence-pack-repair-1`  
Repaired: 2026-08-28  
Verifier report: `5424a3250e6e5fb8334ebc4d00ce613dae01e790`  
Failed candidate: `7f6d636d76500c6a025c3e49c3896ac48fb12b1c`  
Repair commit: `1eb796a0c4297e2596c67c574c2f9690a647b0ef`

## Outcome

Every release-blocking and acceptance finding in
`.factory/verification.md` has a root-cause repair and regression test.
Previously passing packet creation, validation, encrypted attachments,
checklists, questions, ZIP/PDF/JSON output, import, persistence, paid license,
responsive layout, and legal routes remain covered.

## Finding-by-finding repair

1. **Missing claims contract:** added `.factory/claims.json` with seven public
   claims. Each ID occurs in exactly one observable Playwright test.
2. **Missing isolated demo:** `/demo` and `/?demo=1` now seed a complete
   Apr–Jun packet. Demo data uses IndexedDB `deadline-packet-demo` and a
   `demo:` current key. The persistent banner offers **Reset demo** and
   **Start for real**. Reset/exit never changes the real packet database.
3. **First-screen copy:** the headline is now “Prepare evidence for your
   accountant.” The next line names freelancers with cross-border income. A
   visible **Try it with sample data** action opens the working sample in one
   click. `.factory/copy-audit.md` records word counts and terminology.
4. **Missing CSP:** app markup no longer requires inline runtime styles or
   handlers. Vite preview and `staticwebapp.config.json` emit a strict CSP,
   referrer policy, and nosniff policy.
5. **Weak asset caching:** `/assets/*` and `/icons/*` receive
   `public, max-age=31536000, immutable`; `sw.js` receives `no-cache`.
6. **Shared route titles:** home, demo, privacy, terms, packet, offline, and
   404 states now set specific titles. Canonical URLs update with routes.
7. **No designed 404/static routing:** unknown paths render a night-market
   “misfiled page” state. The build emits `404.html`, direct route entries,
   and an SPA navigation fallback.
8. **Unproven PWA updates:** a browser regression serves the real production
   worker as v1 and v2. It proves the old cache is removed, the new shell takes
   control, and the reload notice appears.
9. **Wrong manifest MIME:** the host policy and local preview serve
   `.webmanifest` as `application/manifest+json`.

## Exact verification

The work order’s complete clean command passed:

```sh
npm ci && npm test && npm run build
```

- `npm ci`: 61 packages, 0 vulnerabilities.
- Type/lint gate: `tsc --noEmit` passed. No separate linter is configured.
- Vitest: 3/3 passed, including export generation and deployment policy.
- Playwright 1.58.2 Chromium: 12/12 passed.
- Claim commands: all seven commands in `.factory/claims.json` passed
  independently from fresh browser contexts.
- Accessibility: Playwright axe found 0 serious/critical issues on landing,
  demo dashboard, privacy, and terms. Keyboard coverage proves skip-link focus,
  Space activation, dialog focus, and Escape close. Reduced motion has no
  running animation. Desktop and 390×844 layouts have no horizontal overflow.
- Privacy: the full demo add/edit/export flow made same-origin requests only.
  IndexedDB inspection proved known attachment plaintext is absent at rest.
- PWA: an offline demo reload retained data, accepted an edit, and exported a
  ZIP. The update regression replaced v1 with v2 and deleted the old cache.
- Response policy: local responses include CSP, nosniff, route-specific titles,
  correct manifest MIME, and immutable asset caching. Root, demo, privacy,
  terms, and unknown-route entries all returned the application.
- Factory URL verifier: landing and demo had title, `lang`, one `h1`,
  `main`, image alt text, and zero console/page errors. Evidence is under
  `/work/.evidence/local-root` and `/work/.evidence/local-demo`.
- Mobile Lighthouse 12.8.2: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.1 s, LCP 1.9 s, TBT 40 ms, CLS 0.
- Production sizes: JS 48,890 B raw / 18,199 B gzip; CSS 23,540 B raw /
  6,074 B gzip; hero 95,956 B; social image 56,770 B.
- Package/consumer testing is not applicable to this static PWA.

Local production hashes before deployment:

| File | SHA-256 |
| --- | --- |
| `dist/index.html` | `881004c42cabaad1e0fb01f4c914fbfcbdddca17b7171f31b53e4b88236efb8c` |
| `dist/assets/index-C1JtUNRV.js` | `1c47ecef5b22bcc70868513c7c417b64c6bf5035b2d73570dbbedb0bd8ee016f` |
| `dist/assets/index-BjFPVpUn.css` | `00dd646d7b8fee1214ae52c9fe4368ed0971e50bca05e559aa564f6d140077ab` |
| `dist/sw.js` | `c19370ce1a1c7b9430acf4ec0584af7738d734131d40377dcf11aec4bc615780` |

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh compliance-evidence-pack dist
```

The artifact remains a Vite + TypeScript local-first PWA with static output in
`dist/`.

## Known limits

- The product remains an organizational tool, not tax/legal advice, OCR,
  document validation, filing calculation, or government submission.
- The browser’s storage quota and 25 MB per-file guard still apply.
- Site-data clearing removes the device-bound encryption key and local data.
- The license contract is tested with an intercepted valid API response. No
  real purchase is made during repository verification.

## Deployment record

Pending production upload and live identity verification.
