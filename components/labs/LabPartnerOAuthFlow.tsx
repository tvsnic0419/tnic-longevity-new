'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link2, Package, CheckCircle2, AlertCircle, LogOut, RefreshCw, Bell, BellOff } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import {
  LAB_OAUTH_SESSION_KEY,
  LAB_PENDING_ORDERS_KEY,
  labPartners,
  DEMO_PARTNER_ID,
  type LabOAuthSession,
  type PendingLabOrder,
} from '@/lib/lab-partner-oauth';
import { parsePartnerJson } from '@/lib/lab-partner-import';
import { labPartnerPanels } from '@/lib/lab-partners';
import {
  getNotificationPermission,
  isLabNotifyEnabled,
  requestLabNotificationPermission,
  setLabNotifyEnabled,
} from '@/lib/lab-notifications';
import { useLabOrderWatcher } from './useLabOrderWatcher';

interface ConnectablePartner {
  id: string;
  name: string;
  status: 'demo' | 'live' | 'coming_soon';
}

function LabPartnerOAuthFlowInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { importLabs } = usePlatform();
  const [session, setSession] = useState<LabOAuthSession | null>(null);
  const [connectable, setConnectable] = useState<ConnectablePartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState(DEMO_PARTNER_ID);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPanel, setSelectedPanel] = useState('longevity-baseline');
  const [pendingOrders, setPendingOrders] = useState<PendingLabOrder[]>([]);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyPermission, setNotifyPermission] = useState<NotificationPermission | 'unsupported'>('default');

  const loadPending = useCallback(() => {
    try {
      const raw = localStorage.getItem(LAB_PENDING_ORDERS_KEY);
      if (!raw) return;
      setPendingOrders(JSON.parse(raw) as PendingLabOrder[]);
    } catch {
      /* ignore */
    }
  }, []);

  const savePending = useCallback((orders: PendingLabOrder[]) => {
    localStorage.setItem(LAB_PENDING_ORDERS_KEY, JSON.stringify(orders));
    setPendingOrders(orders);
  }, []);

  useEffect(() => {
    fetch('/api/labs/partner/config')
      .then((r) => r.json())
      .then((data: { partners?: ConnectablePartner[] }) => {
        const partners = data.partners ?? [];
        setConnectable(partners);
        // Use functional form to read latest selectedPartner without it being a dep
        setSelectedPartner((prev) =>
          partners.length > 0 && !partners.find((p) => p.id === prev) ? partners[0].id : prev,
        );
      })
      .catch(() => {
        setConnectable([{ id: DEMO_PARTNER_ID, name: 'TNiC Demo Lab', status: 'demo' }]);
      });
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAB_OAUTH_SESSION_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as LabOAuthSession;
      if (new Date(s.expires_at) > new Date()) {
        setSession(s);
        setSelectedPartner(s.partner_id);
      } else {
        localStorage.removeItem(LAB_OAUTH_SESSION_KEY);
      }
    } catch {
      /* ignore */
    }
    loadPending();
    setNotifyEnabled(isLabNotifyEnabled());
    setNotifyPermission(getNotificationPermission());
  }, [loadPending]);

  const importPayload = useCallback(
    (payload: unknown, orderId: string) => {
      const result = parsePartnerJson(payload);
      if (result.entries.length === 0) {
        setMsg({ type: 'error', text: result.errors[0] ?? 'No importable results' });
        return 0;
      }
      const count = importLabs(result.entries);
      setMsg({
        type: 'success',
        text: `Order ${orderId} — imported ${count} biomarker${count === 1 ? '' : 's'}`,
      });
      return count;
    },
    [importLabs],
  );

  const { watching, pendingCount } = useLabOrderWatcher({
    pendingOrders,
    onPendingChange: savePending,
    importPayload,
    enabled: notifyEnabled || pendingOrders.some((o) => o.status === 'pending'),
  });

  const toggleNotifications = async () => {
    if (!notifyEnabled) {
      const perm = await requestLabNotificationPermission();
      setNotifyPermission(perm);
      if (perm !== 'granted') {
        setMsg({ type: 'error', text: 'Enable browser notifications in site settings to get lab result alerts.' });
        return;
      }
      setLabNotifyEnabled(true);
      setNotifyEnabled(true);
      setMsg({ type: 'success', text: 'Lab result notifications enabled — pending orders auto-import on webhook.' });
    } else {
      setLabNotifyEnabled(false);
      setNotifyEnabled(false);
    }
  };

  const exchangeCode = useCallback(
    async (code: string, partnerId: string) => {
      setLoading(true);
      try {
        const res = await fetch('/api/labs/partner/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, partner_id: partnerId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMsg({ type: 'error', text: data.error ?? 'OAuth exchange failed' });
          return;
        }
        const newSession: LabOAuthSession = {
          partner_id: data.partner_id,
          access_token: data.access_token,
          connected_at: data.connected_at,
          expires_at: data.expires_at,
        };
        localStorage.setItem(LAB_OAUTH_SESSION_KEY, JSON.stringify(newSession));
        setSession(newSession);
        setSelectedPartner(partnerId);
        const partnerName =
          connectable.find((p) => p.id === partnerId)?.name
          ?? labPartners.find((p) => p.id === partnerId)?.name
          ?? partnerId;
        setMsg({ type: 'success', text: `Connected to ${partnerName}` });
      } catch {
        setMsg({ type: 'error', text: 'OAuth exchange failed' });
      } finally {
        setLoading(false);
        const url = new URL(window.location.href);
        url.searchParams.delete('oauth_code');
        url.searchParams.delete('oauth_error');
        url.searchParams.delete('partner');
        router.replace(`${url.pathname}${url.search}${url.hash}`);
      }
    },
    [router, connectable],
  );

  useEffect(() => {
    const code = searchParams.get('oauth_code');
    const partner = searchParams.get('partner') ?? DEMO_PARTNER_ID;
    const oauthError = searchParams.get('oauth_error');
    if (oauthError) {
      setMsg({ type: 'error', text: `OAuth failed: ${oauthError}` });
    }
    if (code) exchangeCode(code, partner);
  }, [searchParams, exchangeCode]);

  const connect = () => {
    window.location.href = `/api/labs/partner/oauth/start?partner=${selectedPartner}`;
  };

  const disconnect = () => {
    localStorage.removeItem(LAB_OAUTH_SESSION_KEY);
    setSession(null);
    setMsg(null);
  };

  const placeOrder = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch('/api/labs/partner/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ panel_id: selectedPanel, partner_id: session.partner_id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg({ type: 'error', text: data.error ?? 'Order failed' });
        return;
      }
      if (data.import_payload) {
        importPayload(data.import_payload, data.order_id);
      } else if (data.status === 'pending') {
        const entry: PendingLabOrder = {
          order_id: data.order_id,
          panel_id: data.panel_id ?? selectedPanel,
          partner_id: session.partner_id,
          placed_at: new Date().toISOString(),
          status: 'pending',
        };
        savePending([entry, ...pendingOrders.filter((o) => o.order_id !== data.order_id)]);
        setMsg({
          type: 'success',
          text: `Order ${data.order_id} placed — auto-watching for partner webhook completion.`,
        });
      } else {
        setMsg({ type: 'success', text: `Order ${data.order_id} placed — results pending` });
      }
    } catch {
      setMsg({ type: 'error', text: 'Order request failed' });
    } finally {
      setLoading(false);
    }
  };

  const checkOrderStatus = async (order: PendingLabOrder) => {
    if (!session) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        order_id: order.order_id,
        partner_id: order.partner_id,
      });
      const res = await fetch(`/api/labs/partner/order/status?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg({ type: 'error', text: data.error ?? 'Status check failed' });
        return;
      }
      if (data.import_payload) {
        importPayload(data.import_payload, data.order_id);
        savePending(
          pendingOrders.map((o) =>
            o.order_id === order.order_id ? { ...o, status: 'complete' as const } : o,
          ),
        );
      } else {
        setMsg({ type: 'success', text: `Order ${order.order_id} still ${data.status ?? 'pending'}` });
      }
    } catch {
      setMsg({ type: 'error', text: 'Status check failed' });
    } finally {
      setLoading(false);
    }
  };

  const orderablePanels = labPartnerPanels.filter((p) => p.status !== 'waitlist');
  const activePending = pendingOrders.filter((o) => o.status === 'pending');

  return (
    <div id="lab-partner-oauth" className="glass rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4 text-accent-cyan" />
        <p className="text-label text-accent-cyan">Order at home · OAuth</p>
      </div>
      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
        Connect a lab partner, place an at-home panel order, and auto-import results. Enable browser
        notifications for webhook completions — no manual status polling required.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={toggleNotifications}
          className={`focus-ring inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
            notifyEnabled
              ? 'bg-accent-emerald/15 border-accent-emerald/30 text-accent-emerald'
              : 'glass border-border text-muted-foreground hover:text-accent-cyan'
          }`}
        >
          {notifyEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          {notifyEnabled ? 'Notifications on' : 'Enable result notifications'}
        </button>
        {watching && (
          <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
            Auto-watching {pendingCount} pending
          </span>
        )}
        {notifyPermission === 'denied' && (
          <span className="text-[10px] text-accent-amber">Notifications blocked in browser</span>
        )}
      </div>

      {msg && (
        <div
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-4 ${
            msg.type === 'success'
              ? 'bg-accent-emerald/10 text-accent-emerald'
              : 'bg-accent-rose/10 text-accent-rose'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          {msg.text}
        </div>
      )}

      {session ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              <span className="text-accent-emerald font-semibold">Connected</span>
              <span className="text-muted-foreground">
                {' '}
                · {labPartners.find((p) => p.id === session.partner_id)?.name ?? session.partner_id}
              </span>
            </p>
            <button
              type="button"
              onClick={disconnect}
              className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-accent-rose rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <select
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring"
              aria-label="Panel to order"
            >
              {orderablePanels.map((panel) => (
                <option key={panel.id} value={panel.id}>
                  {panel.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={placeOrder}
              disabled={loading}
              className="focus-ring inline-flex items-center justify-center gap-2 bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-5 py-3 rounded-xl font-semibold text-sm hover:bg-accent-cyan/30 transition shrink-0 disabled:opacity-60"
            >
              <Package className="w-4 h-4" />
              {loading ? 'Ordering…' : session.partner_id === DEMO_PARTNER_ID ? 'Order & import' : 'Place order'}
            </button>
          </div>

          {activePending.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Pending orders {watching ? '· polling webhook + status' : ''}
              </p>
              {activePending.map((order) => (
                <div
                  key={order.order_id}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs glass rounded-lg px-3 py-2"
                >
                  <span className="font-mono text-accent-cyan">{order.order_id}</span>
                  <span className="text-muted-foreground">{order.panel_id}</span>
                  <button
                    type="button"
                    onClick={() => checkOrderStatus(order)}
                    disabled={loading}
                    className="focus-ring inline-flex items-center gap-1 text-muted-foreground hover:text-accent-cyan disabled:opacity-50"
                    title="Manual fallback"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Force check
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          {connectable.length > 1 && (
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring"
              aria-label="Lab partner"
            >
              {connectable.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={connect}
            disabled={loading || connectable.length === 0}
            className="focus-ring inline-flex items-center gap-2 bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-5 py-3 rounded-xl font-semibold text-sm hover:bg-accent-cyan/30 transition disabled:opacity-60 shrink-0"
          >
            <Link2 className="w-4 h-4" />
            {loading
              ? 'Connecting…'
              : `Connect ${connectable.find((p) => p.id === selectedPartner)?.name ?? 'partner'}`}
          </button>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground mt-4 font-mono">
        API: GET /api/labs/partner/oauth/start · POST /api/labs/partner/oauth/token · POST
        /api/labs/partner/order · GET /api/labs/partner/events · POST /api/labs/partner/webhook
      </p>
    </div>
  );
}

export function LabPartnerOAuthFlow() {
  return (
    <Suspense fallback={<p className="text-xs text-muted-foreground mb-6">Loading partner OAuth…</p>}>
      <LabPartnerOAuthFlowInner />
    </Suspense>
  );
}