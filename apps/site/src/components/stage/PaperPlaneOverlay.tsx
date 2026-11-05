'use client';

import { useEffect, useRef } from 'react';
import { stage } from '@content/en';
import { duration, frame, LETTER, type FrameState, type Params, type Pt } from '@/lib/paper-plane';

export type SendPhase = 'idle' | 'sending' | 'sent';

type Props = {
  /** 0 = not playing. Each new value starts a run. */
  playKey: number;
  /** The sticky stage container the overlay fills. */
  container: HTMLElement | null;
  flightTime?: number;
  wander?: number;
  trail?: boolean;
  onPhase: (phase: SendPhase) => void;
  onDone: () => void;
};

const W = LETTER.w;
const H = LETTER.h;
const TRAIL_SEGMENTS = 36;
const SVG_NS = 'http://www.w3.org/2000/svg';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => {
  const c = Math.min(1, Math.max(0, k));
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
};
const pts = (a: Pt[]) => a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

/** Letter wrapped to the sheet width, from the sample email in content. */
function letterLines(): string[] {
  const y = stage.yours;
  const text = [y.greeting, ...y.paragraphs, y.signoff];
  const lines: string[] = [];
  for (const para of text) {
    let line = '';
    for (const word of para.split(' ')) {
      if ((line + ' ' + word).trim().length > 29) {
        lines.push(line);
        line = word;
      } else line = (line + ' ' + word).trim();
    }
    lines.push(line, '');
  }
  return lines.slice(0, 22);
}

/** Corner-fold geometry for fold progress f (0 sheet ... 1 plane), in sheet-local coordinates. */
function shapes(f: number) {
  const cl =
    f < 0.25 ? (W / 2) * 0.9 * ease(f / 0.25) : lerp((W / 2) * 0.9, W / 2, ease((f - 0.25) / 0.3));
  const cr = f < 0.2 ? 0 : (W / 2) * ease((f - 0.2) / 0.35);
  const x0 = -W / 2;
  const y0 = -H / 2;
  let body: Pt[] = [
    { x: x0 + cl, y: y0 },
    { x: W / 2 - cr, y: y0 },
    { x: W / 2, y: y0 + cr },
    { x: W / 2, y: H / 2 },
    { x: x0, y: H / 2 },
    { x: x0, y: y0 + cl },
  ];
  // Flaps are the folded-over corners, reflected across the crease.
  let flapL: Pt[] = [
    { x: x0 + cl, y: y0 },
    { x: x0, y: y0 + cl },
    { x: x0 + cl, y: y0 + cl },
  ];
  let flapR: Pt[] = [
    { x: W / 2 - cr, y: y0 },
    { x: W / 2, y: y0 + cr },
    { x: W / 2 - cr, y: y0 + cr },
  ];
  // Narrow into a dart, then spread into the plane's wide shape.
  const narrow = ease((f - 0.55) / 0.25);
  const spread = ease((f - 0.8) / 0.2);
  const sx = lerp(1, 0.36, narrow) + lerp(0, 0.5, spread);
  const sy = lerp(1, 0.95, narrow) - lerp(0, 0.4, spread);
  const taper = lerp(0, 0.65, narrow) - lerp(0, 0.35, spread);
  const map = (p: Pt): Pt => {
    const yn = (p.y - y0) / H;
    return { x: p.x * sx * (1 - taper * Math.max(0, yn)), y: p.y * sy };
  };
  body = body.map(map);
  flapL = flapL.map(map);
  flapR = flapR.map(map);
  const peak = map({ x: 0, y: y0 });
  const base = map({ x: 0, y: H / 2 });
  const rightHalf = body.filter((p) => p.x >= 0);
  const shade = [peak, ...rightHalf.filter((p) => p.y > peak.y), base];
  return { body, flapL, flapR, shade, peak, base };
}

function el<K extends keyof SVGElementTagNameMap>(
  parent: Element,
  tag: K,
  cls?: string,
  attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag);
  if (cls) e.setAttribute('class', cls);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

/** Collects the geometry the timeline needs from the live DOM. */
function measure(container: HTMLElement): Params | null {
  const box = container.getBoundingClientRect();
  const dev = [...container.querySelectorAll<HTMLElement>('.device')].find(
    (d) => d.getBoundingClientRect().width > 0,
  );
  const screen = dev?.querySelector<HTMLElement>('.screen[data-screen="2"]');
  const send = screen?.querySelector<HTMLElement>('.qr-send');
  const status = screen?.querySelector<HTMLElement>('.send-status');
  if (!dev || !screen || !send || !status) return null;
  const d = dev.getBoundingClientRect();
  const b = send.getBoundingClientRect();
  const s = status.getBoundingClientRect();
  return {
    flightTime: 4.2,
    wander: 1,
    trail: true,
    box: { w: box.width, h: box.height },
    status: { x: s.left + s.width / 2 - box.left, y: s.top + s.height / 2 - box.top },
    letter: { x: d.left + d.width / 2 - box.left, y: d.top + d.height * 0.36 - box.top },
    button: { x: b.left + b.width / 2 - box.left, y: b.top + b.height / 2 - box.top },
  };
}

/**
 * Draws the paper letter, its fold, the plane, the trail and the pointer over the stage.
 * Decorative only (aria-hidden). Runs a requestAnimationFrame loop that feeds `frame(t)`.
 */
export default function PaperPlaneOverlay({
  playKey,
  container,
  flightTime = 4.2,
  wander = 1,
  trail = true,
  onPhase,
  onDone,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef({ onPhase, onDone });
  useEffect(() => {
    cb.current = { onPhase, onDone };
  });

  useEffect(() => {
    const root = host.current;
    if (!root || playKey === 0 || !container) return;
    const params = measure(container);
    if (!params) return;
    const p: Params = { ...params, flightTime, wander, trail };

    root.textContent = '';
    const svg = el(root, 'svg', 'pp-svg', {
      width: String(p.box.w),
      height: String(p.box.h),
      viewBox: `0 0 ${p.box.w} ${p.box.h}`,
    });
    const trailSegs = Array.from({ length: TRAIL_SEGMENTS }, () => el(svg, 'line', 'pp-trail'));
    const paper = el(svg, 'g');
    const clipId = `pp-clip-${playKey}`;
    const defs = el(paper, 'defs');
    const clip = el(defs, 'clipPath', undefined, { id: clipId });
    const clipPoly = el(clip, 'polygon');
    const sheet = el(paper, 'polygon', 'pp-sheet');
    const content = el(paper, 'g', undefined, { 'clip-path': `url(#${clipId})` });
    el(content, 'rect', 'pp-dash', {
      x: String(-W / 2 + 7),
      y: String(-H / 2 + 7),
      width: String(W - 14),
      height: String(H - 14),
    });
    const label = el(content, 'text', 'pp-micro', {
      x: String(-W / 2 + 12),
      y: String(-H / 2 + 17),
    });
    label.textContent = stage.send.sheetLabel;
    el(content, 'rect', 'pp-stamp', {
      x: String(W / 2 - 40),
      y: String(-H / 2 + 11),
      width: '28',
      height: '28',
    });
    el(content, 'path', 'pp-line', {
      d: `M${W / 2 - 33} ${-H / 2 + 28} L${W / 2 - 21} ${-H / 2 + 17} M${W / 2 - 28} ${-H / 2 + 17} H${W / 2 - 21} V${-H / 2 + 24}`,
    });
    const stamp = el(content, 'text', 'pp-micro', {
      x: String(W / 2 - 38),
      y: String(-H / 2 + 36),
    });
    stamp.textContent = stage.send.stamp;
    el(content, 'circle', 'pp-postmark', {
      cx: String(W / 2 - 52),
      cy: String(-H / 2 + 30),
      r: '10',
    });
    const textG = el(content, 'g');
    letterLines().forEach((line, i) => {
      const t = el(textG, 'text', 'pp-text', {
        x: String(-W / 2 + 14),
        y: String(-H / 2 + 62 + i * 8.2),
      });
      t.textContent = line;
    });
    const shade = el(paper, 'polygon', 'pp-shade');
    const crease = el(paper, 'line', 'pp-line');
    const flapL = el(paper, 'polygon', 'pp-flap');
    const flapR = el(paper, 'polygon', 'pp-flap');
    // The finished plane: two wings and a keel, drawn flat from above (nose up).
    const planeG = el(paper, 'g');
    el(planeG, 'polygon', 'pp-sheet', { points: '0,-95 -72,62 0,34' });
    el(planeG, 'polygon', 'pp-flap', { points: '0,-95 72,62 0,34' });
    el(planeG, 'line', 'pp-line', { x1: '0', y1: '-95', x2: '0', y2: '34' });
    const cursor = el(svg, 'path', 'pp-cursor', {
      d: 'M0 0 L0 16 L4.5 12 L7.5 19 L10 18 L7 11 L13 11 Z',
    });

    const apply = (s: FrameState) => {
      const f = s.fold;
      const sh = shapes(f);
      const showPaper = s.letter.visible || s.plane.visible;
      paper.setAttribute('visibility', showPaper ? 'visible' : 'hidden');
      if (showPaper) {
        const tr = s.plane.visible ? s.plane : null;
        const x = tr ? tr.x : s.letter.x;
        const y = tr ? tr.y : s.letter.y;
        const sc = tr ? tr.scale * 0.8 : s.letter.scale;
        const rot = tr ? tr.rot + 90 : 0;
        paper.setAttribute(
          'transform',
          `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc.toFixed(3)})`,
        );
        paper.setAttribute('opacity', String(s.plane.visible ? 1 : s.letter.opacity));
        sheet.setAttribute('points', pts(sh.body));
        clipPoly.setAttribute('points', pts(sh.body));
        shade.setAttribute('points', pts(sh.shade));
        shade.setAttribute('opacity', String(Math.min(1, Math.max(0, (f - 0.5) / 0.3))));
        crease.setAttribute('x1', sh.peak.x.toFixed(1));
        crease.setAttribute('y1', sh.peak.y.toFixed(1));
        crease.setAttribute('x2', sh.base.x.toFixed(1));
        crease.setAttribute('y2', sh.base.y.toFixed(1));
        crease.setAttribute('opacity', String(Math.min(1, Math.max(0, (f - 0.45) / 0.3))));
        flapL.setAttribute('points', pts(sh.flapL));
        flapR.setAttribute('points', pts(sh.flapR));
        const planeOp = Math.min(1, Math.max(0, (f - 0.8) / 0.12));
        planeG.setAttribute('opacity', String(planeOp));
        for (const e of [sheet, shade, crease, flapL, flapR, content]) {
          if (e !== content) e.setAttribute('visibility', planeOp >= 1 ? 'hidden' : 'visible');
        }
        const fadeText = Math.min(1, Math.max(0, 1 - (f - 0.35) / 0.2));
        content.setAttribute('opacity', String(planeOp >= 1 ? 0 : fadeText));
      }
      // Trail: fading segments behind the plane.
      trailSegs.forEach((seg, i) => {
        const a = s.trail[i];
        const b = s.trail[i + 1];
        if (!a || !b) {
          seg.setAttribute('visibility', 'hidden');
          return;
        }
        seg.setAttribute('visibility', 'visible');
        seg.setAttribute('x1', a.x.toFixed(1));
        seg.setAttribute('y1', a.y.toFixed(1));
        seg.setAttribute('x2', b.x.toFixed(1));
        seg.setAttribute('y2', b.y.toFixed(1));
        seg.setAttribute('opacity', (i / TRAIL_SEGMENTS).toFixed(2));
      });
      cursor.setAttribute('visibility', s.pointer.visible ? 'visible' : 'hidden');
      cursor.setAttribute(
        'transform',
        `translate(${s.pointer.x.toFixed(1)} ${s.pointer.y.toFixed(1)}) scale(${s.pointer.pressed ? 0.85 : 1})`,
      );
    };

    let phase: SendPhase = 'idle';
    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let finished = false;
    const end = duration(p);
    cb.current.onPhase('idle');

    const tick = (now: number) => {
      elapsed += (now - last) / 1000;
      last = now;
      const s = frame(Math.min(elapsed, end), p);
      apply(s);
      const next: SendPhase =
        s.label === 'send' ? 'idle' : s.label === 'sending' ? 'sending' : 'sent';
      if (next !== phase) {
        phase = next;
        cb.current.onPhase(next);
      }
      if (elapsed >= end) {
        if (!finished) {
          finished = true;
          cb.current.onDone();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!finished) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    apply(frame(0, p));
    start();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      root.textContent = '';
    };
  }, [playKey, container, flightTime, wander, trail]);

  return <div ref={host} className="pp-overlay" aria-hidden="true" />;
}
