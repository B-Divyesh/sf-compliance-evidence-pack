import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const html = await readFile('dist/index.html', 'utf8');
const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
const shell = ['/', '/demo', '/privacy', '/terms', '/index.html', '/offline.html', '/offline.css', '/manifest.webmanifest', '/favicon.svg', '/assets/deadline-packet-hero.webp', '/icons/icon-192.png', '/icons/icon-512.png', ...assets];
const worker = await readFile('dist/sw.js', 'utf8');
const buildId = `${Date.now().toString(36)}-${createHash('sha256').update(html).update(JSON.stringify(assets)).digest('hex').slice(0, 8)}`;
await writeFile('dist/sw.js', worker
  .replace(/const VERSION = '[^']+';/, `const VERSION = 'deadline-packet-${buildId}';`)
  .replace(/const SHELL = \[[^;]+;/, `const SHELL = ${JSON.stringify([...new Set(shell)])};`));

// An old service worker may be controlling the first page of an update. A
// build-specific asset query lets that first paint request the new hashed app
// shell instead of accepting the prior worker's cache entry.
const versionedHtml = html.replace(/(\/(?:assets)\/[^"?]+)(?=")/g, `$1?v=${buildId}`);
await writeFile('dist/index.html', versionedHtml);

for (const route of ['demo', 'privacy', 'terms']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await cp('dist/index.html', `dist/${route}/index.html`);
}
await cp('dist/index.html', 'dist/404.html');
