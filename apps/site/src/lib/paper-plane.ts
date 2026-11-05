/**
 * Paper Plane Send: one deterministic timeline. `frame(t, params)` returns everything the renderer
 * needs at time t (seconds). Pure and scrubbable; reduced motion renders `frame(duration(p), p)`.
 * Motion studied from the owner's reference recording (docs/prompts-reference/paper-plane-send.mp4).
 */
export type Pt = { x: number; y: number };

export type Params = {
  /** Flight Time control from the reference, default 4.2 (flight lasts about 0.85 x this). */
  flightTime: number;
  /** Loop amplitude multiplier, default 1. */
  wander: number;
  trail: boolean;
  /** Overlay box in px. */
  box: { w: number; h: number };
  /** Where the status bar sits (letter rises from here). */
  status: Pt;
  /** Centre of the letter at full size. */
  letter: Pt;
  /** Centre of the SEND button. */
  button: Pt;
};

export type Label = 'send' | 'sending' | 'sent';

export type FrameState = {
  label: Label;
  /** Draft collapsed into the status bar. */
  collapsed: boolean;
  status: boolean;
  note: boolean;
  done: boolean;
  pointer: { x: number; y: number; visible: boolean; pressed: boolean };
  letter: { visible: boolean; x: number; y: number; scale: number; opacity: number };
  /** 0 flat sheet, 1 finished plane. */
  fold: number;
  plane: { visible: boolean; x: number; y: number; rot: number; scale: number };
  trail: Pt[];
};

export const LETTER = { w: 150, h: 190 };

const T = {
  pointerEnd: 1.0,
  click: 1.0,
  collapse: 0.4,
  riseStart: 1.5,
  riseEnd: 2.8,
  foldStart: 2.8,
  foldEnd: 4.1,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => 1 - Math.pow(1 - clamp01(k), 3);
const easeInOut = (k: number) => {
  const c = clamp01(k);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export function flightSeconds(p: Pick<Params, 'flightTime'>): number {
  return p.flightTime * 0.85;
}

const DIVE = 0.45;

export function duration(p: Pick<Params, 'flightTime'>): number {
  return T.foldEnd + flightSeconds(p) + DIVE + 0.5 + 0.9;
}

/** Waypoints (px) of the flight, read off the recording and normalised to the overlay box. */
export function waypoints(p: Params): Pt[] {
  const { w, h } = p.box;
  const a = p.wander;
  const at = (nx: number, ny: number): Pt => ({ x: nx * w, y: ny * h });
  const lc = at(0.14, 0.58);
  // The loop-the-loop on the left grows and shrinks with Wander.
  const loop = (nx: number, ny: number): Pt => ({
    x: lc.x + (nx * w - lc.x) * a,
    y: lc.y + (ny * h - lc.y) * a,
  });
  const b = p.button;
  return [
    p.letter,
    at(0.47, 0.08),
    at(0.78, 0.1),
    at(0.94, 0.3),
    at(0.8, 0.5),
    at(0.45, 0.56),
    lc,
    loop(0.05, 0.46),
    loop(0.09, 0.28),
    loop(0.2, 0.26),
    at(0.3, 0.36),
    { x: lerp(p.letter.x, b.x, 0.5) - 20, y: lerp(0.3 * h, b.y, 0.55) },
    { x: b.x - 18, y: b.y - 46 },
    { x: b.x + 14, y: b.y - 22 },
    { x: b.x, y: b.y },
  ];
}

export function spline(pts: Pt[], u: number): Pt {
  const n = pts.length - 1;
  const s = clamp01(u) * n;
  const i = Math.min(n - 1, Math.floor(s));
  const k = s - i;
  const p0 = pts[Math.max(0, i - 1)] as Pt;
  const p1 = pts[i] as Pt;
  const p2 = pts[i + 1] as Pt;
  const p3 = pts[Math.min(n, i + 2)] as Pt;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c) * k +
      (2 * a - 5 * b + 4 * c - d) * k * k +
      (-a + 3 * b - 3 * c + d) * k * k * k);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
}

const MARGIN = 40;
function inside(pt: Pt, box: Params['box']): Pt {
  return {
    x: Math.min(box.w + MARGIN, Math.max(-MARGIN, pt.x)),
    y: Math.min(box.h + MARGIN, Math.max(-MARGIN, pt.y)),
  };
}

export function frame(t: number, p: Params): FrameState {
  const end = duration(p);
  const flightStart = T.foldEnd;
  const flightEnd = flightStart + flightSeconds(p);
  const diveEnd = flightEnd + DIVE;
  const sentAt = diveEnd;
  const noteAt = sentAt + 0.5;

  const state: FrameState = {
    label: 'send',
    collapsed: false,
    status: false,
    note: false,
    done: t >= end,
    pointer: { x: p.button.x, y: p.button.y, visible: false, pressed: false },
    letter: { visible: false, x: p.letter.x, y: p.letter.y, scale: 1, opacity: 1 },
    fold: 0,
    plane: { visible: false, x: p.letter.x, y: p.letter.y, rot: -90, scale: 1 },
    trail: [],
  };

  // Pointer glides to SEND, presses at the click.
  if (t < T.click + 0.3) {
    const k = ease(t / T.pointerEnd);
    state.pointer = {
      x: lerp(p.button.x + 90, p.button.x + 8, k),
      y: lerp(p.button.y + 110, p.button.y + 6, k),
      visible: true,
      pressed: t >= T.click && t < T.click + 0.15,
    };
  }

  if (t >= T.click) {
    state.label = 'sending';
    state.collapsed = true;
    state.status = true;
  }

  // Letter rises out of the status bar and grows to a sheet, then folds.
  if (t >= T.riseStart && t < flightStart + 0.01) {
    const k = easeInOut((t - T.riseStart) / (T.riseEnd - T.riseStart));
    state.letter = {
      visible: true,
      x: p.letter.x,
      y: lerp(p.status.y, p.letter.y, k),
      scale: lerp(0.35, 1, k),
      opacity: clamp01((t - T.riseStart) / 0.25),
    };
  }
  if (t >= T.foldStart) state.fold = easeInOut((t - T.foldStart) / (T.foldEnd - T.foldStart));
  if (t >= T.foldEnd) state.fold = 1;

  // Flight along the path, then a small dive into the button.
  if (t >= flightStart && t < diveEnd) {
    const pts = waypoints(p);
    const u = easeInOut(clamp01((t - flightStart) / flightSeconds(p)) * 0.999 + 0.0005);
    const uClamped = t >= flightEnd ? 1 : clamp01(u);
    const pos = inside(spline(pts, uClamped), p.box);
    const ahead = inside(spline(pts, Math.min(1, uClamped + 0.004)), p.box);
    const rot = (Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * 180) / Math.PI;
    const diveK = clamp01((t - flightEnd) / DIVE);
    state.letter.visible = false;
    state.plane = {
      visible: true,
      x: pos.x,
      y: pos.y,
      rot: uClamped >= 1 || ahead.x === pos.x ? rot || 0 : rot,
      scale: lerp(1, 0.05, ease(diveK)),
    };
    if (p.trail) {
      const n = 36;
      const span = 0.24;
      for (let i = 0; i <= n; i += 1) {
        const uu = Math.max(0, uClamped - (span * (n - i)) / n);
        state.trail.push(inside(spline(pts, uu), p.box));
      }
    }
  }
  if (t >= flightStart && t < flightStart + 0.01) state.letter.visible = false;

  if (t >= sentAt) {
    state.label = 'sent';
    state.collapsed = false;
    state.status = false;
  }
  if (t >= noteAt) state.note = true;
  if (t >= end) {
    state.done = true;
    state.plane.visible = false;
    state.letter.visible = false;
    state.trail = [];
  }
  return state;
}

/** The finished state shown by reduced motion and the stacked layout. */
export function endFrame(p: Params): FrameState {
  return frame(duration(p), p);
}

/** Mini variant for the waitlist button: a short curved hop up and to the right, with a short trail. */
export const MINI_SECONDS = 1.4;
export function miniFlight(
  t: number,
  from: Pt,
  size = 220,
): { pos: Pt; rot: number; scale: number; trail: Pt[] } {
  const pts: Pt[] = [
    from,
    { x: from.x + size * 0.12, y: from.y - size * 0.25 },
    { x: from.x + size * 0.4, y: from.y - size * 0.42 },
    { x: from.x + size * 0.75, y: from.y - size * 0.4 },
    { x: from.x + size * 1.1, y: from.y - size * 0.7 },
  ];
  const u = easeInOut(clamp01(t / MINI_SECONDS));
  const pos = spline(pts, u);
  const ahead = spline(pts, Math.min(1, u + 0.01));
  const rot = (Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * 180) / Math.PI;
  const trail: Pt[] = [];
  for (let i = 0; i <= 16; i += 1) trail.push(spline(pts, Math.max(0, u - (0.3 * (16 - i)) / 16)));
  return { pos, rot, scale: u > 0.85 ? 1 - (u - 0.85) / 0.15 : Math.min(1, u * 6), trail };
}
