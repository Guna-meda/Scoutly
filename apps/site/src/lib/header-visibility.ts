export interface HeaderState {
  /** Scroll position the last direction decision was made from. */
  lastY: number;
  hidden: boolean;
}

export interface HeaderInput {
  y: number;
  headerHeight: number;
  focusInside: boolean;
  menuOpen: boolean;
  reducedMotion: boolean;
  /** Ignore scroll deltas smaller than this (px). */
  deadZone?: number;
}

/**
 * Pure decision function for the sticky header.
 * Visible when: reduced motion, focus inside, menu open, near the top, or scrolling up.
 * Hidden when scrolling down past the header height.
 */
export function stepHeader(state: HeaderState, input: HeaderInput): HeaderState {
  const { y: rawY, headerHeight, focusInside, menuOpen, reducedMotion, deadZone = 8 } = input;
  const y = Math.max(0, rawY); // iOS rubber-band overscroll reports negative values
  if (reducedMotion || focusInside || menuOpen || y <= headerHeight) {
    return { lastY: y, hidden: false };
  }
  const delta = y - state.lastY;
  if (Math.abs(delta) < deadZone) return state;
  return { lastY: y, hidden: delta > 0 };
}
