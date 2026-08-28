import { zipSync, strToU8 } from 'fflate';
import type { EvidenceFile, Packet } from './types';
import { escapeHtml, formatDate, safeFilename } from './utils';

function ascii(value: string): string {
  return value.normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/([\\()])/g, '\\$1');
}

function wrap(value: string, width = 76): string[] {
  const words = ascii(value).split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (`${line} ${word}`.trim().length > width && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

export function makePdf(packet: Packet, files: EvidenceFile[]): Uint8Array {
  const missing = packet.checklist.filter((item) => !item.complete);
  const openQuestions = packet.questions.filter((question) => !question.answered);
  const lines = [
    'DEADLINE PACKET / ACCOUNTANT INDEX',
    '',
    packet.name,
    `Period: ${formatDate(packet.periodStart)} to ${formatDate(packet.periodEnd)}`,
    `Deadline: ${formatDate(packet.deadline)}`,
    `Accountant/contact: ${packet.accountant || 'Not specified'}`,
    '',
    `EVIDENCE FILES (${files.length})`,
    ...files.flatMap((file, index) => wrap(`${index + 1}. [${file.category}] ${file.name}${file.note ? ` - ${file.note}` : ''}`)),
    '',
    `EVIDENCE GAPS (${missing.length})`,
    ...(missing.length ? missing.flatMap((item) => wrap(`- ${item.label}`)) : ['No evidence gaps.']),
    '',
    `OPEN QUESTIONS (${openQuestions.length})`,
    ...(openQuestions.length ? openQuestions.flatMap((question) => wrap(`- ${question.text}`)) : ['None.']),
    '',
    'PACKET NOTE',
    ...wrap(packet.note || 'No additional note.'),
    '',
    'Prepared locally with Deadline Packet. This index is organizational',
    'and is not tax, legal, or filing advice.',
  ];

  const pages: string[][] = [];
  for (let index = 0; index < lines.length; index += 42) pages.push(lines.slice(index, index + 42));
  const objects: string[] = [];
  const fontId = 3 + pages.length * 2;
  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>';
  const kids = pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ');
  objects[1] = `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`;
  pages.forEach((page, index) => {
    const pageId = 3 + index * 2;
    const contentId = pageId + 1;
    const commands = `BT /F1 11 Tf 48 792 Td 16 TL ${page.map((line) => `(${ascii(line)}) Tj T*`).join(' ')} ET`;
    objects[pageId - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId - 1] = `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`;
  });
  objects[fontId - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return strToU8(pdf);
}

function makeIndexHtml(packet: Packet, files: EvidenceFile[]): string {
  const missing = packet.checklist.filter((item) => !item.complete);
  const questions = packet.questions.filter((item) => !item.answered);
  const list = (values: string[], empty: string) => values.length ? `<ol>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ol>` : `<p>${empty}</p>`;
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(packet.name)} — evidence index</title><style>body{font:16px/1.55 system-ui;max-width:760px;margin:48px auto;padding:0 24px;color:#152126}h1{font-size:2.5rem;border-bottom:6px solid #2aa8a2;padding-bottom:16px}h2{margin-top:32px}small{color:#536469}@media print{body{margin:0}a{color:inherit}}</style><main><p><small>ACCOUNTANT HANDOFF / ${escapeHtml(packet.periodStart)}—${escapeHtml(packet.periodEnd)}</small></p><h1>${escapeHtml(packet.name)}</h1><p><strong>Deadline:</strong> ${escapeHtml(formatDate(packet.deadline))}<br><strong>Contact:</strong> ${escapeHtml(packet.accountant || 'Not specified')}</p><h2>Evidence files (${files.length})</h2>${list(files.map((file) => `[${file.category}] ${file.name}${file.note ? ` — ${file.note}` : ''}`), 'No files included.')}<h2>Evidence gaps (${missing.length})</h2>${list(missing.map((item) => item.label), 'No evidence gaps.')}<h2>Open questions (${questions.length})</h2>${list(questions.map((item) => item.text), 'No open questions.')}<h2>Packet note</h2><p>${escapeHtml(packet.note || 'No additional note.')}</p><hr><p><small>Prepared locally with Deadline Packet. Organizational index only; not tax, legal, or filing advice.</small></p></main></html>`;
}

export async function makeZip(packet: Packet, files: EvidenceFile[]): Promise<Blob> {
  const archive: Record<string, Uint8Array> = {
    'README-FIRST.html': strToU8(makeIndexHtml(packet, files)),
    'accountant-index.pdf': makePdf(packet, files),
    'packet-data.json': strToU8(JSON.stringify({ version: 1, packet: { ...packet }, files: files.map(({ blob: _blob, ...file }) => file) }, null, 2)),
  };
  await Promise.all(files.map(async (file, index) => {
    archive[`evidence/${String(index + 1).padStart(2, '0')}-${safeFilename(file.name)}${file.name.includes('.') ? `.${file.name.split('.').pop()}` : ''}`] = new Uint8Array(await file.blob.arrayBuffer());
  }));
  return new Blob([zipSync(archive, { level: 6 }) as BlobPart], { type: 'application/zip' });
}

export async function makeBackup(packet: Packet, files: EvidenceFile[]): Promise<Blob> {
  const backups = await Promise.all(files.map(async ({ blob, ...file }) => {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let index = 0; index < bytes.length; index += 32_768) binary += String.fromCharCode(...bytes.subarray(index, index + 32_768));
    return { ...file, data: btoa(binary) };
  }));
  return new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), packet, files: backups }, null, 2)], { type: 'application/json' });
}
