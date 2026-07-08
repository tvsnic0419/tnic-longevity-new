export const LAB_NOTIFY_PREF_KEY = 'tnic:lab-notify-enabled';

export function isLabNotifyEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(LAB_NOTIFY_PREF_KEY) === '1';
  } catch {
    return false;
  }
}

export function setLabNotifyEnabled(enabled: boolean): void {
  localStorage.setItem(LAB_NOTIFY_PREF_KEY, enabled ? '1' : '0');
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestLabNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function showLabOrderNotification(orderId: string, entryCount: number): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const title = 'Lab results ready';
  const body =
    entryCount > 0
      ? `Order ${orderId} — ${entryCount} biomarker${entryCount === 1 ? '' : 's'} imported into Labs hub.`
      : `Order ${orderId} panel complete — open Labs hub to review.`;

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: `tnic-lab-order-${orderId}`,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = '/labs#lab-partner-oauth';
    notification.close();
  };
}