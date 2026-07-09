'use client';

import { useCallback, useEffect, useState } from 'react';
import { getBriefSubscription } from '@/lib/brief-subscribe';
import {
  submitBriefSubscription,
  type BriefDeliveryMode,
  type BriefSubscribeResponse,
} from '@/lib/brief-subscribe-client';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

export function useBriefSubscribe(initialEmail = '') {
  const [email, setEmail] = useState(initialEmail);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<BriefDeliveryMode | null>(null);
  const [welcomeSent, setWelcomeSent] = useState(false);

  // Hydrate from client-only storage after mount; localStorage is unavailable during SSR.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const record = getBriefSubscription();
    if (record) {
      setSubscribed(true);
      setEmail(record.email);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const applyResult = useCallback((result: BriefSubscribeResponse) => {
    if (result.ok) {
      setSubscribed(true);
      setError(null);
      setDeliveryMode(result.mode ?? 'feed');
      setWelcomeSent(Boolean(result.welcomeSent));
      setNotice(result.message ?? null);
      trackEvent(ANALYTICS_EVENTS.emailSubscribed, { mode: result.mode ?? 'feed' });
      return true;
    }
    setError(result.error ?? 'Subscription failed.');
    return false;
  }, []);

  const subscribe = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!email.trim() || loading) return false;

      setLoading(true);
      setError(null);
      setNotice(null);

      const result = await submitBriefSubscription(email.trim());
      setLoading(false);
      return applyResult(result);
    },
    [applyResult, email, loading],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    email,
    setEmail,
    subscribed,
    loading,
    error,
    notice,
    deliveryMode,
    welcomeSent,
    subscribe,
    clearError,
  };
}