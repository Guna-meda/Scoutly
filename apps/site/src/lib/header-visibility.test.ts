import { describe, expect, it } from 'vitest';
import { stepHeader, type HeaderInput, type HeaderState } from './header-visibility';

const base: HeaderInput = {
  y: 0,
  headerHeight: 64,
  focusInside: false,
  menuOpen: false,
  reducedMotion: false,
};
const shown: HeaderState = { lastY: 0, hidden: false };

describe('stepHeader', () => {
  it('stays visible near the top', () => {
    expect(stepHeader(shown, { ...base, y: 40 }).hidden).toBe(false);
    expect(stepHeader({ lastY: 500, hidden: true }, { ...base, y: 30 }).hidden).toBe(false);
  });
  it('hides on scroll down past the header', () => {
    expect(stepHeader({ lastY: 100, hidden: false }, { ...base, y: 200 }).hidden).toBe(true);
  });
  it('returns on scroll up', () => {
    expect(stepHeader({ lastY: 400, hidden: true }, { ...base, y: 380 }).hidden).toBe(false);
  });
  it('ignores tiny movements (dead zone)', () => {
    const s: HeaderState = { lastY: 300, hidden: true };
    expect(stepHeader(s, { ...base, y: 304 })).toBe(s);
  });
  it('is always visible when focus is inside', () => {
    expect(
      stepHeader({ lastY: 100, hidden: true }, { ...base, y: 600, focusInside: true }).hidden,
    ).toBe(false);
  });
  it('is always visible while the menu is open', () => {
    expect(
      stepHeader({ lastY: 100, hidden: true }, { ...base, y: 600, menuOpen: true }).hidden,
    ).toBe(false);
  });
  it('never hides under reduced motion', () => {
    expect(
      stepHeader({ lastY: 100, hidden: false }, { ...base, y: 900, reducedMotion: true }).hidden,
    ).toBe(false);
  });
  it('treats negative (overscroll) positions as the top', () => {
    expect(stepHeader({ lastY: 100, hidden: true }, { ...base, y: -30 })).toEqual({
      lastY: 0,
      hidden: false,
    });
  });
});
