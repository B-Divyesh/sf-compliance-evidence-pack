import type { EvidenceFile, Packet } from './types';

type BackupFile = Omit<EvidenceFile, 'blob' | 'id' | 'packetId'> & { data: string };

export type ParsedBackup = {
  packet: Packet;
  files: Array<Omit<EvidenceFile, 'blob' | 'id' | 'packetId'> & { bytes: Uint8Array }>;
};

const date = /^\d{4}-\d{2}-\d{2}$/;
const timestamp = /^\d{4}-\d{2}-\d{2}T/;

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function text(value: unknown, maximum: number, required = true): value is string {
  return typeof value === 'string' && value.trim().length >= (required ? 1 : 0) && value.length <= maximum;
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && date.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function validTimestamp(value: unknown): value is string {
  return typeof value === 'string' && timestamp.test(value) && !Number.isNaN(Date.parse(value));
}

function decodeBase64(value: string): Uint8Array | null {
  // A backup is JSON, so base64 is the only accepted binary representation.
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) return null;
  try { return Uint8Array.from(atob(value), (character) => character.charCodeAt(0)); }
  catch { return null; }
}

function validPacket(value: unknown): value is Packet {
  if (!record(value)
    || !text(value.id, 160) || !text(value.name, 80) || !validDate(value.periodStart)
    || !validDate(value.periodEnd) || !validDate(value.deadline) || !text(value.accountant, 100, false)
    || !text(value.note, 1000, false) || !validTimestamp(value.createdAt) || !validTimestamp(value.updatedAt)
    || !Array.isArray(value.checklist) || !Array.isArray(value.questions) || !Array.isArray(value.history)) return false;
  return value.checklist.every((item) => record(item) && text(item.id, 160) && text(item.label, 100)
    && typeof item.complete === 'boolean' && (item.custom === undefined || typeof item.custom === 'boolean'))
    && value.questions.every((item) => record(item) && text(item.id, 160) && text(item.text, 180)
      && typeof item.answered === 'boolean')
    && value.history.every((item) => record(item) && validTimestamp(item.at) && text(item.action, 240));
}

/** A backup must be wholly valid before callers are allowed to write any row. */
export function parseBackup(value: unknown): ParsedBackup | null {
  if (!record(value) || value.version !== 1 || !validPacket(value.packet) || (value.files !== undefined && !Array.isArray(value.files))) return null;
  const files: ParsedBackup['files'] = [];
  for (const candidate of (value.files ?? [])) {
    if (!record(candidate) || !text(candidate.name, 255) || !text(candidate.type, 180)
      || !Number.isSafeInteger(candidate.size) || (candidate.size as number) < 0
      || !text(candidate.category, 100) || !text(candidate.note, 1000, false)
      || !validTimestamp(candidate.addedAt) || typeof candidate.data !== 'string') return null;
    const bytes = decodeBase64(candidate.data);
    if (!bytes || bytes.byteLength > 25 * 1024 * 1024) return null;
    // Older app builds recorded two sample-file sizes incorrectly. The bytes
    // are authoritative, so preserve valid historical backups and normalize
    // their metadata rather than rejecting an otherwise complete packet.
    files.push({ name: candidate.name, type: candidate.type, size: bytes.byteLength, category: candidate.category, note: candidate.note, addedAt: candidate.addedAt, bytes });
  }
  return { packet: value.packet, files };
}

/** Also used while opening old local stores, so a bad row cannot brick startup. */
export function isValidPacket(value: unknown): value is Packet {
  return validPacket(value);
}
