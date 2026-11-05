import { describe, expect, it } from 'vitest';
import { beatForOffset, clampBeat, decideMode, fill } from './stage-mode';

describe('decideMode', () => {
  it('is stacked under reduced motion at any size', () => {
    expect(decideMode({ reduceMotion: true, width: 1440, height: 900 })).toBe('stacked');
    expect(decideMode({ reduceMotion: true, width: 375, height: 800 })).toBe('stacked');
  });
  it('pins on desktop only when tall enough', () => {
    expect(decideMode({ reduceMotion: false, width: 1280, height: 800 })).toBe('desktop');
    expect(decideMode({ reduceMotion: false, width: 1280, height: 699 })).toBe('stacked');
  });
  it('pins on phone only when the device and card fit', () => {
    expect(decideMode({ reduceMotion: false, width: 390, height: 800 })).toBe('phone');
    expect(decideMode({ reduceMotion: false, width: 390, height: 640 })).toBe('stacked');
  });
});

describe('beat logic', () => {
  it('clamps to 0..2', () => {
    expect(clampBeat(-3)).toBe(0);
    expect(clampBeat(1.4)).toBe(1);
    expect(clampBeat(9)).toBe(2);
    expect(clampBeat(Number.NaN)).toBe(0);
  });
  it('maps scroll offset to the beat', () => {
    expect(beatForOffset(0, 100)).toBe(0);
    expect(beatForOffset(49, 100)).toBe(0);
    expect(beatForOffset(50, 100)).toBe(1);
    expect(beatForOffset(149, 100)).toBe(1);
    expect(beatForOffset(150, 100)).toBe(2);
    expect(beatForOffset(500, 100)).toBe(2);
  });
  it('fills templates', () => {
    expect(fill('Step {n} of 3: {headline}', { n: 2, headline: 'Hi' })).toBe('Step 2 of 3: Hi');
  });
});
