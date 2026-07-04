import type { LabOrderResponse } from './lab-partner-oauth';
import { SITE } from './site';

export const LONGEVITY_DIRECT_ID = 'longevity-direct';

export interface LivePartnerEnv {
  authorizeUrl: string;
  tokenUrl: string;
  orderUrl: string;
  statusUrl: string;
  clientId: string;
  clientSecret: string;
}

export function getLivePartnerEnv(partnerId: string): LivePartnerEnv | null {
  if (partnerId !== LONGEVITY_DIRECT_ID) return null;

  const authorizeUrl = process.env.LONGEVITY_DIRECT_AUTHORIZE_URL;
  const tokenUrl = process.env.LONGEVITY_DIRECT_TOKEN_URL;
  const orderUrl = process.env.LONGEVITY_DIRECT_ORDER_URL;
  const clientId = process.env.LONGEVITY_DIRECT_CLIENT_ID ?? process.env.LAB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.LONGEVITY_DIRECT_CLIENT_SECRET;

  if (!authorizeUrl || !tokenUrl || !orderUrl || !clientId || !clientSecret) {
    return null;
  }

  const statusUrl =
    process.env.LONGEVITY_DIRECT_STATUS_URL ?? `${orderUrl.replace(/\/$/, '')}/status`;

  return { authorizeUrl, tokenUrl, orderUrl, statusUrl, clientId, clientSecret };
}

export function isLivePartnerConfigured(partnerId: string): boolean {
  return getLivePartnerEnv(partnerId) !== null;
}

export function getOAuthCallbackUrl(): string {
  return `${SITE.url}/api/labs/partner/oauth/callback`;
}

export async function exchangeLiveAuthCode(
  code: string,
  partnerId: string,
): Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}> {
  const env = getLivePartnerEnv(partnerId);
  if (!env) throw new Error('Live partner not configured');

  const res = await fetch(env.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getOAuthCallbackUrl(),
      client_id: env.clientId,
      client_secret: env.clientSecret,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error_description?: string; error?: string }).error_description
      ?? (data as { error?: string }).error
      ?? `Token exchange failed (${res.status})`);
  }

  const access_token = (data as { access_token?: string }).access_token;
  if (!access_token) throw new Error('No access_token in partner response');

  return {
    access_token,
    expires_in: (data as { expires_in?: number }).expires_in ?? 3600,
    token_type: (data as { token_type?: string }).token_type ?? 'Bearer',
    scope: (data as { scope?: string }).scope,
  };
}

export async function createLivePartnerOrder(
  accessToken: string,
  panelId: string,
  partnerId: string,
): Promise<LabOrderResponse> {
  const env = getLivePartnerEnv(partnerId);
  if (!env) throw new Error('Live partner not configured');

  const res = await fetch(env.orderUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ panel_id: panelId, partner: partnerId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string; message?: string }).error
      ?? (data as { message?: string }).message
      ?? `Order failed (${res.status})`);
  }

  return {
    order_id: (data as { order_id: string }).order_id,
    panel_id: (data as { panel_id?: string }).panel_id ?? panelId,
    status: (data as { status?: LabOrderResponse['status'] }).status ?? 'pending',
    import_payload: (data as { import_payload?: LabOrderResponse['import_payload'] }).import_payload,
  };
}

export async function fetchLiveOrderStatus(
  accessToken: string,
  orderId: string,
  partnerId: string,
): Promise<LabOrderResponse> {
  const env = getLivePartnerEnv(partnerId);
  if (!env) throw new Error('Live partner not configured');

  const url = new URL(env.statusUrl);
  url.searchParams.set('order_id', orderId);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Status check failed (${res.status})`);
  }

  return {
    order_id: (data as { order_id: string }).order_id ?? orderId,
    panel_id: (data as { panel_id?: string }).panel_id ?? '',
    status: (data as { status?: LabOrderResponse['status'] }).status ?? 'pending',
    import_payload: (data as { import_payload?: LabOrderResponse['import_payload'] }).import_payload,
  };
}

export function isLiveAccessToken(token: string, partnerId: string): boolean {
  if (partnerId !== LONGEVITY_DIRECT_ID) return false;
  return !token.startsWith('demo_');
}