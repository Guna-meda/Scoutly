import { beforeEach, describe, expect, it } from 'vitest';
import { handleSubmit } from './submit-handler';
import { setStoreForTests, type SignupRecord } from './waitlist-store';

let saved: SignupRecord[] = [];
beforeEach(() => {
  saved = [];
  setStoreForTests({ add: async (r) => void saved.push(r) });
});

let n = 0;
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/waitlist', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'localhost',
      'x-forwarded-for': `10.0.0.${++n}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });

describe('waitlist handler', () => {
  it('stores a valid signup', async () => {
    const r = await handleSubmit(req({ email: 'A@b.co', consent: true, company: '' }), 'waitlist');
    expect(r.status).toBe(200);
    expect(saved[0]?.email).toBe('a@b.co');
  });
  it('requires consent', async () => {
    const r = await handleSubmit(req({ email: 'a@b.co', consent: false }), 'waitlist');
    expect(r.status).toBe(400);
    expect(saved).toHaveLength(0);
  });
  it('honeypot returns success but stores nothing', async () => {
    const r = await handleSubmit(req({ email: 'a@b.co', consent: true, company: 'x' }), 'waitlist');
    expect(r.status).toBe(200);
    expect(saved).toHaveLength(0);
  });
  it('rejects wrong content type and cross-origin', async () => {
    const wrongType = req({}, { 'content-type': 'text/plain' });
    expect((await handleSubmit(wrongType, 'waitlist')).status).toBe(415);
    const cross = req({}, { origin: 'https://other.example' });
    expect((await handleSubmit(cross, 'waitlist')).status).toBe(403);
  });
  it('rate limits the same email', async () => {
    const codes: number[] = [];
    for (let i = 0; i < 5; i++)
      codes.push(
        (await handleSubmit(req({ email: 'same@b.co', consent: true }), 'waitlist')).status,
      );
    expect(codes).toContain(429);
  });
});
