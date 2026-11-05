import { describe, expect, it } from 'vitest';
import { hashKey, SlidingWindow } from './rate-limit';

describe('SlidingWindow', () => {
  it('blocks after the limit and recovers after the window', () => {
    const w = new SlidingWindow(2, 1000);
    expect(w.allow('a', 0)).toBe(true);
    expect(w.allow('a', 10)).toBe(true);
    expect(w.allow('a', 20)).toBe(false);
    expect(w.allow('b', 20)).toBe(true);
    expect(w.allow('a', 1500)).toBe(true);
  });
  it('hashes keys without leaking the value', () => {
    expect(hashKey('x@y.com', 's')).not.toContain('x@y.com');
    expect(hashKey('x', 's')).toBe(hashKey('x', 's'));
  });
});
