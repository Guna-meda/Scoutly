'use client';

import { useEffect } from 'react';
import { readConsent } from '@/lib/consent';

/**
 * Consent-aware analytics wrapper. No provider is installed, so this loads nothing.
 * To add one later: when readConsent() is "granted" and a provider is configured, load its script
 * here (deferred), and nowhere else.
 */
export function ConsentAnalytics() {
  useEffect(() => {
    const check = () => {
      if (readConsent() !== 'granted') return;
      // Intentionally empty: no analytics provider is configured yet.
    };
    check();
    window.addEventListener('scoutly-consent', check);
    return () => window.removeEventListener('scoutly-consent', check);
  }, []);
  return null;
}
