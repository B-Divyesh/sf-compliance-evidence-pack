# Deadline Packet — repair 3 handoff

Work order: `compliance-evidence-pack-repair-3`
Base verifier report: `.factory/verification-3.md` at `5a2f449152bede43f450e63507670f4a34368417`
Repaired candidate: `0f544dc35cb5cd055341d45ffc2b51219ac86990`
Artifact: static local-first PWA; deploy `dist/` with `dist/staticwebapp.config.json`.

Date: 2026-08-28

## Repairs

- Prevented a checklist save from replacing an inline question or checklist form while it has a draft. Submitted inline forms clear synchronously, then their serialized save redraws the completed result. The browser regression performs the exact checklist → immediate question → add → reload sequence.
- Added complete runtime backup validation before any database mutation. Packet structure, dates, checklist rows, questions, history, file metadata, base64, and the 25 MiB limit are checked first. A packet and all encrypted imported files then commit in one IndexedDB transaction using one device key.
- Existing malformed packet rows are removed with their attached rows during startup, followed by a recovery notice, so a historical corrupt row cannot brick the drawer. The fatal state also has an explicit local-data recovery action. Regression coverage tests both an incomplete import and a pre-seeded corrupt row.
- Rejected whitespace-only packet names with an in-context native validation message. The dialog remains open and the landing packet is unchanged.
- Reflowed the 390 px/200% workspace: heading and history values wrap, form controls can shrink, the summary stacks, and all supporting copy is at least 16 px. Footer links have a 44 px minimum width. The 200% regression opens packet history and asserts no horizontal overflow.
- Replaced the soft navigation fallback with a static-host 404 override that rewrites the designed `404.html` while returning status 404. Direct product routes remain pre-rendered in `dist/`.
- Expanded the claims inventory with all five public capability boundaries. The paid claim now follows the Sociobot 303 to the hosted Dodo checkout and proves `Deadline Packet` and `$12.00`, rather than trusting application copy.
- Corrected the stale US$19 copy audit and two inaccurate sample-file byte counts. Historical generated backups with the old metadata normalize to the actual attachment byte length on import.

## Verification

- `npm ci` — pass; 61 packages, 0 vulnerabilities.
- `npm test` — pass: TypeScript, 5 Vitest unit/policy tests, and 24 serial Playwright Chromium scenarios. Coverage includes desktop, 390 px, 200% text, keyboard skip/dialog/route focus, serious/critical axe checks, same-origin privacy flow, offline reload/export, service-worker update, storage encryption, malformed import recovery, and the rapid edit regression.
- Every exact command listed in the 17-entry `.factory/claims.json` was run separately after install — all passed. The checkout claim observed a 303 to `checkout.dodopayments.com` and `$12.00` on its hosted page.
- `npm run build` — pass. `dist/index.html` exists. Final initial assets: JavaScript 53,023 B raw / 19.58 kB gzip; CSS 24,346 B raw / 6.14 kB gzip; hero 95,956 B. All are within the static-PWA budgets.
- Local response-policy smoke check confirmed CSP, `Referrer-Policy`, nosniff, `sw.js` no-cache, and manifest MIME. The policy unit test verifies the static platform’s real 404 override. No supplied `verify-url.sh` exists in this repository; equivalent title/lang/main/alt/console and axe checks run in Playwright.
- Local Lighthouse mobile report: `.factory/qa-artifacts/repair-lighthouse-local.json` — Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, TBT 40 ms, CLS 0.

## Deployment

Repair commit `b1fb7f1a4262dded5b8400b872f6421413233562` was pushed to `main`, the configured static-deployment trigger. At 13:18 UTC the hosted URL still served the previous `index-DlSdgKEl.js` asset and a 200 unknown route, so it was not used as repair evidence. Once propagation completes, confirm the new build identity, designed 404 status, and service-worker update on <https://compliance-evidence-pack.sociobot.in/>.

## Known gaps

No product gap remains. The external static deployment had not yet propagated at the recorded post-push check.
