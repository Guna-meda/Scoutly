export type Consent = 'granted' | 'denied' | 'unset';

const KEY = 'scoutly-consent';

/** Reads the stored choice. Any storage failure means "unset": nothing optional loads. */
export function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : 'unset';
  } catch {
    return 'unset';
  }
}

/** Returns false when the browser blocks storage. */
export function writeConsent(value: Exclude<Consent, 'unset'>): boolean {
  try {
    window.localStorage.setItem(KEY, value);
    window.dispatchEvent(new Event('scoutly-consent'));
    return true;
  } catch {
    return false;
  }
}
