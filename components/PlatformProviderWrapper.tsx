'use client';

import { MotionConfig } from 'framer-motion';
import { PlatformProvider } from '@/context/PlatformContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { OsOverlays } from '@/components/os/OsOverlays';
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
          <OsOverlays />
          {children}
        </PlatformProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
