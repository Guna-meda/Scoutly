'use client';

import { useState, useSyncExternalStore } from 'react';
import { cookies } from '@content/en';
import { readConsent, writeConsent, type Consent } from '@/lib/consent';
import { Button } from '../ui/Button';
import { Body } from '../ui/Text';

function subscribe(cb: () => void) {
  window.addEventListener('scoutly-consent', cb);
  return () => window.removeEventListener('scoutly-consent', cb);
}

/** Shows the current analytics choice and lets the visitor change it. Stored in localStorage only. */
export function CookiePrefs() {
  const consent = useSyncExternalStore<Consent>(subscribe, readConsent, () => 'unset');
  const [note, setNote] = useState('');

  function choose(v: 'granted' | 'denied') {
    const ok = writeConsent(v);
    setNote(ok ? cookies.saved : cookies.unavailable);
  }

  return (
    <div className="cookie-prefs">
      <Body as="p">
        <strong>{cookies.stateLabel}</strong> {cookies.states[consent]}
      </Body>
      <div className="cookie-actions">
        <Button type="button" onClick={() => choose('granted')}>
          {cookies.accept}
        </Button>
        <Button type="button" variant="secondary" onClick={() => choose('denied')}>
          {cookies.decline}
        </Button>
      </div>
      <p className="form-status" role="status" aria-live="polite">
        {note}
      </p>
      <Body as="p">{cookies.storageNote}</Body>
    </div>
  );
}
