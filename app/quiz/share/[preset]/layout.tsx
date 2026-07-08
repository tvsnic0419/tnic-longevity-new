import type { Metadata } from 'next';
import { buildQuizOgImageUrl, PRESET_KEYS } from '@/lib/quiz-share';
import { stackPresets } from '@/lib/presets';
import { SITE } from '@/lib/site';
import { isPresetKey } from '@/lib/stack-url';

export function generateStaticParams() {
  return PRESET_KEYS.map((preset) => ({ preset }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ preset: string }>;
}): Promise<Metadata> {
  const { preset } = await params;
  if (!isPresetKey(preset)) return { title: 'Not Found' };

  const stack = stackPresets[preset];
  const path = `/quiz/share/${preset}`;
  const title = `${stack.label} Stack — TNiC Quiz Result`;
  const description = `${stack.desc}. Evidence-graded ${stack.ids.length}-compound protocol from the TNiC 3-min starter quiz.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE.url}${path}`,
      images: [{ url: buildQuizOgImageUrl(preset), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildQuizOgImageUrl(preset)],
    },
  };
}

export default function QuizShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}