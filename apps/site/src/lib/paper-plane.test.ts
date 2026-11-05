import { describe, expect, it } from 'vitest';
import { duration, endFrame, frame, type Params } from './paper-plane';

const base: Params = {
  flightTime: 4.2,
  wander: 1,
  trail: true,
  box: { w: 1100, h: 700 },
  status: { x: 550, y: 420 },
  letter: { x: 550, y: 300 },
  button: { x: 520, y: 560 },
};

const times = (p: Params) => {
  const out: number[] = [];
  for (let t = 0; t <= duration(p) + 0.5; t += 0.05) out.push(t);
  return out;
};

describe('paper plane timeline', () => {
  it('starts as the draft with SEND', () => {
    const f = frame(0, base);
    expect(f.label).toBe('send');
    expect(f.collapsed).toBe(false);
    expect(f.note).toBe(false);
    expect(f.plane.visible).toBe(false);
  });
  it('collapses and says Sending after the click', () => {
    const f = frame(1.6, base);
    expect(f.label).toBe('sending');
    expect(f.collapsed).toBe(true);
    expect(f.status).toBe(true);
  });
  it('ends with Sent and the note', () => {
    const f = frame(duration(base), base);
    expect(f.label).toBe('sent');
    expect(f.note).toBe(true);
    expect(f.done).toBe(true);
    expect(f.plane.visible).toBe(false);
    expect(endFrame(base)).toEqual(f);
  });
  it('fold progress never goes backwards', () => {
    let last = 0;
    for (const t of times(base)) {
      const { fold } = frame(t, base);
      expect(fold).toBeGreaterThanOrEqual(last - 1e-9);
      last = fold;
    }
    expect(last).toBe(1);
  });
  it('keeps the plane inside the overlay bounds (with a small margin)', () => {
    for (const wander of [0, 1, 2]) {
      const p = { ...base, wander };
      for (const t of times(p)) {
        const { plane } = frame(t, p);
        if (!plane.visible) continue;
        expect(plane.x).toBeGreaterThanOrEqual(-40);
        expect(plane.x).toBeLessThanOrEqual(p.box.w + 40);
        expect(plane.y).toBeGreaterThanOrEqual(-40);
        expect(plane.y).toBeLessThanOrEqual(p.box.h + 40);
      }
    }
  });
  it('draws a trail only when asked', () => {
    const mid = 5.5;
    expect(frame(mid, base).trail.length).toBeGreaterThan(2);
    expect(frame(mid, { ...base, trail: false }).trail).toHaveLength(0);
  });
  it('longer flight time lasts longer', () => {
    expect(duration({ flightTime: 6 })).toBeGreaterThan(duration({ flightTime: 3 }));
  });
});
