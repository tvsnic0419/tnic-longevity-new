import { biomarkers } from './data';
import type { LabEntry } from './labs';
import { PARTNER_SCHEMA, type PartnerImportPayload } from './lab-partner-import';

/** TNiC marker_id → Partner v1 code */
export const markerIdToPartnerCode: Record<string, string> = {
  gsh: 'GSH',
  hscrp: 'HS-CRP',
  nad: 'NAD_INDEX',
  oxldl: 'OXLDL',
  akg: 'AKG',
  '8ohdg': '8-OHDG',
};

function inferPanelId(markerIds: string[]): string {
  const set = new Set(markerIds);
  if (set.has('nad') && set.size <= 2) return 'mito-nad';
  if (set.has('hscrp') && !set.has('gsh') && set.size <= 3) return 'inflammation-surge';
  return 'longevity-baseline';
}

/** Build Partner v1 JSON from latest-date lab snapshot */
export function exportLabsPartnerJson(
  entries: LabEntry[],
  options?: { panel_id?: string; partner?: string },
): PartnerImportPayload | null {
  if (entries.length === 0) return null;

  const latestDate = [...new Set(entries.map((e) => e.date))].sort().reverse()[0];
  const panelEntries = entries.filter((e) => e.date === latestDate);

  const results: PartnerImportPayload['results'] = [];
  for (const entry of panelEntries) {
    const code = markerIdToPartnerCode[entry.markerId];
    if (!code) continue;
    const b = biomarkers.find((x) => x.id === entry.markerId);
    results.push({ code, value: entry.value, unit: b?.unit });
  }

  if (results.length === 0) return null;

  return {
    schema: PARTNER_SCHEMA,
    panel_id: options?.panel_id ?? inferPanelId(panelEntries.map((e) => e.markerId)),
    collected_at: latestDate,
    partner: options?.partner ?? 'tnic-export',
    results,
  };
}

export function exportLabsPartnerJsonString(entries: LabEntry[]): string {
  const payload = exportLabsPartnerJson(entries);
  return payload ? JSON.stringify(payload, null, 2) : '{}';
}

/** Group all logged dates into separate partner panels */
export function exportLabsPartnerPanels(entries: LabEntry[]): PartnerImportPayload[] {
  const dates = [...new Set(entries.map((e) => e.date))].sort();
  return dates
    .map((date) => exportLabsPartnerJson(entries.filter((e) => e.date === date)))
    .filter((p): p is PartnerImportPayload => p !== null);
}