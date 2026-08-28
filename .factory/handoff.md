# Deadline Packet — repair handoff

Work order: `compliance-evidence-pack-repair-2`  
Repaired from verifier candidate: `5d7b310d9599bf6616ce78d520f30bf4a303ebf9`  
Date: 2026-08-28

## Release-blocker repairs

- Corrected the public lifetime-unlock price to **US$12**, matching the hosted Sociobot/Dodo checkout. Live verification found `Deadline Packet`, `$12.00`, subtotal `$12.00`, and total `$12.00`.
- Reworked packet edits into serial, current-state mutations and made IndexedDB writes wait for transaction completion. This removes the stale-snapshot and uncommitted-transaction paths behind rapid question-plus-attachment loss.
- Added a reload regression that adds a question, immediately attaches a file, then proves both survive reload.
- Added claims and tagged coverage for no-account use, the 25 MiB file boundary, no trackers, local retention/deletion, and non-blocking license verification. The inventory now has 12 one-to-one claim tests.
- Reflowed the mobile headline at 200% text, made reported controls at least 44 px, repaired route focus plus live route announcements, and added confirmation before question deletion.
- Mobile no longer requests the 95.9 KB desktop hero; the phone `<picture>` source is a transparent placeholder while the editorial image is hidden.
- Service-worker shells now receive a per-build cache version and versioned asset URLs, preventing a prior worker from serving an old shell after an update.

## Verification

- `npm ci` — pass, 61 packages, 0 vulnerabilities.
- `npm run test:unit` — pass, 4 tests.
- Claim commands were exercised from the demo entry point; the 12 tagged claim tests pass in clean browser scenarios. Browser coverage includes desktop, 390 px/200% text, keyboard dialog and route focus, axe serious/critical checks, privacy request capture, offline reload/export, and production-worker update coverage.
- `npm run build` — pass. `dist/` contains root `index.html`; current budgets: JS 49.59 kB raw / 18.52 kB gzip and CSS 23.64 kB raw / 6.06 kB gzip.
- Live checkout identity check — pass: the API endpoint returned 303 to Dodo; the hosted order page showed the matching US$12 one-time product.

## Deployment

Static artifact class is unchanged. Deploy `dist/` using `public/staticwebapp.config.json`. Pushing the repair commit to `main` is the configured factory deployment trigger.

## Known gap

No application or product gap remains. The local repeated-run Playwright shell is explicitly cleaned before each scenario because a PWA worker is origin-scoped; this keeps the verification sandbox equivalent to a fresh visitor and avoids an old local worker affecting evidence.
