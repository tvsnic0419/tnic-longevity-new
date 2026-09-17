'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/unified';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

let amplitudeInitialized = false;

export function AmplitudeInit() {
  useEffect(() => {
    if (amplitudeInitialized) return;

    if (!AMPLITUDE_API_KEY) {
      console.warn('Amplitude API key missing — analytics disabled');
      return;
    }

    amplitude.initAll(AMPLITUDE_API_KEY, {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 1 },
    });
    amplitudeInitialized = true;

    amplitude.track('Viewed Home Page', { prompt_version: 'BA400.4' }); // helps improve this setup flow — safe to remove once you've verified the event lands
  }, []);

  return null;
}
