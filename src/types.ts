export type ChecklistItem = {
  id: string;
  label: string;
  complete: boolean;
  custom?: boolean;
};

export type Question = {
  id: string;
  text: string;
  answered: boolean;
};

export type HistoryEntry = {
  at: string;
  action: string;
};

export type Packet = {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  deadline: string;
  accountant: string;
  note: string;
  checklist: ChecklistItem[];
  questions: Question[];
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
};

export type EvidenceFile = {
  id: string;
  packetId: string;
  name: string;
  type: string;
  size: number;
  category: string;
  note: string;
  addedAt: string;
  blob: Blob;
};
