import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates and exports a complete local packet workflow', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Beat the deadline');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name').fill('April–June evidence');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('April–June evidence');
  await page.getByLabel('Sales invoices for the filing period').check();
  await page.getByLabel('Add a custom evidence item').fill('Platform payout statement');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByLabel('Question for your accountant').fill('Which exchange-rate record should I include?');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'invoice-104.txt', mimeType: 'text/plain', buffer: Buffer.from('Invoice evidence') });
  await expect(page.getByText('invoice-104.txt')).toBeVisible();
  await expect(page.getByText('1 of 7 evidence groups ready')).toBeVisible();
  const storedFile = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('deadline-packet'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const record = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const request = database.transaction('files').objectStore('files').getAll(); request.onsuccess = () => resolve(request.result[0]); request.onerror = () => reject(request.error);
    });
    return { encrypted: record.encrypted, text: await (record.blob as Blob).text() };
  });
  expect(storedFile.encrypted).toBe(true);
  expect(storedFile.text).not.toContain('Invoice evidence');
  const dashboard = await new AxeBuilder({ page }).analyze();
  expect(dashboard.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact || ''))).toEqual([]);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export accountant ZIP' }).click();
  const exported = await downloadPromise;
  expect(exported.suggestedFilename()).toContain('accountant-packet.zip');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(consoleErrors).toEqual([]);
});

test('landing and legal page have no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const landing = await new AxeBuilder({ page }).analyze();
  expect(landing.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact || ''))).toEqual([]);
  await page.getByRole('link', { name: 'Privacy', exact: true }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator('h1')).toHaveCount(1);
  const privacy = await new AxeBuilder({ page }).analyze();
  expect(privacy.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact || ''))).toEqual([]);
});

test('installed shell and packet remain available offline', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name').fill('Offline filing period');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return true;
  });
  const cachedPaths = await page.evaluate(async () => {
    const names = await caches.keys();
    const requests = (await Promise.all(names.map(async (name) => (await caches.open(name)).keys()))).flat();
    return requests.map((request) => new URL(request.url).pathname);
  });
  expect(cachedPaths.some((path) => path.endsWith('.js'))).toBe(true);
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Offline filing period');
  await expect(page.getByText('Offline — edits still save')).toBeVisible();
});

test('mobile layout stays within a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.getByRole('button', { name: 'Start your first packet' })).toBeVisible();
});

test('imports a user-owned JSON backup as the first packet', async ({ page }) => {
  await page.goto('/');
  const now = new Date().toISOString();
  const backup = {
    version: 1,
    packet: {
      id: 'old-id', name: 'Imported filing period', periodStart: '2026-01-01', periodEnd: '2026-03-31',
      deadline: '2026-04-15', accountant: '', note: '',
      checklist: [{ id: 'one', label: 'Sales invoices', complete: true }], questions: [], history: [],
      createdAt: now, updatedAt: now,
    },
    files: [],
  };
  await page.locator('#import-input').setInputFiles({ name: 'packet-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Imported filing period — imported');
});

test('captures and restores a lifetime license without blocking first paint', async ({ page }) => {
  await page.route('**/api/v1/products/compliance-evidence-pack/verify?*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/?license=test-license-token');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByText('Unlimited packets active')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:compliance-evidence-pack'))).toBe('test-license-token');
});
