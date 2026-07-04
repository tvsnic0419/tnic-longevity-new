'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

export function PrivacyConsentBanner() {
  const { privacyConsent, acceptPrivacyConsent } = usePlatform();
  const [dismissed, setDismissed] = useState(false);

  if (privacyConsent || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="privacy-banner-title"
      className="fixed bottom-0 inset-x-0 z-50 px-4 py-2.5"
      style={{ background: 'rgba(5,12,24,0.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(52,211,153,0.2)' }}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
        <Shield className="w-4 h-4 text-accent-emerald shrink-0" aria-hidden="true" />
        <p id="privacy-banner-title" className="text-xs text-muted-foreground flex-1 min-w-0">
          <span className="font-semibold text-foreground">Your health data stays local</span>
          {' — '}never on TNiC servers.{' '}
          <Link href="/labs" className="text-accent-cyan hover:text-accent-emerald underline-offset-2 hover:underline">
            Privacy panel
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={acceptPrivacyConsent}
            className="focus-ring px-3 py-1 rounded-md bg-accent-emerald/20 text-accent-emerald text-xs font-semibold border border-accent-emerald/30 hover:bg-accent-emerald/30 transition-colors"
          >
            Got it
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="focus-ring px-3 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}