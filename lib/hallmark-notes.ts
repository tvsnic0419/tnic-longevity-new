export const HALLMARK_NOTES_KEY = 'tnic-hallmark-notes';

export interface HallmarkPersonalEntry {
  status: number;
  notes: string;
  updatedAt: string;
}

export type HallmarkNotesMap = Record<string, HallmarkPersonalEntry>;

export const DEFAULT_HALLMARK_ENTRY: HallmarkPersonalEntry = {
  status: 50,
  notes: '',
  updatedAt: '',
};