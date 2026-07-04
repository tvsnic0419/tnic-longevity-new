/**
 * Privacy-first local storage layer for health-adjacent user data.
 * All data stays in the browser — never transmitted to TNiC servers.
 */

export const PRIVACY_STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  version: 'tnic-storage-version',
  mode: 'tnic-privacy-mode',
  stack: 'tnic-stack',
  profile: 'tnic-profile',
  labs: 'tnic-labs',
  checklist: 'tnic-checklist',
  hallmarkNotes: 'tnic-hallmark-notes',
  milestones: 'tnic-user-milestones',
  consent: 'tnic-privacy-consent',
  quizResult: 'tnic-quiz-result',
} as const;

export type PrivacyStorageMode = 'local' | 'session';

export interface LabEntryStored {
  id: string;
  markerId: string;
  value: number;
  date: string;
}

export interface ProfileStored {
  age: number;
  stress: number;
  sleep: number;
  exercise: number;
  scanned: boolean;
}

function getStorage(mode: PrivacyStorageMode): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return mode === 'session' ? sessionStorage : localStorage;
  } catch {
    return null;
  }
}

export function getPrivacyMode(): PrivacyStorageMode {
  if (typeof window === 'undefined') return 'local';
  try {
    const mode = localStorage.getItem(STORAGE_KEYS.mode);
    return mode === 'session' ? 'session' : 'local';
  } catch {
    return 'local';
  }
}

export function setPrivacyMode(mode: PrivacyStorageMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.mode, mode);
  } catch {
    /* quota / private browsing */
  }
}

export function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function readStorageItem<T>(key: string, fallback: T, mode?: PrivacyStorageMode): T {
  const store = getStorage(mode ?? getPrivacyMode());
  if (!store) return fallback;
  return safeParseJSON(store.getItem(key), fallback);
}

export function writeStorageItem(key: string, value: unknown, mode?: PrivacyStorageMode): boolean {
  const store = getStorage(mode ?? getPrivacyMode());
  if (!store) return false;
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key: string, mode?: PrivacyStorageMode): void {
  const store = getStorage(mode ?? getPrivacyMode());
  store?.removeItem(key);
}

/** Validate lab entry shape before persisting imported data */
export function validateLabEntry(entry: unknown): entry is LabEntryStored {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.markerId === 'string' &&
    typeof e.value === 'number' &&
    Number.isFinite(e.value) &&
    typeof e.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(e.date)
  );
}

export function sanitizeLabEntries(entries: unknown[]): LabEntryStored[] {
  return entries.filter(validateLabEntry);
}

export function hasPrivacyConsent(): boolean {
  return readStorageItem<boolean>(STORAGE_KEYS.consent, false, 'local');
}

export function setPrivacyConsent(accepted: boolean): void {
  writeStorageItem(STORAGE_KEYS.consent, accepted, 'local');
}

/** Remove all health-adjacent persisted data from both storage modes */
export function purgeAllHealthData(): void {
  const keys = [
    STORAGE_KEYS.stack,
    STORAGE_KEYS.profile,
    STORAGE_KEYS.labs,
    STORAGE_KEYS.checklist,
    STORAGE_KEYS.hallmarkNotes,
    STORAGE_KEYS.milestones,
  ];
  (['local', 'session'] as PrivacyStorageMode[]).forEach((mode) => {
    keys.forEach((key) => removeStorageItem(key, mode));
  });
}

export function getStorageSummary(mode?: PrivacyStorageMode): {
  mode: PrivacyStorageMode;
  labsCount: number;
  hasProfile: boolean;
  hasStack: boolean;
  hasNotes: boolean;
} {
  const m = mode ?? getPrivacyMode();
  const labs = readStorageItem<LabEntryStored[]>(STORAGE_KEYS.labs, [], m);
  const profile = readStorageItem<ProfileStored | null>(STORAGE_KEYS.profile, null, m);
  const stack = readStorageItem<string[]>(STORAGE_KEYS.stack, [], m);
  const notes = readStorageItem<Record<string, unknown>>(STORAGE_KEYS.hallmarkNotes, {}, m);
  return {
    mode: m,
    labsCount: labs.length,
    hasProfile: !!profile,
    hasStack: stack.length > 0,
    hasNotes: Object.keys(notes).length > 0,
  };
}

export const PRIVACY_PRINCIPLES = [
  'Lab values and personal notes never leave your browser unless you export them.',
  'No accounts, cookies for health data, or server-side databases.',
  'Stack URL params share compound IDs only — never lab values.',
  'You can purge all data or switch to session-only storage anytime.',
] as const;