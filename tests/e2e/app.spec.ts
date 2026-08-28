import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { test, expect, type Download } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { unzipSync } from 'fflate';

async function downloadBytes(download: Download): Promise<Buffer> {
  const path = await download.path();
  if (!path) throw new Error('The browser did not expose the downloaded file.');
  return readFile(path);
}

test.beforeEach(async ({ page }) => {
  // A service worker is origin-scoped, so a previous local test run can leave
  // an old shell at this fixed preview origin. Each scenario starts from an
  // actual clean browser store, as the claims contract requires.
  await page.goto('/');
  await page.evaluate(async () => {
    await Promise.all((await navigator.serviceWorker.getRegistrations()).map((registration) => registration.unregister()));
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
    await Promise.all(['deadline-packet', 'deadline-packet-demo'].map((name) => new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = request.onerror = request.onblocked = () => resolve();
    })));
    localStorage.clear();
  });
  // Leave the controlled client before opening the scenario. An unregistered
  // worker can still control its current page until that navigation ends.
  await page.goto('about:blank');
  await page.goto('/');
});

test('creates and exports a complete local packet workflow', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare evidence');
  await page.getByRole('button', { name: 'Start your packet' }).click();
  await page.getByLabel('Packet name').fill('April–June evidence');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('April–June evidence');
  await page.getByLabel('Sales invoices for the filing period').check();
  await expect(page.getByText('1 of 6 evidence groups ready')).toBeVisible();
  await page.getByLabel('Add a custom evidence item').fill('Platform payout statement');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByText('Platform payout statement', { exact: true }).first()).toBeVisible();
  await page.getByLabel('Question for your accountant').fill('Which exchange-rate record should I include?');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'invoice-104.txt', mimeType: 'text/plain', buffer: Buffer.from('Invoice evidence') });
  await expect(page.getByText('invoice-104.txt')).toBeVisible();
  const dashboard = await new AxeBuilder({ page }).analyze();
  expect(dashboard.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact || ''))).toEqual([]);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export accountant ZIP' }).click();
  expect((await downloadPromise).suggestedFilename()).toContain('accountant-packet.zip');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(consoleErrors).toEqual([]);
});

test('@claim:demo-isolation sample mode uses separate storage and reset never changes real packets', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Deadline Packet');
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Apr–Jun cross-border evidence');
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolveDatabase, reject) => {
      const open = indexedDB.open('deadline-packet');
      open.onupgradeneeded = () => {
        if (!open.result.objectStoreNames.contains('packets')) open.result.createObjectStore('packets', { keyPath: 'id' });
      };
      open.onsuccess = () => resolveDatabase(open.result);
      open.onerror = () => reject(open.error);
    });
    await new Promise<void>((resolveWrite, reject) => {
      const transaction = database.transaction('packets', 'readwrite');
      transaction.objectStore('packets').put({ id: 'real-marker', name: 'Real packet marker' });
      transaction.oncomplete = () => resolveWrite();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
  await page.getByLabel('Business expense receipts').check();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Business expense receipts')).not.toBeChecked();
  const databases = await page.evaluate(async () => {
    const names = (await indexedDB.databases()).map((database) => database.name);
    const real = await new Promise<IDBDatabase>((resolveDatabase, reject) => {
      const open = indexedDB.open('deadline-packet');
      open.onsuccess = () => resolveDatabase(open.result);
      open.onerror = () => reject(open.error);
    });
    const marker = await new Promise<unknown>((resolveRecord, reject) => {
      const request = real.transaction('packets').objectStore('packets').get('real-marker');
      request.onsuccess = () => resolveRecord(request.result);
      request.onerror = () => reject(request.error);
    });
    real.close();
    return { names, marker };
  });
  expect(databases.names).toContain('deadline-packet-demo');
  expect(databases.marker).toMatchObject({ name: 'Real packet marker' });
});

test('@claim:privacy-local a full demo flow sends no packet content off origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Question for your accountant').fill('Can you review the sample remittance date?');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'private-note.txt', mimeType: 'text/plain', buffer: Buffer.from('private packet content') });
  await expect(page.getByText('private-note.txt')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export accountant ZIP' }).click();
  await downloadPromise;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:encrypted-storage attachments are encrypted in the demo IndexedDB store', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#file-input').setInputFiles({ name: 'secret.txt', mimeType: 'text/plain', buffer: Buffer.from('sensitive evidence bytes') });
  await expect(page.getByText('secret.txt')).toBeVisible();
  const stored = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolveDatabase, reject) => {
      const open = indexedDB.open('deadline-packet-demo');
      open.onsuccess = () => resolveDatabase(open.result);
      open.onerror = () => reject(open.error);
    });
    const files = await new Promise<Array<{ name: string; encrypted?: boolean; blob: Blob }>>((resolveFiles, reject) => {
      const request = database.transaction('files').objectStore('files').getAll();
      request.onsuccess = () => resolveFiles(request.result);
      request.onerror = () => reject(request.error);
    });
    const secret = files.find((file) => file.name === 'secret.txt')!;
    return { encrypted: secret.encrypted, raw: await secret.blob.text() };
  });
  expect(stored.encrypted).toBe(true);
  expect(stored.raw).not.toContain('sensitive evidence bytes');
});

test('@claim:packet-exports demo exports ZIP, PDF, and JSON that can be imported', async ({ page }) => {
  await page.goto('/demo');
  const zipEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export accountant ZIP' }).click();
  const zip = unzipSync(new Uint8Array(await downloadBytes(await zipEvent)));
  expect(Object.keys(zip)).toEqual(expect.arrayContaining([
    'README-FIRST.html', 'accountant-index.pdf', 'packet-data.json',
    'evidence/01-invoice-nl-204-txt.txt', 'evidence/02-may-remittance-note-txt.txt',
  ]));
  const pdfEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PDF index' }).click();
  expect((await downloadBytes(await pdfEvent)).subarray(0, 8).toString()).toBe('%PDF-1.4');
  const jsonEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const backupDownload = await jsonEvent;
  const backupBytes = await downloadBytes(backupDownload);
  const backup = JSON.parse(backupBytes.toString()) as { packet: { name: string }; files: unknown[] };
  expect(backup.packet.name).toBe('Apr–Jun cross-border evidence');
  expect(backup.files).toHaveLength(2);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await page.locator('#import-input').setInputFiles({ name: 'demo-backup.json', mimeType: 'application/json', buffer: backupBytes });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Apr–Jun cross-border evidence — imported');
});

test('@claim:missing-evidence the gap list follows checklist changes', async ({ page }) => {
  await page.goto('/demo');
  const missing = page.getByRole('complementary', { name: 'Missing evidence' });
  await expect(missing).toContainText('Business expense receipts');
  await expect(missing.locator('li')).toHaveCount(4);
  await page.getByLabel('Business expense receipts').check();
  await expect(missing).not.toContainText('Business expense receipts');
  await expect(missing.locator('li')).toHaveCount(3);
});

test('@claim:offline-reload demo edits and ZIP export work after an offline reload', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(async () => { await navigator.serviceWorker.ready; return true; });
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Apr–Jun cross-border evidence');
  await page.getByLabel('Business expense receipts').check();
  await expect(page.getByText('4 of 7 evidence groups ready')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export accountant ZIP' }).click();
  expect((await downloadPromise).suggestedFilename()).toContain('accountant-packet.zip');
  await expect(page.getByText('Offline — edits still save')).toBeVisible();
});

test('@claim:free-and-paid one packet is free and a valid US$12 license enables another packet and duplication', async ({ page }) => {
  await page.route('**/api/v1/products/compliance-evidence-pack/verify?*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Create another packet' }).click();
  await expect(page.getByText('Unlimited packets require the one-time unlock')).toBeVisible();
  const buy = page.getByRole('link', { name: 'Buy lifetime access' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/compliance-evidence-pack/checkout');
  await expect(page.getByText('US$12 once.')).toBeVisible();
  await page.getByText('Already bought it?').click();
  await page.getByLabel('License token').fill('valid-demo-license');
  await page.getByRole('button', { name: 'Verify and restore' }).click();
  await expect(page.getByText('Unlimited packets active')).toBeVisible();
  await page.getByText('Packet details, history, and deletion').click();
  await expect(page.getByRole('button', { name: 'Duplicate as a new period' })).toBeVisible();
  await page.getByRole('button', { name: 'Create another packet' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('rapid question and attachment edits survive reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Question for your accountant').fill('Please confirm the bank conversion date.');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'rapid-evidence.txt', mimeType: 'text/plain', buffer: Buffer.from('saved immediately after a question') });
  await expect(page.getByText('rapid-evidence.txt')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Please confirm the bank conversion date.')).toBeVisible();
  await expect(page.getByText('rapid-evidence.txt')).toBeVisible();
});

test('@claim:account-free a packet can be created and kept without an account', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your packet' }).click();
  await page.getByLabel('Packet name').fill('No account packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No account packet');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No account packet');
  await expect(page.locator('input[type="password"], [autocomplete="username"], [autocomplete="email"]')).toHaveCount(0);
});

test('@claim:file-size-limit accepts 25 MiB and rejects one byte more', async ({ page }) => {
  test.slow();
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your packet' }).click();
  await page.getByLabel('Packet name').fill('File size packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'at-limit.bin', mimeType: 'application/octet-stream', buffer: Buffer.alloc(25 * 1024 * 1024) });
  await expect(page.getByText('at-limit.bin')).toBeVisible({ timeout: 30_000 });
  await page.locator('#file-input').setInputFiles({ name: 'too-large.bin', mimeType: 'application/octet-stream', buffer: Buffer.alloc(25 * 1024 * 1024 + 1) });
  await expect(page.getByText('over the 25 MB per-file limit')).toBeVisible();
  await expect(page.getByText('too-large.bin', { exact: true })).toHaveCount(0);
  await page.getByText('Packet details, history, and deletion').click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete packet and local files' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare evidence');
});

test('@claim:tracker-free root, demo, and privacy make no tracker request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await page.goto('/demo');
  await page.goto('/privacy');
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const delivered = await (await page.request.get('/assets/' + ((await page.locator('script[type="module"]').getAttribute('src')) || '').split('/').pop())).text();
  expect(delivered).not.toMatch(/google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net/i);
});

test('@claim:local-retention persists a packet until confirmed deletion', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your packet' }).click();
  await page.getByLabel('Packet name').fill('Retained packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Retained packet');
  await page.waitForTimeout(100);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Retained packet');
  await page.getByText('Packet details, history, and deletion').click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete packet and local files' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare evidence');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare evidence');
});

test('@claim:license-nonblocking a pending verification does not delay the workspace', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:compliance-evidence-pack', 'pending-license');
    localStorage.setItem('sb_license:compliance-evidence-pack:verdict', JSON.stringify({ valid: true, checkedAt: 0 }));
  });
  await page.route('**/api/v1/products/compliance-evidence-pack/verify?*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true }) });
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare evidence');
  await expect(page.getByText('Unlimited packets active')).toBeVisible();
});

test('route titles, designed 404, keyboard dialog, mobile layout, CSP, and accessibility pass', async ({ page, request }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  const response = await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.headers()['content-type']).toContain('application/manifest+json');
  await page.goto('/');
  await page.getByLabel('Primary navigation').getByRole('link', { name: 'Privacy' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Privacy, without fine print.');
  await page.goBack();
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Prepare evidence for your accountant.');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('button', { name: 'Start your packet' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  for (const [route, title] of [['/privacy', 'Privacy — Deadline Packet'], ['/terms', 'Terms — Deadline Packet'], ['/demo', 'Demo — Deadline Packet']] as const) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact || ''))).toEqual([]);
  }
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Deadline Packet');
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await page.goto('/misfiled-page');
  await expect(page).toHaveTitle('Page not found — Deadline Packet');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is not in the packet.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('390px 200% text reflows and all exposed mobile controls meet 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const scaled = await page.locator('h1').evaluate((heading) => {
    const rect = heading.getBoundingClientRect();
    return { right: rect.right, width: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth };
  });
  expect(scaled.right).toBeLessThanOrEqual(390.5);
  expect(scaled.width).toBeLessThanOrEqual(scaled.viewport);
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  const landingTargets = await page.locator('#import-button, a.button[href*="/checkout"], footer a').evaluateAll((targets) => targets.map((target) => target.getBoundingClientRect().height));
  expect(landingTargets.every((height) => height >= 44)).toBe(true);
});

test('removing a question requires confirmation and remains reversible before acceptance', async ({ page }) => {
  await page.goto('/demo');
  const question = page.getByText('Which exchange-rate record should I use for the May payment?');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Remove question' }).first().click();
  await expect(question).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove question' }).first().click();
  await expect(question).toHaveCount(0);
});

test('invalid import, file limit, and date validation keep clear recovery behavior', async ({ page }) => {
  await page.goto('/');
  await page.locator('#import-input').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  await expect(page.getByText('not a valid Deadline Packet backup')).toBeVisible();
  await page.getByRole('button', { name: 'Start your packet' }).click();
  await page.getByLabel('Packet name').fill('Validation packet');
  await page.getByLabel('Period starts').fill('2026-08-02');
  await page.getByLabel('Period ends').fill('2026-08-01');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByText('period start must be before')).toBeVisible();
  await page.getByLabel('Period starts').fill('2026-07-01');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'too-large.bin', mimeType: 'application/octet-stream', buffer: Buffer.alloc(25 * 1024 * 1024 + 1) });
  await expect(page.getByText('over the 25 MB per-file limit')).toBeVisible();
  await expect(page.locator('.file-list').getByText('too-large.bin')).toHaveCount(0);
});

test('a changed production worker replaces the old shell and offers reload', async ({ page }) => {
  const dist = resolve('dist');
  let workerVersion = 'deadline-packet-update-test-v1';
  const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url || '/', 'http://local').pathname;
      let file = pathname === '/' ? join(dist, 'index.html') : join(dist, pathname);
      if (!extname(file)) file = join(file, 'index.html');
      let body: Buffer | string;
      try { body = await readFile(file); }
      catch { body = await readFile(join(dist, 'index.html')); file = join(dist, 'index.html'); }
      if (pathname === '/sw.js') body = body.toString().replace(/const VERSION = '[^']+';/, `const VERSION = '${workerVersion}';`);
      response.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
      if (pathname === '/sw.js') response.setHeader('Cache-Control', 'no-cache');
      response.end(body);
    } catch {
      response.statusCode = 500;
      response.end('test server error');
    }
  });
  await new Promise<void>((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Update test server did not start.');
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    await page.goto(origin);
    await page.waitForFunction(async () => { await navigator.serviceWorker.ready; return Boolean(navigator.serviceWorker.controller); });
    await page.waitForFunction(() => caches.keys().then((keys) => keys.includes('deadline-packet-update-test-v1')));
    workerVersion = 'deadline-packet-update-test-v2';
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
    await expect(page.getByText('A fresh app version is ready.')).toBeVisible();
    await page.waitForFunction(() => caches.keys().then((keys) => keys.includes('deadline-packet-update-test-v2') && !keys.includes('deadline-packet-update-test-v1')));
  } finally {
    await page.goto('about:blank');
    await new Promise<void>((resolveClose) => server.close(() => resolveClose()));
  }
});

test('captures and restores a lifetime license without blocking first paint', async ({ page }) => {
  await page.route('**/api/v1/products/compliance-evidence-pack/verify?*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/?license=test-license-token');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByText('Unlimited packets active')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:compliance-evidence-pack'))).toBe('test-license-token');
});
