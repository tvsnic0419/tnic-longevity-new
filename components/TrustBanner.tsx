'use client';

import { Shield, BookOpen, AlertCircle } from 'lucide-react';

export function TrustBanner() {
  return (
    <div className="bg-accent-emerald/5 border-y border-accent-emerald/10">
      <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-caption">
        <span className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-accent-emerald" />
          Evidence-graded · PubMed-cited
        </span>
        <span className="hidden sm:block text-muted-foreground/40">|</span>
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-accent-cyan" />
          <a href="/trust/methodology" className="focus-ring hover:text-accent-cyan transition-colors rounded">Transparent methodology</a>
        </span>
        <span className="hidden sm:block text-muted-foreground/40">|</span>
        <span className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-accent-amber" />
          <a href="/trust" className="focus-ring hover:text-accent-amber transition-colors rounded">Safety data for every compound</a>
        </span>
      </div>
    </div>
  );
}