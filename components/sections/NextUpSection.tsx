'use client';

import { NextUpPanel } from '@/components/os/NextUpPanel';

export function NextUpSection() {
  return (
    <section className="py-16 md:py-24 border-b border-border bg-[#0a0f1a]/40">
      <div className="container-page">
        <NextUpPanel defaultFilter="planned" showFilters />
      </div>
    </section>
  );
}