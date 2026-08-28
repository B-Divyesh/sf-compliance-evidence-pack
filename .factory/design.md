# Deadline Packet — visual thesis

## Direction: the quiet stall after closing

Deadline Packet borrows from **night-market neon signage**, but treats it as a
navigation system rather than decoration. A charcoal-blue desk is the night;
warm paper panels are the documents under review; cyan is the open-accountant
window; acid lime marks evidence that is ready; coral marks something that
still needs attention. Hairline rules and tiny monospaced folio labels recall
receipt printers and hand-numbered folders. This is a focused, single-mode dark
treatment: a late-night preparation tool whose paper surfaces keep dense data
legible and whose signs make the next action visible in two seconds.

The hero is an original atmospheric still life, not a generic gradient or
dashboard screenshot. It explains the product world: scattered evidence being
drawn into one orderly, glowing packet.

## Tokens

- `--night: #071217` — painted page background.
- `--night-raised: #0d2026` — navigation and elevated controls.
- `--paper: #fff7e6` and `--paper-2: #f2e7cf` — working surfaces.
- `--ink: #152126` — text on paper (contrast above 12:1).
- `--text: #f6f1df` — text on night (contrast above 16:1).
- `--muted: #b8c7c4` — secondary text on night (contrast above 9:1).
- `--cyan: #2ee9e0` / `--cyan-ink: #03211f` — primary action and focus.
- `--lime: #c9f56a` / `--lime-ink: #182204` — complete/safe.
- `--coral: #ff806f` / `--coral-ink: #2a0805` — due/missing/destructive.
- `--amber: #ffd166` — caution, never used without words or icons.
- Focus is a 3 px cyan ring with 3 px night offset. All UI outlines meet 3:1;
  all text combinations meet 4.5:1.

## Typography and spacing

Headlines use `Arial Narrow`, `Roboto Condensed`, `Aptos Narrow`, sans-serif in
uppercase with deliberately tight tracking, like a sign painter's block
lettering. Body and controls use Inter-compatible system sans
(`ui-sans-serif`, `Segoe UI`, sans-serif), avoiding a font download entirely.
Dates, folios, amounts, and eyebrow labels use `ui-monospace` with tabular
figures. Type steps: 14, 16, 20, 28, and clamp(40–72) px. Body is never below
16 px. Reading measure tops out near 68 characters.

Spacing follows an 8 px rhythm with 4 px optical adjustments: 4, 8, 12, 16,
24, 32, 48, 64. Touch targets are at least 44 px. Desktop uses an asymmetric
12-column counter/workbench; the phone view drops the decorative hero crop,
stacks summary before details, and moves navigation into a compact top rail.

## Interaction grammar and depth

- A packet is a physical folder: selecting it slides the work surface by 8 px
  while fading in over 220 ms.
- Evidence rows behave like receipt slips. Completion changes both the icon and
  the written state; color is never the sole cue.
- Creation opens a centered dialog from the originating button. Destructive
  removal is confirmed with the packet/file name.
- Save feedback appears in a polite live region; export has a visible busy
  state and result. Offline state is a persistent labelled badge, not an error.
- On `prefers-reduced-motion`, all transforms and smooth scrolling are removed;
  state changes become instantaneous opacity swaps. No effect loops or flashes.

## Original asset plan and provenance

Hero prompt sheet: overhead editorial still life of an independent freelancer's
filing-period evidence at a rain-dark night-market counter; one tidy kraft
folder, abstract invoice sheets without legible writing, receipt strips, binder
clip, small calculator shapes; cyan and acid-lime neon reflected in wet dark
teal metal, restrained coral deadline tab; calm, meticulous, tactile paper and
brushed metal; cinematic 50 mm product photography, deep shadows, high local
contrast, composition weighted right so the left stays quiet for UI; no people,
no hands, no flags, no currency symbols, no legal seals, no brands, no logos,
no readable text, no watermark, no gradients, no computer screen.

- `assets/src/deadline-packet-hero.png`: generated 2026-08-28 with the factory
  Azure OpenAI image deployment (`factory-image`) from the prompt above.
- `public/assets/deadline-packet-hero.webp`: reviewed derivative, optimized for
  the application; original generation retained with sidecar prompt JSON.
- `public/assets/deadline-packet-social.webp`: 1200×630 center crop of the same
  reviewed original, prepared locally for Open Graph and Twitter previews.
- App marks, status symbols, favicon, and PWA icons are original hand-authored
  SVG/PNG geometry by the product builder (folder tab + three evidence lines),
  released under the repository MIT license.
- The footer discloses that the still-life illustration is AI-generated.

## Asset review checklist

Reject candidates containing faux-readable text, brand-like marks, flags,
official seals, warped stationery, accidental people/hands, repeated receipt
seams, or an atmosphere too frantic for a calm deadline tool. The retained
candidate must read as evidence organization—not tax calculation or filing.
