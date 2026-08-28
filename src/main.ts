import './styles.css';
import { clearLocalData, deleteFile, deletePacket, demoMode, getFiles, getPackets, putFile, putImportedPacket, putPacket, takeCorruptRowRecoveryNotice } from './db';
import { parseBackup } from './backup';
import { makeBackup, makePdf, makeZip } from './export';
import { captureLicense, checkoutUrl, hasUnlock, lifetimePrice, removeLicense, restoreLicense, verifyLicense } from './license';
import type { EvidenceFile, Packet } from './types';
import { daysUntil, download, escapeHtml, formatBytes, formatDate, safeFilename, uid } from './utils';

const main = document.querySelector<HTMLElement>('#main')!;
const toastRegion = document.querySelector<HTMLElement>('#toast-region')!;
let packets: Packet[] = [];
const currentKey = demoMode ? 'demo:deadline-packet:current' : 'deadline-packet:current';
let currentId = localStorage.getItem(currentKey);
let unlocked = false;
let installPrompt: BeforeInstallPromptEvent | null = null;
let saveQueue: Promise<void> = Promise.resolve();
let renderRevision = 0;
let dashboardRenderTimer: number | null = null;

type BeforeInstallPromptEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> };

const defaultItems = [
  'Sales invoices for the filing period',
  'Bank or payment-provider statements',
  'Business expense receipts',
  'Cross-border payment or remittance evidence',
  'Relevant contracts or engagement letters',
  'Prior accountant correspondence and notices',
];

const pageTitles: Record<string, string> = {
  '/': 'Deadline Packet — Prepare accountant evidence',
  '/demo': 'Demo — Deadline Packet',
  '/privacy': 'Privacy — Deadline Packet',
  '/terms': 'Terms — Deadline Packet',
};

function setTitle(path: string, packet?: Packet): void {
  document.title = packet ? `${packet.name} — Deadline Packet` : (pageTitles[path] ?? 'Page not found — Deadline Packet');
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://compliance-evidence-pack.sociobot.in${path === '/' ? '/' : path}`;
}

function announce(message: string, action?: { label: string; run: () => void }): void {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  if (action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.addEventListener('click', action.run);
    toast.append(button);
  }
  toastRegion.replaceChildren(toast);
  setTimeout(() => { if (toast.isConnected) toast.remove(); }, 6000);
}

function touch(packet: Packet, action: string): Packet {
  const now = new Date().toISOString();
  return { ...packet, updatedAt: now, history: [{ at: now, action }, ...packet.history].slice(0, 20) };
}

async function save(
  packetId: string,
  action: string,
  change: (current: Packet) => Packet,
  renderMode: 'deferred' | 'immediate' = 'deferred',
): Promise<void> {
  // Every edit is derived when it reaches the queue, rather than from a DOM
  // snapshot captured before an attachment finishes encrypting. This preserves
  // rapid back-to-back edits across async IndexedDB work.
  const pending = saveQueue.then(async () => {
    const current = packets.find((item) => item.id === packetId);
    if (!current) return;
    const updated = touch(change(current), action);
    await putPacket(updated);
    packets = packets.map((item) => item.id === updated.id ? updated : item).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });
  saveQueue = pending.catch(() => undefined);
  await pending;
  announce(action);
  if (renderMode === 'immediate') {
    if (dashboardRenderTimer !== null) window.clearTimeout(dashboardRenderTimer);
    dashboardRenderTimer = null;
    await render();
  } else {
    scheduleDashboardRender();
  }
}

/**
 * Keep a dashboard DOM instance alive through a burst of edits. In particular,
 * a checkbox change followed by a question submit must not replace the question
 * form between pointer down and submit. The queue is the source of truth; this
 * repaint happens only after every already-requested mutation has committed.
 */
function scheduleDashboardRender(): void {
  if (dashboardRenderTimer !== null) window.clearTimeout(dashboardRenderTimer);
  dashboardRenderTimer = window.setTimeout(() => {
    dashboardRenderTimer = null;
    void saveQueue.then(async () => {
      if (!hasInlineDraft()) await render();
    });
  }, 80);
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  void render(true);
}

function samplePacket(): Packet {
  const createdAt = '2026-07-04T18:20:00.000Z';
  return {
    id: 'demo-q2-cross-border',
    name: 'Apr–Jun cross-border evidence',
    periodStart: '2026-04-01',
    periodEnd: '2026-06-30',
    deadline: '2026-09-15',
    accountant: 'Mira Shah · Northline Accounting',
    note: 'Please check the exchange-rate dates for the May and June client payments.',
    checklist: [
      { id: 'demo-invoices', label: defaultItems[0], complete: true },
      { id: 'demo-statements', label: defaultItems[1], complete: true },
      { id: 'demo-receipts', label: defaultItems[2], complete: false },
      { id: 'demo-remittance', label: defaultItems[3], complete: true },
      { id: 'demo-contracts', label: defaultItems[4], complete: false },
      { id: 'demo-correspondence', label: defaultItems[5], complete: false },
      { id: 'demo-platform', label: 'Platform payout statement', complete: false, custom: true },
    ],
    questions: [
      { id: 'demo-rate-question', text: 'Which exchange-rate record should I use for the May payment?', answered: false },
      { id: 'demo-fee-question', text: 'Should platform fees appear separately?', answered: true },
    ],
    history: [
      { at: '2026-07-04T18:45:00.000Z', action: 'Remittance evidence marked ready' },
      { at: '2026-07-04T18:30:00.000Z', action: 'Question added' },
      { at: createdAt, action: 'Sample packet created' },
    ],
    createdAt,
    updatedAt: '2026-07-04T18:45:00.000Z',
  };
}

async function seedDemo(): Promise<void> {
  const packet = samplePacket();
  await putPacket(packet);
  await putFile({
    id: 'demo-invoice-file', packetId: packet.id, name: 'invoice-NL-204.txt', type: 'text/plain',
    size: 89, category: 'Sales invoice', note: '', addedAt: '2026-07-04T18:24:00.000Z',
    blob: new Blob(['Invoice NL-204\nClient: Harbor Studio\nPeriod: May 2026\nAmount: USD 2,400\nSample data only.'], { type: 'text/plain' }),
  });
  await putFile({
    id: 'demo-remittance-file', packetId: packet.id, name: 'may-remittance-note.txt', type: 'text/plain',
    size: 96, category: 'Remittance evidence', note: '', addedAt: '2026-07-04T18:26:00.000Z',
    blob: new Blob(['Payment received 28 May 2026\nPlatform reference: SAMPLE-5831\nAmount: USD 2,400\nSample data only.'], { type: 'text/plain' }),
  });
  currentId = packet.id;
  localStorage.setItem(currentKey, packet.id);
}

function networkState(): void {
  const badge = document.querySelector<HTMLElement>('#network-status');
  if (!badge) return;
  const online = navigator.onLine;
  badge.classList.toggle('is-offline', !online);
  badge.querySelector('em')!.textContent = online ? 'Online' : 'Offline — edits still save';
}

function licenseCard(compact = false): string {
  if (unlocked) return `<section class="unlock-card unlocked" aria-label="Lifetime license active"><p class="eyebrow">Lifetime license</p><p><strong>Unlimited packets active</strong></p><button class="text-button" id="remove-license" type="button">Remove from this device</button></section>`;
  return `<section class="unlock-card ${compact ? 'compact' : ''}" aria-labelledby="unlock-title">
    <p class="eyebrow">Lifetime license</p>
    <h2 id="unlock-title">Keep every filing period</h2>
    <p>${lifetimePrice} once. Your first complete packet is free; unlimited packets and duplication require the lifetime license.</p>
    <a class="button small" href="${checkoutUrl}">Buy a lifetime license</a>
    <details id="license-restore"><summary>Restore a lifetime license</summary><form id="restore-form"><label for="license-token">License token</label><input data-preserve-draft id="license-token" name="token" autocomplete="off" required><button class="secondary small" type="submit" aria-label="Verify and restore lifetime license">Verify and restore</button></form></details>
    <p class="micro">Checkout opens on Sociobot/Dodo.</p>
  </section>`;
}

function createDialog(): string {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const start = new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString().slice(0, 10);
  const deadline = new Date(today.getTime() + 30 * 86_400_000).toISOString().slice(0, 10);
  return `<dialog id="create-dialog" aria-labelledby="create-title"><form method="dialog" class="dialog-form" id="create-form">
    <div class="dialog-heading"><div><p class="eyebrow">New filing folder</p><h2 id="create-title">Start a packet</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div>
    <label for="packet-name">Packet name <span aria-hidden="true">*</span></label><input id="packet-name" name="name" required maxlength="80" placeholder="Example: Jan–Mar evidence">
    <div class="field-grid"><div><label for="period-start">Period starts <span aria-hidden="true">*</span></label><input type="date" id="period-start" name="periodStart" value="${start}" required></div><div><label for="period-end">Period ends <span aria-hidden="true">*</span></label><input type="date" id="period-end" name="periodEnd" value="${end}" required></div></div>
    <label for="deadline">Your handoff deadline <span aria-hidden="true">*</span></label><input type="date" id="deadline" name="deadline" value="${deadline}" required><p class="field-help">Use the date you want the packet with your accountant—not a statutory deadline.</p>
    <label for="accountant">Accountant or contact <span class="optional">Optional</span></label><input id="accountant" name="accountant" maxlength="100" placeholder="Name or firm">
    <p class="dialog-note">This creates an organizational checklist, not a filing or legal determination.</p>
    <div class="dialog-actions"><button class="ghost" value="cancel">Cancel</button><button class="button" value="default" type="submit">Create packet</button></div>
  </form></dialog>`;
}

function captureDrafts(): Map<string, string> {
  const drafts = new Map<string, string>();
  main.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-preserve-draft]').forEach((field) => {
    if (field.id) drafts.set(field.id, field.value);
  });
  return drafts;
}

function restoreDrafts(drafts: Map<string, string>): void {
  for (const [id, value] of drafts) {
    const field = main.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${CSS.escape(id)}`);
    if (field) field.value = value;
  }
}

function captureOpenDetails(): Set<string> {
  return new Set([...main.querySelectorAll<HTMLDetailsElement>('details[id][open]')].map((details) => details.id));
}

function restoreOpenDetails(openDetails: Set<string>): void {
  for (const id of openDetails) {
    const details = main.querySelector<HTMLDetailsElement>(`#${CSS.escape(id)}`);
    if (details) details.open = true;
  }
}

function hasInlineDraft(): boolean {
  return [...main.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-preserve-draft]')]
    .some((field) => field.value !== (field.dataset.original ?? ''));
}

function landing(): string {
  return `<section class="hero">
    <div class="hero-copy"><p class="eyebrow neon">Evidence in order. Questions in view.</p><h1>Prepare evidence <span>for your accountant.</span></h1><p class="lede">For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review.</p><div class="hero-actions"><a class="button" href="/demo" data-demo-link>Try it with sample data</a><button class="ghost create-button" type="button">Start your packet</button><input type="file" id="import-input" accept="application/json,.json" hidden><span>The sample opens with files, evidence gaps, and accountant questions.</span></div><ul class="hero-facts"><li>No account. Data stays in this browser.</li><li>Works offline after your first visit.</li><li>One packet free. Unlimited use costs ${lifetimePrice} once.</li></ul><button class="text-button" id="import-button" type="button">Import a JSON backup</button></div>
    <figure><picture><source media="(max-width: 760px)" srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="><img src="/assets/deadline-packet-hero.webp" width="1280" height="853" alt="A kraft evidence folder, receipts, invoice sheets, and a calculator arranged on a rain-dark night-market counter" fetchpriority="high" decoding="async"></picture><figcaption><span>01</span> From scattered evidence to one reviewable handoff.</figcaption></figure>
  </section>
  <section class="packet-preview" aria-labelledby="preview-title"><div><p class="eyebrow">Sample packet view</p><h2 id="preview-title">See the evidence gaps before handoff.</h2><p>Files, checklist states, and questions stay together in one packet.</p><a class="text-link" href="/demo" data-demo-link>Open the sample packet →</a></div><div class="preview-slip" aria-label="Sample evidence packet summary"><p class="folio">Apr–Jun / Review desk</p><strong>3 of 7 evidence groups ready</strong><ul><li><span>Business expense receipts</span><b>Evidence gap</b></li><li><span>Relevant contracts</span><b>Evidence gap</b></li><li><span>Which exchange-rate record should I use?</span><b>Open question</b></li></ul><span>2 attached sample files · Export bar ready</span></div></section>
  <section class="promise-band" aria-label="How it works"><ol><li><b>01</b><span><strong>Set the period</strong>Choose your own handoff date.</span></li><li><b>02</b><span><strong>Gather the proof</strong>See which checklist items are still missing.</span></li><li><b>03</b><span><strong>Export one packet</strong>ZIP + PDF index for review.</span></li></ol></section>
  <section class="two-up"><div><p class="eyebrow">Built for human review</p><h2>Not another filing portal.</h2><p>Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. It keeps evidence gaps and accountant questions in the same packet.</p><ul class="ticks"><li>Stored in this browser</li><li>Attachments included in your ZIP</li><li>Evidence gaps follow the checklist</li><li>Open questions stay beside the files</li></ul></div>${licenseCard()}</section>
  ${createDialog()}`;
}

function notFound(): string {
  return `<section class="not-found"><p class="eyebrow neon">404 / Misfiled page</p><div class="lost-folder" aria-hidden="true"><span></span><i></i><i></i><i></i></div><h1>This page is not in the packet.</h1><p>The address may be old or mistyped. Your local packet data has not changed.</p><a class="button" href="/" data-route>Return to Deadline Packet</a></section>`;
}

function daysLabel(deadline: string): string {
  const days = daysUntil(deadline);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} past your handoff date`;
  if (days === 0) return 'Handoff is due today';
  return `${days} day${days === 1 ? '' : 's'} until handoff`;
}

function packetSidebar(packet: Packet): string {
  return `<aside class="packet-drawer" aria-label="Packet drawer"><div class="drawer-heading"><p class="eyebrow">Packet drawer</p><button class="icon-button create-button" type="button" aria-label="Create another packet">+</button></div>
    <ul>${packets.map((item) => `<li><button type="button" data-select="${item.id}" ${item.id === packet.id ? 'aria-current="page"' : ''}><span>${escapeHtml(item.name)}</span><small>${formatDate(item.deadline)}</small></button></li>`).join('')}</ul>
    <div class="drawer-tools"><button class="ghost small" id="import-button" type="button">Import backup</button><input type="file" id="import-input" accept="application/json,.json" hidden>${licenseCard(true)}</div>
  </aside>`;
}

function dashboard(packet: Packet, files: EvidenceFile[]): string {
  const complete = packet.checklist.filter((item) => item.complete).length;
  const total = packet.checklist.length;
  const percent = total ? Math.round(complete / total * 100) : 0;
  const missing = packet.checklist.filter((item) => !item.complete);
  const openQuestions = packet.questions.filter((item) => !item.answered);
  // The workbench comes first in DOM order so heading navigation reaches the
  // page h1 before any drawer labels; CSS places the drawer on the left.
  return `<div class="app-layout"><article class="packet-workbench">
    <header class="packet-heading"><div><p class="eyebrow">${escapeHtml(packet.periodStart)} — ${escapeHtml(packet.periodEnd)}</p><h1>${escapeHtml(packet.name)}</h1><p class="due-line"><span aria-hidden="true"></span>${escapeHtml(daysLabel(packet.deadline))} · ${formatDate(packet.deadline)}</p></div><div class="completion-stamp"><strong>${percent}%</strong><span>${complete} of ${total} evidence groups ready</span></div></header>
    <progress class="progress-track" aria-label="Packet checklist completion" max="100" value="${percent}">${percent}%</progress>
    <section class="summary-strip" aria-label="Packet summary"><div><strong>${files.length}</strong><span>files attached</span></div><div class="attention"><strong>${missing.length}</strong><span>evidence gaps</span></div><div><strong>${openQuestions.length}</strong><span>open questions</span></div><div><strong>${packet.accountant ? '1' : '—'}</strong><span>${packet.accountant ? escapeHtml(packet.accountant) : 'contact not set'}</span></div></section>
    <div class="work-grid">
      <section class="paper-panel evidence-checklist" aria-labelledby="checklist-title"><div class="section-heading"><div><p class="folio">01 / Evidence map</p><h2 id="checklist-title">What should be in the packet?</h2></div><span class="section-count">${complete}/${total}</span></div>
        <ul class="checklist">${packet.checklist.map((item) => `<li class="${item.complete ? 'is-complete' : ''}"><label><input type="checkbox" data-check="${item.id}" ${item.complete ? 'checked' : ''}><span class="custom-check" aria-hidden="true"></span><span><strong>${escapeHtml(item.label)}</strong><small>${item.complete ? 'Ready for review' : 'Still needed'}</small></span></label>${item.custom ? `<button class="row-delete" type="button" data-delete-check="${item.id}" aria-label="Remove ${escapeHtml(item.label)}">×</button>` : ''}</li>`).join('')}</ul>
        <form class="inline-form" id="checklist-form"><label class="sr-only" for="checklist-item">Add a custom evidence item</label><input data-preserve-draft id="checklist-item" name="label" required maxlength="100" placeholder="Add another evidence item"><button class="secondary" type="submit">Add item</button></form>
      </section>
      <aside class="missing-board" aria-labelledby="missing-title"><p class="folio">Live evidence-gap list</p><h2 id="missing-title">Evidence gaps</h2>${missing.length ? `<ul>${missing.map((item) => `<li><span aria-hidden="true">!</span>${escapeHtml(item.label)}</li>`).join('')}</ul>` : `<div class="clear-state"><span aria-hidden="true">✓</span><p><strong>No evidence gaps.</strong><br>Review your files and questions before export.</p></div>`}<p class="micro">This list follows your checklist. It is not a legal completeness check.</p></aside>
    </div>
    <section class="paper-panel files-panel" aria-labelledby="files-title"><div class="section-heading"><div><p class="folio">02 / Supporting files</p><h2 id="files-title">Attach the evidence</h2><p>Files are copied into this browser and included when you export.</p></div><label class="button file-button" for="file-input">Add files</label><input type="file" id="file-input" multiple hidden></div>
      <div class="upload-note"><span aria-hidden="true">↘</span><p><strong>Local storage only.</strong> Up to 25 MB per file. Keep your exported ZIP somewhere you back up.</p></div>
      ${files.length ? `<ul class="file-list">${files.map((file) => `<li><span class="file-icon" aria-hidden="true">${escapeHtml(file.name.split('.').pop()?.slice(0, 4).toUpperCase() || 'FILE')}</span><div><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(file.category)} · ${formatBytes(file.size)} · ${formatDate(file.addedAt.slice(0, 10))}</small></div><button class="row-delete" type="button" data-delete-file="${file.id}" aria-label="Remove ${escapeHtml(file.name)}">Remove</button></li>`).join('')}</ul>` : `<div class="empty-row"><span aria-hidden="true">＋</span><div><strong>No files attached yet</strong><p>Add invoices, receipts, statements, or supporting correspondence.</p></div></div>`}
    </section>
    <section class="paper-panel questions-panel" aria-labelledby="questions-title"><div class="section-heading"><div><p class="folio">03 / Human review</p><h2 id="questions-title">Questions for the accountant</h2><p>Keep uncertainty visible instead of guessing.</p></div><span class="section-count">${openQuestions.length} open</span></div>
      ${packet.questions.length ? `<ul class="checklist question-list">${packet.questions.map((question) => `<li class="${question.answered ? 'is-complete' : ''}"><label><input type="checkbox" data-question="${question.id}" ${question.answered ? 'checked' : ''}><span class="custom-check" aria-hidden="true"></span><span><strong>${escapeHtml(question.text)}</strong><small>${question.answered ? 'Answered' : 'Needs an answer'}</small></span></label><button class="row-delete" type="button" data-delete-question="${question.id}" aria-label="Remove question">×</button></li>`).join('')}</ul>` : `<div class="empty-row slim"><span aria-hidden="true">?</span><div><strong>No questions written down</strong><p>Add anything you want reviewed rather than resolved by the app.</p></div></div>`}
      <form class="inline-form" id="question-form"><label class="sr-only" for="question-text">Question for your accountant</label><input data-preserve-draft id="question-text" name="text" required maxlength="180" placeholder="Example: Which exchange-rate record should I use?"><button class="secondary" type="submit">Add question</button></form>
    </section>
    <section class="handoff-panel" aria-labelledby="handoff-title"><div><p class="folio">04 / Handoff counter</p><h2 id="handoff-title">Package it for review</h2><p>Every export is downloaded to you. Deadline Packet never emails or uploads it.</p></div><div class="handoff-actions"><button class="button" id="zip-export" type="button">Export accountant ZIP</button><button class="secondary" id="pdf-export" type="button">Download PDF index</button><button class="ghost" id="backup-export" type="button">Export JSON backup</button></div></section>
    <details class="packet-settings" id="packet-details"><summary>Packet details, history, and deletion</summary><form id="details-form" class="details-form"><div class="field-grid"><div><label for="detail-start">Period starts</label><input data-preserve-draft data-original="${packet.periodStart}" id="detail-start" name="periodStart" type="date" required value="${packet.periodStart}"></div><div><label for="detail-end">Period ends</label><input data-preserve-draft data-original="${packet.periodEnd}" id="detail-end" name="periodEnd" type="date" required value="${packet.periodEnd}"></div></div><label for="detail-deadline">Handoff deadline</label><input data-preserve-draft data-original="${packet.deadline}" id="detail-deadline" name="deadline" type="date" required value="${packet.deadline}"><label for="detail-accountant">Accountant or contact</label><input data-preserve-draft data-original="${escapeHtml(packet.accountant)}" id="detail-accountant" name="accountant" value="${escapeHtml(packet.accountant)}" maxlength="100"><label for="packet-note">Packet note</label><textarea data-preserve-draft data-original="${escapeHtml(packet.note)}" id="packet-note" name="note" rows="4" maxlength="1000">${escapeHtml(packet.note)}</textarea><button class="secondary" type="submit" aria-label="Save packet details">Save packet details</button></form>
      <div class="history"><h3>Recent history</h3><ol>${packet.history.slice(0, 8).map((entry) => `<li><span>${escapeHtml(entry.action)}</span><time datetime="${entry.at}">${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.at))}</time></li>`).join('')}</ol></div>
      <div class="danger-zone">${unlocked ? `<button class="ghost" id="duplicate-packet" type="button">Duplicate as a new period</button>` : ''}<button class="danger" id="delete-packet" type="button" aria-label="Delete packet and local files">Delete packet and local files</button></div>
    </details>
  </article>${packetSidebar(packet)}</div>${createDialog()}`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  if (kind === 'privacy') return `<article class="legal"><p class="eyebrow">Plain-language policy · 28 August 2026</p><h1>Privacy, without fine print.</h1><p class="lede">Deadline Packet keeps packet details in this browser.</p><h2>What is stored</h2><p>Packet names, dates, checklist states, questions, notes, and attachments stay in this browser. When supported, your browser encrypts attached files before storing them. A lifetime-license token and its last verification result stay in localStorage. We do not run analytics or advertising trackers.</p><h2>What leaves your device</h2><p>Your evidence never leaves automatically. The app contacts Sociobot only when you buy or verify a lifetime license. Checkout opens on Sociobot/Dodo. Export creates a download on your device.</p><h2>Retention and control</h2><p>Data remains until you delete a packet, clear this site’s browser storage, or uninstall it and clear its data. Export a JSON backup or accountant ZIP before clearing storage. We cannot recover local data or a browser key after it is cleared.</p><h2>Network and offline use</h2><p>The app shell is cached by a service worker. Once opened, packet work remains available offline. License verification never blocks the free experience.</p><a class="text-link" href="/" data-route>← Return to your packets</a></article>`;
  return `<article class="legal"><p class="eyebrow">Terms · 28 August 2026</p><h1>A preparation tool, not a filing service.</h1><p class="lede">By using Deadline Packet, you agree to use it as an organizational aid for human review.</p><h2>No professional advice</h2><p>The app does not calculate tax, determine legal requirements, validate document sufficiency, submit returns, or run OCR. It does not provide tax, accounting, or legal advice. Deadlines are dates you enter. Confirm all requirements with a qualified professional.</p><h2>Your data and exports</h2><p>You control the content you add and are responsible for lawful handling, backups, and secure delivery of exports. The software is provided as-is under the MIT License.</p><h2>Lifetime license</h2><p>${lifetimePrice} is a one-time purchase for unlimited packets and packet duplication in this product. Checkout opens on Sociobot/Dodo. Core exports and your first complete packet do not require purchase.</p><h2>Acceptable use</h2><p>Do not use the service or billing verification endpoint unlawfully, attempt to disrupt it, or misrepresent generated indexes as official filings.</p><a class="text-link" href="/" data-route>← Return to your packets</a></article>`;
}

async function render(moveFocus = false): Promise<void> {
  const revision = ++renderRevision;
  // Dashboard saves are asynchronous. Capture typed, unsaved form values before
  // replacing the workbench so a checklist save cannot erase a concurrent draft.
  const drafts = captureDrafts();
  const openDetails = captureOpenDetails();
  if (main.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur();
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/privacy' || path === '/terms') {
    setTitle(path);
    main.innerHTML = legalPage(path.slice(1) as 'privacy' | 'terms');
    bindRoutes();
    if (moveFocus) announceRoute();
    return;
  }
  if (path !== '/' && path !== '/demo') {
    setTitle(path);
    main.innerHTML = notFound();
    bindRoutes();
    if (moveFocus) announceRoute();
    return;
  }
  if (!packets.length) {
    setTitle(demoMode ? '/demo' : '/');
    main.innerHTML = landing();
    bindCommon();
    if (moveFocus) announceRoute();
    return;
  }
  const packet = packets.find((item) => item.id === currentId) ?? packets[0];
  currentId = packet.id;
  localStorage.setItem(currentKey, packet.id);
  if (demoMode) setTitle('/demo');
  else setTitle('/', packet);
  const files = await getFiles(packet.id);
  if (revision !== renderRevision) return;
  main.innerHTML = dashboard(packet, files);
  restoreDrafts(drafts);
  restoreOpenDetails(openDetails);
  bindCommon();
  bindDashboard(packet, files);
  if (moveFocus) announceRoute();
}

function announceRoute(): void {
  const heading = main.querySelector<HTMLElement>('h1');
  main.focus();
  document.querySelector<HTMLElement>('#route-announcer')!.textContent = heading?.textContent?.trim() || 'Page loaded';
}

function bindRoutes(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => {
    link.onclick = (event) => { event.preventDefault(); navigate(new URL(link.href).pathname); };
  });
}

function bindCommon(): void {
  bindRoutes();
  document.querySelectorAll<HTMLAnchorElement>('[data-demo-link]').forEach((link) => {
    link.addEventListener('click', (event) => { event.preventDefault(); location.assign('/demo'); });
  });
  document.querySelectorAll<HTMLButtonElement>('.create-button').forEach((button) => button.onclick = () => {
    if (packets.length >= 1 && !unlocked) {
      document.querySelector<HTMLElement>('.unlock-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      announce('Unlimited packets require the one-time unlock. Your current packet stays fully usable.');
      return;
    }
    document.querySelector<HTMLDialogElement>('#create-dialog')?.showModal();
  });
  const form = document.querySelector<HTMLFormElement>('#create-form');
  const nameInput = form?.elements.namedItem('name') as HTMLInputElement | null;
  nameInput?.addEventListener('input', (event) => {
    (event.currentTarget as HTMLInputElement).setCustomValidity('');
  });
  form?.addEventListener('submit', async (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.value === 'cancel') return;
    event.preventDefault();
    const data = new FormData(form);
    const nameField = form.elements.namedItem('name') as HTMLInputElement;
    const name = String(data.get('name')).trim();
    if (!name) {
      nameField.setCustomValidity('Enter a packet name with letters or numbers.');
      nameField.reportValidity();
      nameField.focus();
      return;
    }
    nameField.setCustomValidity('');
    if (!form.reportValidity()) return;
    if (String(data.get('periodStart')) > String(data.get('periodEnd'))) {
      announce('The period start must be before the period end.');
      return;
    }
    const now = new Date().toISOString();
    const packet: Packet = {
      id: uid(), name, periodStart: String(data.get('periodStart')),
      periodEnd: String(data.get('periodEnd')), deadline: String(data.get('deadline')),
      accountant: String(data.get('accountant')).trim(), note: '',
      checklist: defaultItems.map((label) => ({ id: uid(), label, complete: false })), questions: [],
      history: [{ at: now, action: 'Packet created' }], createdAt: now, updatedAt: now,
    };
    await putPacket(packet);
    packets = [packet, ...packets]; currentId = packet.id;
    form.closest('dialog')?.close();
    announce('Packet created. Start by marking what you already have.');
    await render();
  });
  const restore = document.querySelector<HTMLFormElement>('#restore-form');
  restore?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = String(new FormData(restore).get('token') || '').trim();
    if (!token) return;
    restoreLicense(token);
    unlocked = true;
    announce('License saved. Verifying in the background…');
    await render();
    const valid = await verifyLicense(true);
    unlocked = valid;
    announce(valid ? 'Lifetime unlock restored.' : 'That license is not active for Deadline Packet.');
    await render();
  });
  document.querySelector<HTMLButtonElement>('#remove-license')?.addEventListener('click', () => {
    removeLicense(); unlocked = false; announce('License removed from this device.'); render();
  });
  const importButton = document.querySelector<HTMLButtonElement>('#import-button');
  const importInput = document.querySelector<HTMLInputElement>('#import-input');
  importButton?.addEventListener('click', () => importInput?.click());
  importInput?.addEventListener('change', () => importInput.files?.[0] && importBackup(importInput.files[0]));
}

function bindDashboard(packet: Packet, files: EvidenceFile[]): void {
  document.querySelectorAll<HTMLButtonElement>('[data-select]').forEach((button) => button.onclick = () => {
    currentId = button.dataset.select!; render();
  });
  document.querySelectorAll<HTMLInputElement>('[data-check]').forEach((input) => input.onchange = () => {
    const itemId = input.dataset.check!;
    void save(packet.id, input.checked ? 'Evidence marked ready' : 'Evidence marked missing', (current) => ({ ...current, checklist: current.checklist.map((item) => item.id === itemId ? { ...item, complete: input.checked } : item) }));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-delete-check]').forEach((button) => button.onclick = () => {
    const item = packet.checklist.find((value) => value.id === button.dataset.deleteCheck);
    if (item && confirm(`Remove “${item.label}” from this checklist?`)) void save(packet.id, 'Custom evidence item removed', (current) => ({ ...current, checklist: current.checklist.filter((value) => value.id !== item.id) }));
  });
  document.querySelector<HTMLFormElement>('#checklist-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const label = String(new FormData(form).get('label')).trim();
    if (label) { form.reset(); void save(packet.id, 'Custom evidence item added', (current) => ({ ...current, checklist: [...current.checklist, { id: uid(), label, complete: false, custom: true }] })); }
  });
  document.querySelector<HTMLInputElement>('#file-input')?.addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement;
    const selected = [...(input.files ?? [])];
    const tooLarge = selected.find((file) => file.size > 25 * 1024 * 1024);
    if (tooLarge) { announce(`${tooLarge.name} is over the 25 MB per-file limit.`); return; }
    if (!selected.length) return;
    try {
      for (const blob of selected) {
        const file: EvidenceFile = { id: uid(), packetId: packet.id, name: blob.name, type: blob.type || 'application/octet-stream', size: blob.size, category: 'Supporting evidence', note: '', addedAt: new Date().toISOString(), blob };
        await putFile(file);
      }
      await save(packet.id, `${selected.length} file${selected.length === 1 ? '' : 's'} saved locally`, (current) => current);
    } catch { announce('The files could not be saved. Check available browser storage and try again.'); }
  });
  document.querySelectorAll<HTMLButtonElement>('[data-delete-file]').forEach((button) => button.onclick = async () => {
    const file = files.find((value) => value.id === button.dataset.deleteFile);
    if (file && confirm(`Remove “${file.name}” from this packet? This only removes the local copy.`)) {
      await deleteFile(file.id); await save(packet.id, 'Local file removed', (current) => current);
    }
  });
  document.querySelector<HTMLFormElement>('#question-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const text = String(new FormData(form).get('text')).trim();
    if (text) { form.reset(); void save(packet.id, 'Question added', (current) => ({ ...current, questions: [...current.questions, { id: uid(), text, answered: false }] })); }
  });
  document.querySelectorAll<HTMLInputElement>('[data-question]').forEach((input) => input.onchange = () => {
    const questionId = input.dataset.question!;
    void save(packet.id, input.checked ? 'Question marked answered' : 'Question reopened', (current) => ({ ...current, questions: current.questions.map((question) => question.id === questionId ? { ...question, answered: input.checked } : question) }));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-delete-question]').forEach((button) => button.onclick = () => {
    const question = packet.questions.find((value) => value.id === button.dataset.deleteQuestion);
    if (question && confirm(`Remove “${question.text}” from questions for the accountant?`)) void save(packet.id, 'Question removed', (current) => ({ ...current, questions: current.questions.filter((value) => value.id !== question.id) }));
  });
  document.querySelector<HTMLFormElement>('#details-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const periodStart = String(data.get('periodStart')); const periodEnd = String(data.get('periodEnd'));
    if (periodStart > periodEnd) { announce('The period start must be before the period end.'); return; }
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      await save(packet.id, 'Packet details saved', (current) => ({ ...current, periodStart, periodEnd, deadline: String(data.get('deadline')), accountant: String(data.get('accountant')).trim(), note: String(data.get('note')).trim() }), 'immediate');
    } catch {
      if (submit) submit.disabled = false;
      announce('Packet details could not be saved. Check browser storage and try again.');
    }
  });
  document.querySelector<HTMLButtonElement>('#zip-export')?.addEventListener('click', async (event) => {
    const button = event.currentTarget as HTMLButtonElement; button.disabled = true; button.textContent = 'Packaging…';
    try { download(await makeZip(packet, files), `${safeFilename(packet.name)}-accountant-packet.zip`); announce('Accountant ZIP downloaded. Nothing was sent.'); }
    catch { announce('The ZIP could not be built. Check storage and try again.'); }
    finally { button.disabled = false; button.textContent = 'Export accountant ZIP'; }
  });
  document.querySelector<HTMLButtonElement>('#pdf-export')?.addEventListener('click', () => {
    download(new Blob([makePdf(packet, files) as BlobPart], { type: 'application/pdf' }), `${safeFilename(packet.name)}-index.pdf`); announce('PDF index downloaded.');
  });
  document.querySelector<HTMLButtonElement>('#backup-export')?.addEventListener('click', async () => {
    try { download(await makeBackup(packet, files), `${safeFilename(packet.name)}-backup.json`); announce('JSON backup downloaded. Store it somewhere safe.'); }
    catch { announce('The backup was too large to create. Export the accountant ZIP instead.'); }
  });
  document.querySelector<HTMLButtonElement>('#duplicate-packet')?.addEventListener('click', async () => {
    const now = new Date().toISOString(); const copy: Packet = { ...packet, id: uid(), name: `${packet.name} — copy`, checklist: packet.checklist.map((item) => ({ ...item, id: uid(), complete: false })), questions: packet.questions.map((question) => ({ ...question, id: uid(), answered: false })), history: [{ at: now, action: 'Duplicated from an earlier packet' }], createdAt: now, updatedAt: now };
    await putPacket(copy); packets = [copy, ...packets]; currentId = copy.id; announce('Packet duplicated without attachments.'); await render();
  });
  document.querySelector<HTMLButtonElement>('#delete-packet')?.addEventListener('click', async () => {
    if (!confirm(`Permanently delete “${packet.name}” and its ${files.length} local file${files.length === 1 ? '' : 's'}? Export first if you need a copy.`)) return;
    await deletePacket(packet.id); packets = packets.filter((item) => item.id !== packet.id); currentId = packets[0]?.id ?? null; announce('Packet and its local files deleted.'); await render();
  });
}

async function importBackup(file: File): Promise<void> {
  if (packets.length >= 1 && !unlocked) { announce('Importing additional packets requires the lifetime license.'); return; }
  try {
    const data = parseBackup(JSON.parse(await file.text()));
    if (!data) throw new Error('Invalid backup');
    const newId = uid(); const now = new Date().toISOString();
    const importedName = `${data.packet.name.slice(0, 68)} — imported`;
    const packet: Packet = { ...data.packet, id: newId, name: importedName, createdAt: now, updatedAt: now, history: [{ at: now, action: 'Imported from JSON backup' }, ...data.packet.history] };
    const files: EvidenceFile[] = data.files.map((item) => ({ id: uid(), packetId: newId, name: item.name, type: item.type, size: item.size, category: item.category, note: item.note, addedAt: item.addedAt, blob: new Blob([item.bytes as BlobPart], { type: item.type }) }));
    await putImportedPacket(packet, files);
    packets = [packet, ...packets]; currentId = newId; announce('Backup imported as a new packet.'); await render();
  } catch { announce('That file is not a valid Deadline Packet backup.'); }
}

async function start(): Promise<void> {
  if (!demoMode) {
    indexedDB.deleteDatabase('deadline-packet-demo');
    localStorage.removeItem('demo:deadline-packet:current');
  }
  captureLicense();
  unlocked = hasUnlock();
  packets = await getPackets();
  const recoveredCorruptRows = takeCorruptRowRecoveryNotice();
  if (demoMode && !packets.length) {
    await seedDemo();
    packets = await getPackets();
  }
  if (demoMode) {
    document.body.classList.add('demo-mode');
    const banner = document.querySelector<HTMLElement>('#demo-banner');
    if (banner) banner.hidden = false;
    document.querySelector<HTMLAnchorElement>('.brand')?.setAttribute('href', '/demo');
    document.querySelector<HTMLButtonElement>('#reset-demo')?.addEventListener('click', async () => {
      await clearLocalData();
      await seedDemo();
      packets = await getPackets();
      announce('Sample data reset.');
      await render();
    });
    document.querySelector<HTMLButtonElement>('#start-real')?.addEventListener('click', async () => {
      await clearLocalData();
      localStorage.removeItem(currentKey);
      location.assign('/');
    });
  }
  await render();
  if (recoveredCorruptRows) announce('A damaged local packet was removed so the drawer could open. Other packets are still available.');
  document.body.classList.add('app-ready');
  networkState();
  verifyLicense().then(async (valid) => {
    if (valid !== unlocked) { unlocked = valid; announce(valid ? 'Lifetime unlock verified.' : 'License no longer active. Free packet access remains available.'); await render(); }
  });
}

window.addEventListener('popstate', () => { void render(true); });
window.addEventListener('online', networkState);
window.addEventListener('offline', () => { networkState(); announce('You’re offline. Packet edits and exports still work locally.'); });
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); installPrompt = event as BeforeInstallPromptEvent;
  const button = document.querySelector<HTMLButtonElement>('#install-button');
  if (button) button.hidden = false;
});
document.querySelector<HTMLButtonElement>('#install-button')?.addEventListener('click', async () => {
  if (!installPrompt) return; await installPrompt.prompt(); installPrompt = null;
  const button = document.querySelector<HTMLButtonElement>('#install-button'); if (button) button.hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          announce('A fresh app version is ready.', { label: 'Reload', run: () => location.reload() });
        }
      });
    });
  }).catch(() => announce('Offline installation is unavailable in this browser session.')));
}

start().catch(() => {
  main.innerHTML = `<section class="fatal-state"><p class="eyebrow">Local storage error</p><h1>Your packet drawer could not open.</h1><p>Deadline Packet could not read local browser storage. Try again, or clear this app’s local data if you have an exported backup.</p><button class="button" id="reload-app" type="button">Try again</button><button class="ghost" id="clear-local-recovery" type="button">Clear local data and restart</button></section>`;
  document.querySelector<HTMLButtonElement>('#reload-app')?.addEventListener('click', () => location.reload());
  document.querySelector<HTMLButtonElement>('#clear-local-recovery')?.addEventListener('click', async () => { await clearLocalData(); location.reload(); });
});
