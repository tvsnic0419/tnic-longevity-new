export const BRIEF_SUBSCRIBE_KEY = 'tnic:brief-subscribe';

export interface BriefSubscribeRecord {
  email: string;
  subscribedAt: string;
  frequency: 'weekly';
}

export function getBriefSubscription(): BriefSubscribeRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(BRIEF_SUBSCRIBE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BriefSubscribeRecord;
  } catch {
    return null;
  }
}

export function saveBriefSubscription(email: string): BriefSubscribeRecord | null {
  const record: BriefSubscribeRecord = {
    email,
    subscribedAt: new Date().toISOString(),
    frequency: 'weekly',
  };
  try {
    localStorage.setItem(BRIEF_SUBSCRIBE_KEY, JSON.stringify(record));
    return record;
  } catch {
    return null;
  }
}

export function clearBriefSubscription(): boolean {
  try {
    localStorage.removeItem(BRIEF_SUBSCRIBE_KEY);
    return true;
  } catch {
    return false;
  }
}