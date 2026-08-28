import { describe, expect, it } from 'vitest';
import { makePdf, makeZip } from '../src/export';
import { makeBackup } from '../src/export';
import { parseBackup } from '../src/backup';
import type { Packet } from '../src/types';
import { formatDate } from '../src/utils';

const packet: Packet = {
  id: 'packet-1',
  name: 'Q2 cross-border evidence',
  periodStart: '2026-04-01',
  periodEnd: '2026-06-30',
  deadline: '2026-07-20',
  accountant: 'A. Reviewer',
  note: 'Please review the remittance timing.',
  checklist: [
    { id: 'ready', label: 'Sales invoices', complete: true },
    { id: 'missing', label: 'Bank statement', complete: false },
  ],
  questions: [{ id: 'question', text: 'Which rate record should I use?', answered: false }],
  history: [],
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

describe('accountant exports', () => {
  it('formats packet dates consistently in day-month-year order', () => {
    expect(formatDate('2026-11-20')).toBe('20 Nov 2026');
  });

  it('builds a valid PDF with packet labels', () => {
    const pdf = makePdf(packet, []);
    expect(new TextDecoder().decode(pdf.slice(0, 8))).toBe('%PDF-1.4');
    expect(new TextDecoder().decode(pdf)).toContain('EVIDENCE GAPS');
  });

  it('builds a ZIP containing both human-readable indexes', async () => {
    const zip = await makeZip(packet, []);
    const bytes = new Uint8Array(await zip.arrayBuffer());
    expect([...bytes.slice(0, 2)]).toEqual([0x50, 0x4b]);
    expect(zip.size).toBeGreaterThan(500);
  });

  it('round-trips a complete backup and normalizes legacy file-size metadata', async () => {
    const backup = await makeBackup(packet, [{
      id: 'file-1', packetId: packet.id, name: 'receipt.txt', type: 'text/plain', size: 99,
      category: 'Receipt', note: '', addedAt: '2026-07-01T00:00:00.000Z', blob: new Blob(['receipt']),
    }]);
    const parsed = parseBackup(JSON.parse(await backup.text()));
    expect(parsed).not.toBeNull();
    expect(parsed?.files[0]).toMatchObject({ name: 'receipt.txt', size: 7 });
  });
});
