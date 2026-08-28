import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
const shell = ['/', '/demo', '/privacy', '/terms', '/index.html', '/offline.html', '/offline.css', '/manifest.webmanifest', '/favicon.svg', '/assets/deadline-packet-hero.webp', '/icons/icon-192.png', '/icons/icon-512.png', ...assets];
const worker = await readFile('dist/sw.js', 'utf8');
await writeFile('dist/sw.js', worker.replace(/const SHELL = \[[^;]+;/, `const SHELL = ${JSON.stringify([...new Set(shell)])};`));

for (const route of ['demo', 'privacy', 'terms']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await cp('dist/index.html', `dist/${route}/index.html`);
}
await cp('dist/index.html', 'dist/404.html');
