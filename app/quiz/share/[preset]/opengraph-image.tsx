import { OgImage } from '@/lib/og-image';
import { PRESET_KEYS, PRESET_OG_ACCENTS } from '@/lib/quiz-share';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { isPresetKey } from '@/lib/stack-url';

export const alt = 'TNiC Quiz Result';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return PRESET_KEYS.map((preset) => ({ preset }));
}

export default async function Image({ params }: { params: Promise<{ preset: string }> }) {
  const { preset } = await params;

  if (!isPresetKey(preset)) {
    return OgImage({ title: 'Quiz Result', accent: '#34d399' });
  }

  const stack = stackPresets[preset as PresetKey];
  const compoundCount = stack.ids.length;

  return OgImage({
    title: `${stack.label} Stack`,
    subtitle: `TNiC quiz result · ${compoundCount} evidence-graded compounds · Tier A/B protocol`,
    accent: PRESET_OG_ACCENTS[preset as PresetKey],
  });
}