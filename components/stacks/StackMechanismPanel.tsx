'use client';

import { TrendingDown } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

export function StackMechanismPanel() {
  const { selected, defenseProfile, profile } = usePlatform();

  if (selected.length === 0) return null;

  const yearsShown = profile.scanned ? Math.abs(defenseProfile.ageDelta) : 0;

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
        <p className="text-label">Modeled bio-age impact</p>
      </div>
      <p className="text-3xl font-bold font-mono text-accent-emerald">
        {yearsShown > 0 ? `−${yearsShown}` : '0'}<span className="text-base text-muted-foreground ml-1">yrs</span>
      </p>
      <p className="text-caption mt-1">
        {profile.scanned
          ? 'applied to your defense scan'
          : 'run a defense scan to apply this to your profile'}
      </p>
    </div>
  );
}
