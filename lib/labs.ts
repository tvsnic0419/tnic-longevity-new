import { biomarkers } from './data';
import { STORAGE_KEYS } from './privacy';

export interface LabEntry {
  id: string;
  markerId: string;
  value: number;
  date: string;
}

/** @deprecated Use STORAGE_KEYS.labs from lib/privacy */
export const LABS_STORAGE_KEY = STORAGE_KEYS.labs;

export function getLabStatus(markerId: string, value: number): 'optimal' | 'watch' | 'critical' {
  if (markerId === 'hscrp') {
    if (value < 1) return 'optimal';
    if (value <= 3) return 'watch';
    return 'critical';
  }
  if (markerId === 'nad') {
    if (value >= 80) return 'optimal';
    if (value >= 50) return 'watch';
    return 'critical';
  }
  if (markerId === 'gsh') {
    if (value >= 5) return 'optimal';
    if (value >= 3.5) return 'watch';
    return 'critical';
  }
  if (value >= 70) return 'optimal';
  if (value >= 45) return 'watch';
  return 'critical';
}

export function parseOptimalRange(optimal: string): { min: number; max: number } | null {
  const match = optimal.match(/([\d.]+)\s*[–-]\s*([\d.]+)/);
  if (match) return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
  const lt = optimal.match(/<\s*([\d.]+)/);
  if (lt) return { min: 0, max: parseFloat(lt[1]) };
  return null;
}

export function exportLabsCsv(entries: LabEntry[]): string {
  const header = 'date,marker_id,marker_name,value,unit,status';
  const rows = entries.map((e) => {
    const b = biomarkers.find((x) => x.id === e.markerId);
    const status = getLabStatus(e.markerId, e.value);
    return `${e.date},${e.markerId},"${b?.name ?? e.markerId}",${e.value},"${b?.unit ?? ''}",${status}`;
  });
  return [header, ...rows].join('\n');
}

export function isTrendGood(markerId: string, direction: 'up' | 'down'): boolean {
  if (markerId === 'hscrp' || markerId === '8ohdg' || markerId === 'oxldl') return direction === 'down';
  return direction === 'up';
}

export const biomarkerHallmarkMap: Record<string, string[]> = {
  gsh: ['mito', 'proteostasis', 'inflammation'],
  nad: ['mito', 'genomic', 'epigenetic', 'senescence', 'nutrient'],
  hscrp: ['inflammation', 'senescence', 'communication'],
  oxldl: ['mito', 'inflammation', 'genomic'],
  akg: ['epigenetic', 'mito', 'stem'],
  '8ohdg': ['genomic', 'mito', 'proteostasis'],
};

export const LABS_CSV_TEMPLATE = `date,marker_id,marker_name,value,unit,status
2026-01-15,gsh,Glutathione (GSH),4.2,μmol/L,watch
2026-03-20,gsh,Glutathione (GSH),5.8,μmol/L,optimal
2026-01-15,hscrp,hs-CRP,2.1,mg/L,watch
2026-03-20,hscrp,hs-CRP,0.8,mg/L,optimal`;

export interface ParsedLabRow {
  markerId: string;
  value: number;
  date: string;
}

export function parseLabsCsv(text: string): { entries: ParsedLabRow[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const errors: string[] = [];
  const entries: ParsedLabRow[] = [];

  if (lines.length < 2) {
    return { entries: [], errors: ['CSV must include a header row and at least one data row.'] };
  }

  const header = lines[0].toLowerCase();
  const hasMarkerId = header.includes('marker_id');
  const startIdx = hasMarkerId ? 1 : 0;

  if (!hasMarkerId) {
    errors.push('Missing marker_id column — using template format recommended.');
  }

  const validIds = new Set(biomarkers.map((b) => b.id));

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    const parts = line.match(/("([^"]*)"|[^,]+)/g)?.map((p) => p.replace(/^"|"$/g, '').trim()) ?? [];
    if (parts.length < 3) {
      errors.push(`Line ${i + 1}: not enough columns`);
      continue;
    }

    let date: string;
    let markerId: string;
    let value: number;

    if (hasMarkerId) {
      [date, markerId] = [parts[0], parts[1]];
      value = parseFloat(parts[3] ?? parts[2]);
    } else {
      markerId = parts[0];
      value = parseFloat(parts[2] ?? parts[1]);
      date = parts[3] ?? new Date().toISOString().slice(0, 10);
    }

    if (!validIds.has(markerId)) {
      errors.push(`Line ${i + 1}: unknown marker "${markerId}"`);
      continue;
    }
    if (isNaN(value)) {
      errors.push(`Line ${i + 1}: invalid value`);
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Line ${i + 1}: date must be YYYY-MM-DD`);
      continue;
    }

    entries.push({ markerId, value, date });
  }

  return { entries, errors };
}

export function getLatestByMarker(entries: LabEntry[]): Map<string, LabEntry> {
  const map = new Map<string, LabEntry>();
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  for (const e of sorted) {
    if (!map.has(e.markerId)) map.set(e.markerId, e);
  }
  return map;
}

export function getMarkerTrend(
  entries: LabEntry[],
  markerId: string,
): 'improving' | 'declining' | 'stable' | 'unknown' {
  const sorted = entries
    .filter((e) => e.markerId === markerId)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) return 'unknown';
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  if (latest.value === previous.value) return 'stable';
  const direction = latest.value > previous.value ? 'up' : 'down';
  return isTrendGood(markerId, direction) ? 'improving' : 'declining';
}