import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearResearchIntent,
  readResearchIntent,
  subscribeToResearchIntent,
  writeResearchIntent,
} from './research-intent';
import { purgeAllHealthData, STORAGE_KEYS } from './privacy';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('research intent persistence', () => {
  let local: MemoryStorage;
  let session: MemoryStorage;

  beforeEach(() => {
    local = new MemoryStorage();
    session = new MemoryStorage();
    const browser = new EventTarget();
    Object.defineProperties(browser, {
      localStorage: { value: local },
      sessionStorage: { value: session },
    });
    vi.stubGlobal('window', browser);
    vi.stubGlobal('localStorage', local);
    vi.stubGlobal('sessionStorage', session);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stores and retrieves a visitor-authored question in the active local mode', () => {
    expect(readResearchIntent()).toBe('');
    expect(writeResearchIntent('Which source context should I inspect?')).toBe(true);
    expect(readResearchIntent()).toBe('Which source context should I inspect?');
    expect(local.getItem(STORAGE_KEYS.researchIntent)).toBe('"Which source context should I inspect?"');
  });

  it('isolates an intent in session-only mode', () => {
    local.setItem(STORAGE_KEYS.mode, 'session');

    expect(writeResearchIntent('What evidence route should I inspect next?')).toBe(true);
    expect(session.getItem(STORAGE_KEYS.researchIntent)).toBe('"What evidence route should I inspect next?"');
    expect(local.getItem(STORAGE_KEYS.researchIntent)).toBeNull();
    expect(readResearchIntent()).toBe('What evidence route should I inspect next?');
  });

  it('notifies subscribers on write and clear without including the question in the event', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToResearchIntent(callback);

    writeResearchIntent('Which source context should I inspect?');
    clearResearchIntent();
    unsubscribe();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(readResearchIntent()).toBe('');
  });

  it('removes research intent from both storage modes during the global privacy purge', () => {
    local.setItem(STORAGE_KEYS.researchIntent, '"persistent"');
    session.setItem(STORAGE_KEYS.researchIntent, '"session-only"');

    purgeAllHealthData();

    expect(local.getItem(STORAGE_KEYS.researchIntent)).toBeNull();
    expect(session.getItem(STORAGE_KEYS.researchIntent)).toBeNull();
  });
});
