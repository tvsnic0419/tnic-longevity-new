'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  LAB_OAUTH_SESSION_KEY,
  LAB_PENDING_ORDERS_KEY,
  type LabOAuthSession,
  type PendingLabOrder,
} from '@/lib/lab-partner-oauth';
import { showLabOrderNotification, isLabNotifyEnabled } from '@/lib/lab-notifications';

const POLL_MS = 20_000;

interface UseLabOrderWatcherOptions {
  pendingOrders: PendingLabOrder[];
  onPendingChange: (orders: PendingLabOrder[]) => void;
  importPayload: (payload: unknown, orderId: string) => number;
  enabled: boolean;
}

export function useLabOrderWatcher({
  pendingOrders,
  onPendingChange,
  importPayload,
  enabled,
}: UseLabOrderWatcherOptions) {
  const lastCheckRef = useRef(new Date().toISOString());
  const pendingRef = useRef(pendingOrders);
  // Mirror the latest pending orders into a ref so the polling loop reads
  // current data without restarting. Updating in an effect (not during render)
  // satisfies React 19's "no ref mutation during render" rule.
  useEffect(() => {
    pendingRef.current = pendingOrders;
  }, [pendingOrders]);

  const markComplete = useCallback(
    (orderId: string) => {
      let stored: PendingLabOrder[] = [];
      try {
        stored = JSON.parse(localStorage.getItem(LAB_PENDING_ORDERS_KEY) ?? '[]') as PendingLabOrder[];
      } catch {
        stored = pendingRef.current;
      }
      const next = stored.map((o) =>
        o.order_id === orderId ? { ...o, status: 'complete' as const } : o,
      );
      localStorage.setItem(LAB_PENDING_ORDERS_KEY, JSON.stringify(next));
      onPendingChange(next);
    },
    [onPendingChange],
  );

  const handleCompletion = useCallback(
    (orderId: string, payload: unknown, entryCount?: number) => {
      const count = importPayload(payload, orderId);
      if (count <= 0) return;
      markComplete(orderId);
      if (isLabNotifyEnabled()) {
        showLabOrderNotification(orderId, entryCount ?? count);
      }
    },
    [importPayload, markComplete],
  );

  const pollStatus = useCallback(
    async (order: PendingLabOrder, session: LabOAuthSession) => {
      const params = new URLSearchParams({
        order_id: order.order_id,
        partner_id: order.partner_id,
      });
      const res = await fetch(`/api/labs/partner/order/status?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (res.ok && data.ok && data.import_payload) {
        handleCompletion(order.order_id, data.import_payload, data.entries?.length);
      }
    },
    [handleCompletion],
  );

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;

      const active = pendingRef.current.filter((o) => o.status === 'pending');
      if (active.length === 0) return;

      let session: LabOAuthSession | null = null;
      try {
        const raw = localStorage.getItem(LAB_OAUTH_SESSION_KEY);
        if (raw) session = JSON.parse(raw) as LabOAuthSession;
      } catch {
        return;
      }
      if (!session || new Date(session.expires_at) <= new Date()) return;

      const since = lastCheckRef.current;
      const orderIds = active.map((o) => o.order_id).join(',');

      try {
        const eventsRes = await fetch(
          `/api/labs/partner/events?since=${encodeURIComponent(since)}&order_ids=${encodeURIComponent(orderIds)}`,
        );
        const eventsData = await eventsRes.json();
        if (eventsData.ok && Array.isArray(eventsData.events)) {
          for (const event of eventsData.events) {
            if (event.import_payload && event.order_id) {
              handleCompletion(event.order_id, event.import_payload, event.entry_count);
            }
          }
        }
      } catch {
        /* status poll fallback handles missed webhook events */
      }

      const stillPending = pendingRef.current.filter((o) => o.status === 'pending');
      for (const order of stillPending) {
        if (cancelled) break;
        await pollStatus(order, session);
      }

      lastCheckRef.current = new Date().toISOString();
    };

    tick();
    const interval = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [enabled, handleCompletion, pollStatus]);

  const activeCount = pendingOrders.filter((o) => o.status === 'pending').length;
  return { watching: enabled && activeCount > 0, pendingCount: activeCount };
}
