import type { ParsedLabRow } from './labs';

export const PARTNER_SCHEMA = 'tnic-lab-partner/v1' as const;

/** Partner marker codes → TNiC marker_id */
export const partnerMarkerMap: Record<string, string> = {
  GSH: 'gsh',
  GLUTATHIONE: 'gsh',
  'GLUTATHIONE (GSH)': 'gsh',
  HSCRP: 'hscrp',
  'HS-CRP': 'hscrp',
  CRP: 'hscrp',
  NAD: 'nad',
  'NAD+': 'nad',
  NAD_INDEX: 'nad',
  'NAD+ INDEX': 'nad',
  OXLDL: 'oxldl',
  'OXIDIZED LDL': 'oxldl',
  AKG: 'akg',
  'ALPHA-KETOGLUTARATE': 'akg',
  '8OHDG': '8ohdg',
  '8-OHDG': '8ohdg',
};

export interface PartnerImportPayload {
  schema: typeof PARTNER_SCHEMA;
  panel_id: string;
  collected_at: string;
  partner?: string;
  results: { code: string; value: number; unit?: string }[];
}

export interface PartnerImportResult {
  entries: ParsedLabRow[];
  errors: string[];
  meta: { panel_id?: string; partner?: string; schema?: string };
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, ' ');
}

function mapCodeToMarkerId(code: string): string | undefined {
  const key = normalizeCode(code);
  return partnerMarkerMap[key] ?? partnerMarkerMap[key.replace(/\s/g, '')];
}

export function parsePartnerJson(input: unknown): PartnerImportResult {
  const errors: string[] = [];
  const meta: PartnerImportResult['meta'] = {};

  if (!input || typeof input !== 'object') {
    return { entries: [], errors: ['Invalid JSON payload'], meta };
  }

  const payload = input as Partial<PartnerImportPayload>;
  meta.schema = payload.schema;
  meta.panel_id = payload.panel_id;
  meta.partner = payload.partner;

  if (payload.schema && payload.schema !== PARTNER_SCHEMA) {
    errors.push(`Unsupported schema "${payload.schema}" — expected ${PARTNER_SCHEMA}`);
  }

  const collectedAt = payload.collected_at;
  if (!collectedAt || !/^\d{4}-\d{2}-\d{2}$/.test(collectedAt)) {
    errors.push('collected_at must be YYYY-MM-DD');
    return { entries: [], errors, meta };
  }

  if (!Array.isArray(payload.results) || payload.results.length === 0) {
    errors.push('results array is required and must not be empty');
    return { entries: [], errors, meta };
  }

  const entries: ParsedLabRow[] = [];

  payload.results.forEach((row, i) => {
    if (!row || typeof row.code !== 'string') {
      errors.push(`results[${i}]: missing code`);
      return;
    }
    const markerId = mapCodeToMarkerId(row.code);
    if (!markerId) {
      errors.push(`results[${i}]: unknown code "${row.code}"`);
      return;
    }
    const value = Number(row.value);
    if (Number.isNaN(value)) {
      errors.push(`results[${i}]: invalid value`);
      return;
    }
    entries.push({ markerId, value, date: collectedAt });
  });

  return { entries, errors, meta };
}

/** TNiC Partner CSV v1 — marker_code,value,unit rows after metadata header */
export function parsePartnerCsv(text: string): PartnerImportResult {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const errors: string[] = [];
  const meta: PartnerImportResult['meta'] = { schema: PARTNER_SCHEMA };

  let collectedAt = new Date().toISOString().slice(0, 10);
  let dataStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    if (lower.startsWith('panel_id,')) {
      meta.panel_id = line.split(',')[1]?.trim();
      continue;
    }
    if (lower.startsWith('collected_at,')) {
      collectedAt = line.split(',')[1]?.trim() ?? collectedAt;
      continue;
    }
    if (lower.startsWith('partner,')) {
      meta.partner = line.split(',')[1]?.trim();
      continue;
    }
    if (lower.includes('marker_code') || lower.startsWith('code,')) {
      dataStart = i + 1;
      break;
    }
    if (lower.includes('marker') && lower.includes('value')) {
      dataStart = i + 1;
      break;
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(collectedAt)) {
    errors.push('collected_at must be YYYY-MM-DD (set via collected_at,YYYY-MM-DD header row)');
  }

  const entries: ParsedLabRow[] = [];

  for (let i = dataStart; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
    if (parts.length < 2) continue;

    const [code, valueStr] = parts;
    const markerId = mapCodeToMarkerId(code);
    if (!markerId) {
      errors.push(`Line ${i + 1}: unknown code "${code}"`);
      continue;
    }
    const value = parseFloat(valueStr);
    if (Number.isNaN(value)) {
      errors.push(`Line ${i + 1}: invalid value`);
      continue;
    }
    entries.push({ markerId, value, date: collectedAt });
  }

  if (entries.length === 0 && errors.length === 0) {
    errors.push('No valid partner rows found — check marker_code,value header');
  }

  return { entries, errors, meta };
}

export const PARTNER_CSV_TEMPLATE = `# TNiC Partner Export v1
panel_id,longevity-baseline
collected_at,2026-06-16
partner,demo-lab
marker_code,value,unit
GSH,5.2,umol/L
HS-CRP,0.9,mg/L
NAD_INDEX,82,relative`;

export const PARTNER_JSON_EXAMPLE: PartnerImportPayload = {
  schema: PARTNER_SCHEMA,
  panel_id: 'longevity-baseline',
  collected_at: '2026-06-16',
  partner: 'demo-lab',
  results: [
    { code: 'GSH', value: 5.2, unit: 'umol/L' },
    { code: 'HS-CRP', value: 0.9, unit: 'mg/L' },
    { code: 'NAD_INDEX', value: 82, unit: 'relative' },
  ],
};