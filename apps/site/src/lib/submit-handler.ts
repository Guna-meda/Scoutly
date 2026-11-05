import { z } from 'zod';
import { hashKey, SlidingWindow } from './rate-limit';
import { getStore, type SignupRecord } from './waitlist-store';

export const CONSENT_VERSION = '2026-11-v1';

const base = {
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
  /** Honeypot: must stay empty. */
  company: z.string().max(200).optional().default(''),
};
export const waitlistSchema = z.object(base);
export const deletionSchema = z.object({
  ...base,
  details: z.string().trim().max(1000).optional().default(''),
});

type Kind = SignupRecord['kind'];
const ipWindows: Record<Kind, SlidingWindow> = {
  waitlist: new SlidingWindow(8, 10 * 60_000),
  deletion: new SlidingWindow(8, 10 * 60_000),
};
const emailWindows: Record<Kind, SlidingWindow> = {
  waitlist: new SlidingWindow(3, 60 * 60_000),
  deletion: new SlidingWindow(3, 60 * 60_000),
};

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** Same-origin check: Origin (when sent) must match the Host. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // the JSON content-type requirement still blocks plain form posts
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

/** Shared handler for the waitlist and the deletion request. Logs no personal data. */
export async function handleSubmit(req: Request, kind: Kind): Promise<Response> {
  if (!sameOrigin(req)) return json({ ok: false, error: 'forbidden' }, 403);
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json'))
    return json({ ok: false, error: 'unsupported' }, 415);

  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0]?.trim() ?? 'unknown';
  if (!ipWindows[kind].allow(hashKey(ip))) return json({ ok: false, error: 'rate_limited' }, 429);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }
  const parsed = (kind === 'deletion' ? deletionSchema : waitlistSchema).safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: 'invalid' }, 400);
  const data = parsed.data as { email: string; company: string; details?: string };

  // Bots fill the honeypot: pretend it worked and store nothing.
  if (data.company !== '') return json({ ok: true }, 200);

  if (!emailWindows[kind].allow(hashKey(data.email)))
    return json({ ok: false, error: 'rate_limited' }, 429);

  try {
    await getStore().add({
      email: data.email,
      kind,
      consentVersion: CONSENT_VERSION,
      ...(data.details ? { details: data.details } : {}),
      at: new Date().toISOString(),
    });
  } catch {
    return json({ ok: false, error: 'server' }, 500);
  }
  // Generic success, also for duplicates: never reveal whether an email exists.
  return json({ ok: true }, 200);
}
