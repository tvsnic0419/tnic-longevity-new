import {
  getPrivacyMode,
  readStorageItem,
  removeStorageItem,
  STORAGE_KEYS,
  writeStorageItem,
} from './privacy';

const UPDATE_EVENT = 'tnic:research-intent-updated';

function notifyResearchIntentUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
}

/**
 * A short, visitor-authored research prompt. It remains separate from the
 * deterministic stack and lab models: it is never used to generate an outcome,
 * sent to a server, or included in analytics properties.
 */
export function readResearchIntent(): string {
  return readStorageItem<string>(STORAGE_KEYS.researchIntent, '', getPrivacyMode());
}

export function writeResearchIntent(intent: string): boolean {
  const saved = writeStorageItem(STORAGE_KEYS.researchIntent, intent, getPrivacyMode());
  if (saved) notifyResearchIntentUpdate();
  return saved;
}

export function clearResearchIntent(): void {
  removeStorageItem(STORAGE_KEYS.researchIntent, getPrivacyMode());
  notifyResearchIntentUpdate();
}

export function getResearchIntentSnapshot(): string {
  return readResearchIntent();
}

export function subscribeToResearchIntent(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('storage', callback);
  window.addEventListener('focus', callback);
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('focus', callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}
