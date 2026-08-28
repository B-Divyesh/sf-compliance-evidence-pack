import type { EvidenceFile, Packet } from './types';

export const demoMode = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
export const DB_NAME = demoMode ? 'deadline-packet-demo' : 'deadline-packet';
const DB_VERSION = 2;

type StoredFile = EvidenceFile & { encrypted?: boolean; iv?: number[] };

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('The local database could not be opened.'));
  });
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains('packets')) database.createObjectStore('packets', { keyPath: 'id' });
      if (!database.objectStoreNames.contains('files')) {
        const files = database.createObjectStore('files', { keyPath: 'id' });
        files.createIndex('packetId', 'packetId');
      }
      if (!database.objectStoreNames.contains('keys')) database.createObjectStore('keys', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('The local database could not be opened.'));
  });
}

async function store(name: 'packets' | 'files' | 'keys', mode: IDBTransactionMode = 'readonly') {
  const database = await open();
  return database.transaction(name, mode).objectStore(name);
}

function complete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('The local change could not be saved.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('The local change was cancelled.'));
  });
}

async function write(name: 'packets' | 'files' | 'keys', operation: (objectStore: IDBObjectStore) => void): Promise<void> {
  const database = await open();
  const transaction = database.transaction(name, 'readwrite');
  operation(transaction.objectStore(name));
  await complete(transaction);
  database.close();
}

export async function getPackets(): Promise<Packet[]> {
  const rows = await request((await store('packets')).getAll() as IDBRequest<Packet[]>);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function putPacket(packet: Packet): Promise<void> {
  await write('packets', (objectStore) => { objectStore.put(packet); });
}

export async function deletePacket(id: string): Promise<void> {
  await write('packets', (objectStore) => { objectStore.delete(id); });
  const files = await getFiles(id);
  await Promise.all(files.map((file) => deleteFile(file.id)));
}

export async function getFiles(packetId: string): Promise<EvidenceFile[]> {
  const objectStore = await store('files');
  const index = objectStore.index('packetId');
  const rows = await request(index.getAll(packetId) as IDBRequest<StoredFile[]>);
  const key = rows.some((row) => row.encrypted) ? await getDeviceKey() : null;
  return Promise.all(rows.map(async (row) => {
    if (!row.encrypted || !row.iv || !key) return row;
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(row.iv) }, key, await row.blob.arrayBuffer());
    const { encrypted: _encrypted, iv: _iv, ...file } = row;
    return { ...file, blob: new Blob([decrypted], { type: row.type }) };
  }));
}

export async function putFile(file: EvidenceFile): Promise<void> {
  const key = await getDeviceKey();
  if (!key) {
    await write('files', (objectStore) => { objectStore.put(file); });
    return;
  }
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, await file.blob.arrayBuffer());
  const stored: StoredFile = { ...file, blob: new Blob([encrypted]), encrypted: true, iv: [...iv] };
  await write('files', (objectStore) => { objectStore.put(stored); });
}

export async function deleteFile(id: string): Promise<void> {
  await write('files', (objectStore) => { objectStore.delete(id); });
}

export async function clearLocalData(): Promise<void> {
  const database = await open();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(['packets', 'files', 'keys'], 'readwrite');
    transaction.objectStore('packets').clear();
    transaction.objectStore('files').clear();
    transaction.objectStore('keys').clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Local data could not be cleared.'));
  });
  database.close();
}

async function getDeviceKey(): Promise<CryptoKey | null> {
  if (!globalThis.crypto?.subtle) return null;
  const existing = await request((await store('keys')).get('device') as IDBRequest<{ id: string; key: CryptoKey } | undefined>);
  if (existing?.key) return existing.key;
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  await write('keys', (objectStore) => { objectStore.put({ id: 'device', key }); });
  return key;
}
