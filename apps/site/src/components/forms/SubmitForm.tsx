'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCallback, useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';

export type SubmitFormText = {
  emailLabel: string;
  detailsLabel?: string;
  consentLabel: string;
  /** Word inside consentLabel that links to /privacy (optional). */
  consentLinkText?: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  rateLimited: string;
  invalidEmail: string;
  consentRequired: string;
};

const MiniPlane = dynamic(() => import('./MiniPlane'), { ssr: false });

type Props = { endpoint: string; text: SubmitFormText };

type Status = 'idle' | 'sending' | 'success' | 'error' | 'rate';

/** Email + consent (+ optional details) form with a hidden honeypot. No tracking. */
export function SubmitForm({ endpoint, text }: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [flyFrom, setFlyFrom] = useState<{ x: number; y: number } | null>(null);
  const [landed, setLanded] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const onLanded = useCallback(() => {
    setFlyFrom(null);
    setLanded(true);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    const consent = data.get('consent') === 'on';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailError(emailOk ? '' : text.invalidEmail);
    setConsentError(consent ? '' : text.consentRequired);
    if (!emailOk || !consent) {
      setStatus('idle');
      (
        form.querySelector(emailOk ? '[name=consent]' : '[name=email]') as HTMLElement | null
      )?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          company: String(data.get('company') ?? ''),
          details: String(data.get('details') ?? ''),
        }),
      });
      setStatus(res.ok ? 'success' : res.status === 429 ? 'rate' : 'error');
      if (res.ok) {
        form.reset();
        const btn = form.querySelector<HTMLElement>('.form-submit');
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (btn && !calm) {
          const a = form.getBoundingClientRect();
          const b = btn.getBoundingClientRect();
          setLanded(false);
          setFlyFrom({ x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 });
        }
      }
    } catch {
      setStatus('error');
    }
  }

  const emailId = `${id}-email`;
  const consentId = `${id}-consent`;
  const [before, after] = text.consentLinkText
    ? text.consentLabel.split(text.consentLinkText)
    : [text.consentLabel, ''];

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor={emailId} className="field-label">
          {text.emailLabel}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          className="input"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${emailId}-err` : undefined}
        />
        {emailError ? (
          <p id={`${emailId}-err`} className="field-error">
            {emailError}
          </p>
        ) : null}
      </div>

      {text.detailsLabel ? (
        <div className="field">
          <label htmlFor={`${id}-details`} className="field-label">
            {text.detailsLabel}
          </label>
          <textarea
            id={`${id}-details`}
            name="details"
            rows={3}
            maxLength={1000}
            className="input"
          />
        </div>
      ) : null}

      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="field">
        <div className="check">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            required
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? `${consentId}-err` : undefined}
          />
          <label htmlFor={consentId}>
            {before}
            {text.consentLinkText ? (
              <Link href="/privacy" className="footer-link">
                {text.consentLinkText}
              </Link>
            ) : null}
            {after}
          </label>
        </div>
        {consentError ? (
          <p id={`${consentId}-err`} className="field-error">
            {consentError}
          </p>
        ) : null}
      </div>

      <Button type="submit" loading={status === 'sending'} className="form-submit">
        {status === 'sending'
          ? text.sending
          : status === 'success' && !landed
            ? text.sending
            : text.submit}
      </Button>

      {flyFrom ? <MiniPlane origin={flyFrom} onDone={onLanded} /> : null}
      <p className="form-status" role="status" aria-live="polite" data-kind={status}>
        {status === 'success' && landed ? text.success : null}
        {status === 'error' ? text.error : null}
        {status === 'rate' ? text.rateLimited : null}
      </p>
    </form>
  );
}
