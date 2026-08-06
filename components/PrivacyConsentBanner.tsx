'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

const DISMISS_KEY = 'tnic-privacy-banner-dismissed';

export function PrivacyConsentBanner() {
  const { privacyConsent, acceptPrivacyConsent } = usePlatform();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Client-only: sessionStorage is unavailable during SSR, so the dismissed
    // flag can only be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1');
  }, []);

  const dismissForSession = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  if (privacyConsent || dismissed) return null;

  return (
    <div
      role="region"
      aria-labelledby="privacy-banner-title"
      aria-describedby="privacy-banner-desc"
      aria-live="polite"
      className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6"
    >
      <div className="container-page max-w-3xl mx-auto glass border border-accent-emerald/20 rounded-xl p-4 md:p-5 shadow-2xl">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p id="privacy-banner-title" className="text-sm font-semibold text-foreground mb-1">
              Local-only health data
            </p>
            <p id="privacy-banner-desc" className="text-xs text-muted-foreground leading-relaxed">
              Labs, stacks, and notes stay in your browser — never on TNiC servers. You control export and deletion.{' '}
              <Link href="/labs" className="text-accent-cyan hover:text-accent-emerald">
                Privacy panel
              </Link>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={acceptPrivacyConsent}
                className="focus-ring interactive px-4 py-2 rounded-lg bg-accent-emerald/20 text-accent-emerald text-xs font-semibold border border-accent-emerald/30"
              >
                Got it
              </button>
              <button
                onClick={dismissForSession}
                className="focus-ring interactive px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground/90"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
