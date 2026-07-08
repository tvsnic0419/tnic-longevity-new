'use client';

import { useSearchParams } from 'next/navigation';
import { LearnCenter } from '@/components/sections/LearnCenter';

const validTabs = ['start', 'glossary', 'outcomes', 'redflags', 'faq'] as const;
type TabId = (typeof validTabs)[number];

function parseTab(raw: string | null): TabId | undefined {
  if (!raw) return undefined;
  return validTabs.includes(raw as TabId) ? (raw as TabId) : undefined;
}

export function LearnPageClient() {
  const searchParams = useSearchParams();
  const defaultTab = parseTab(searchParams.get('tab'));

  return <LearnCenter defaultTab={defaultTab} />;
}