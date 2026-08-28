# Deadline Packet

Prepare accountant-ready evidence packets for cross-border freelance filing periods.

Deadline Packet organizes one filing period’s invoices, receipts, statements,
missing items, notes, and questions. It exports them for accountant review. It
does not calculate tax, decide legal requirements, submit returns, or run OCR.

Live product: <https://compliance-evidence-pack.sociobot.in>

One-click demo: <https://compliance-evidence-pack.sociobot.in/demo>

## What it does

- Stores packet data and attachments in IndexedDB on this device.
- Encrypts attachment bytes with device-local AES-256-GCM when Web Crypto is available.
- Builds a missing-evidence list from the editable checklist.
- Exports an accountant ZIP, PDF index, and JSON backup you can import.
- Keeps edits and exports working offline after the first visit.
- Includes one packet free. A US$12 one-time license adds unlimited packets and duplication.

The app does not upload packet contents automatically. License purchase and
verification are the only optional third-party requests. Clearing browser site
data removes local packets, so keep an exported backup somewhere safe.

## Try the isolated demo

Open `/demo` or `/?demo=1`. It starts with a realistic Apr–Jun cross-border
packet, two sample evidence files, four gaps, and two accountant questions.
Demo work uses the separate `deadline-packet-demo` IndexedDB database. **Reset
demo** restores the sample. **Start for real** clears demo data and opens the
real, empty workspace. See [the demo contract](./.factory/demo.md).

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

No backend or environment variable is required. Billing verification contacts
the public Sociobot API only when a license token exists.

## Test and build

Playwright 1.58.2 is pinned. Install its Chromium binary outside the factory
image with `npx playwright install chromium`.

```sh
npm test
npm run build
```

`npm test` runs TypeScript, Vitest, and Chromium coverage. Claim-specific
commands are listed in [`.factory/claims.json`](./.factory/claims.json). The
production build lands in `dist/`, with `index.html` at its root.

## Deploy

Build with `npm run build` and deploy `dist/` as a static site. The generated
output includes direct demo and policy entries, a designed 404, the PWA shell,
and `staticwebapp.config.json` for routing, MIME types, cache rules, and security
headers. The factory owns DNS and infrastructure.

## Project map

- `src/main.ts` — screens, demo seed, routing, and interaction logic.
- `src/db.ts` — isolated real/demo IndexedDB persistence and encryption.
- `src/export.ts` — ZIP, PDF, and JSON generation.
- `public/sw.js` — versioned offline shell and update lifecycle.
- `.factory/design.md` — product visual system and asset provenance.
- `.factory/handoff.md` — exact release verification evidence.

## Privacy and law

Read the in-app `/privacy` and `/terms` pages. The software is an organizational
tool, not tax, accounting, or legal advice.

## License

MIT — see [LICENSE](./LICENSE).
