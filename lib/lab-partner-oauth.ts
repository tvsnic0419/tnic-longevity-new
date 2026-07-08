import type { PartnerImportPayload } from './lab-partner-import';
import { PARTNER_SCHEMA } from './lab-partner-import';
import { isLivePartnerConfigured, LONGEVITY_DIRECT_ID } from './lab-partner-live';

export const LAB_OAUTH_SESSION_KEY = 'tnic:lab-oauth-session';
export const LAB_PENDING_ORDERS_KEY = 'tnic:lab-pending-orders';
export const DEMO_PARTNER_ID = 'tnic-demo-lab';

export interface LabPartnerConfig {
  id: string;
  name: string;
  status: 'demo' | 'live' | 'coming_soon';
  oauthAuthorizeUrl?: string;
  scopes: string[];
}

export const labPartners: LabPartnerConfig[] = [
  {
    id: DEMO_PARTNER_ID,
    name: 'TNiC Demo Lab (OAuth preview)',
    status: 'demo',
    scopes: ['labs.read', 'orders.create'],
  },
  {
    id: LONGEVITY_DIRECT_ID,
    name: 'Longevity Direct',
    status: 'coming_soon',
    scopes: ['labs.read', 'orders.create'],
  },
];

/** Server-side — resolves live partner env into status */
export function getResolvedLabPartners(): LabPartnerConfig[] {
  return labPartners.map((p) => {
    if (p.id === LONGEVITY_DIRECT_ID && isLivePartnerConfigured(p.id)) {
      return {
        ...p,
        status: 'live' as const,
        oauthAuthorizeUrl: process.env.LONGEVITY_DIRECT_AUTHORIZE_URL,
      };
    }
    return p;
  });
}

export interface LabOAuthSession {
  partner_id: string;
  access_token: string;
  connected_at: string;
  expires_at: string;
}

export interface LabOrderResponse {
  order_id: string;
  panel_id: string;
  status: 'pending' | 'complete' | 'demo_ready';
  import_payload?: PartnerImportPayload;
}

const demoPanelPayloads: Record<string, PartnerImportPayload> = {
  'longevity-baseline': {
    schema: PARTNER_SCHEMA,
    panel_id: 'longevity-baseline',
    collected_at: new Date().toISOString().slice(0, 10),
    partner: DEMO_PARTNER_ID,
    results: [
      { code: 'GSH', value: 5.6, unit: 'umol/L' },
      { code: 'HS-CRP', value: 0.7, unit: 'mg/L' },
      { code: 'NAD_INDEX', value: 84, unit: 'relative' },
      { code: 'OXLDL', value: 52, unit: 'U/L' },
    ],
  },
  'inflammation-surge': {
    schema: PARTNER_SCHEMA,
    panel_id: 'inflammation-surge',
    collected_at: new Date().toISOString().slice(0, 10),
    partner: DEMO_PARTNER_ID,
    results: [
      { code: 'HS-CRP', value: 1.1, unit: 'mg/L' },
      { code: 'GSH', value: 4.9, unit: 'umol/L' },
    ],
  },
  'mito-nad': {
    schema: PARTNER_SCHEMA,
    panel_id: 'mito-nad',
    collected_at: new Date().toISOString().slice(0, 10),
    partner: DEMO_PARTNER_ID,
    results: [{ code: 'NAD_INDEX', value: 78, unit: 'relative' }],
  },
};

export function createDemoToken(partnerId: string): string {
  return `demo_${partnerId}_${Date.now().toString(36)}`;
}

export function validateDemoToken(token: string, partnerId: string): boolean {
  return token.startsWith(`demo_${partnerId}_`);
}

export function createDemoOrder(panelId: string): LabOrderResponse {
  const payload = demoPanelPayloads[panelId] ?? demoPanelPayloads['longevity-baseline'];
  return {
    order_id: `ord_${panelId}_${Date.now().toString(36)}`,
    panel_id: panelId,
    status: 'demo_ready',
    import_payload: payload,
  };
}

export function getPartner(id: string): LabPartnerConfig | undefined {
  return labPartners.find((p) => p.id === id);
}

export function getResolvedPartner(id: string): LabPartnerConfig | undefined {
  return getResolvedLabPartners().find((p) => p.id === id);
}

export function getConnectablePartners(): LabPartnerConfig[] {
  return getResolvedLabPartners().filter((p) => p.status === 'demo' || p.status === 'live');
}

export interface PendingLabOrder {
  order_id: string;
  panel_id: string;
  partner_id: string;
  placed_at: string;
  status: 'pending' | 'complete' | 'demo_ready';
}