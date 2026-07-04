'use client';

import { MotionConfig } from 'framer-motion';
import { PlatformProvider } from '@/context/PlatformContext';
import { PrivacyConsentBanner } from '@/components/PrivacyConsentBanner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CommandPalette } from '@/components/os/CommandPalette';
import { ExportKitModal } from '@/components/os/ExportKitModal';
import { OnboardingModal } from '@/components/os/OnboardingModal';
import type { ReactNode } from 'react';

export function PlatformProviderWrapper({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" makes every Framer Motion animation in the tree
    // honor the OS "reduce motion" setting (WCAG 2.3.3 / vestibular safety).
    // Framer drops transform/layout animations for these users while keeping
    // opacity, so entrance fades stay gentle instead of sliding/scaling.
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <PlatformProvider>
          <CommandPalette />
          <ExportKitModal />
          <OnboardingModal />
          {children}
          <PrivacyConsentBanner />
        </PlatformProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
