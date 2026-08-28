# Deadline Packet

Deadline Packet is a private, offline-capable evidence organizer for freelancers
with cross-border income. It turns a filing period’s invoices, receipts,
statements, missing items, notes, and unanswered questions into an
accountant-ready ZIP with HTML and PDF indexes.

It is deliberately **not** tax software: it does not calculate tax, decide what
the law requires, submit returns, run OCR, or send anything to an accountant.

Live product: <https://compliance-evidence-pack.sociobot.in>

## What it does

- Keeps packet metadata and real file attachments in IndexedDB on the device;
  attachment bytes use device-local AES-GCM encryption where Web Crypto exists.
- Starts each period from a jurisdiction-neutral, editable evidence checklist.
- Builds a live missing-evidence list and keeps questions visible for review.
- Exports an accountant ZIP, standalone PDF index, and restorable JSON backup.
- Installs as a PWA and continues to edit and export after the network drops.
- Includes one complete packet free; a US$19 one-time license unlocks unlimited
  packets and reusable duplication through the Sociobot billing API.

Users should keep an exported backup somewhere safe. Clearing browser site data
removes local packets, and the product cannot recover them.

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. No environment variables or backend are
required. Billing verification uses the public Sociobot API only when a license
token is present; packet work never waits for that request.

## Test and build

Playwright 1.58.2 is pinned. In the factory image its Chromium binary is already
available through `PLAYWRIGHT_BROWSERS_PATH`; elsewhere, install it once with
`npx playwright install chromium`.

```sh
npm test
npm run build
```

`npm test` runs TypeScript checking, unit coverage for ZIP/PDF creation, and
Chromium journeys for creation, attachment, export, import, paid unlock,
accessibility, 390 px layout, and an explicit offline reload. The exact deploy
command is `npm run build`; static output lands in `./dist`, with `index.html` at
its root and direct-entry copies for `/privacy` and `/terms`.

## Project map

- `src/main.ts` — screens, packet workflow, routing, and interaction logic.
- `src/db.ts` — IndexedDB persistence for packets and blobs.
- `src/export.ts` — in-browser ZIP, PDF, and JSON backup generation.
- `public/sw.js` — versioned app-shell and runtime cache.
- `.factory/design.md` — product-specific visual system and asset provenance.
- `.factory/handoff.md` — verification record and known limitations.

## Privacy and security

No analytics, third-party runtime scripts, CDN fonts, or document uploads are
used. License purchase and verification are the only optional third-party
requests. Read the in-app `/privacy` and `/terms` pages for user-facing terms.

## License

MIT — see [LICENSE](./LICENSE).
