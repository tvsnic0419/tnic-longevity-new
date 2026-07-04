'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { POPULAR_GUIDE_LINKS } from '@/lib/index-priority';

export function PopularGuidesStrip() {
  return (
    <div className="border-b border-border py-5 bg-background/80 backdrop-blur-sm">
      <div className="container-page">
        <div className="flex items-center gap-4 overflow-x-auto scroll-smooth pb-1 -mb-1 no-scrollbar">
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <TrendingUp className="w-3.5 h-3.5 text-accent-cyan" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
              Popular guides
            </span>
          </div>
          <div className="flex items-center gap-2 flex-nowrap">
            {POPULAR_GUIDE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-accent-cyan transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg border border-transparent hover:border-accent-cyan/20 hover:bg-accent-cyan/[0.04]"
              >
                {link.label}
                <ArrowRight className="w-3 h-3 opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
