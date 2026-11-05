'use client';

import { useEffect, useRef } from 'react';
import { miniFlight, MINI_SECONDS } from '@/lib/paper-plane';

/**
 * Short plane hop out of a button, with a short trail (about 1.4 s). Decorative, aria-hidden.
 * Reuses the spline from the stage animation. `origin` is the button centre in the host box.
 */
export default function MiniPlane({
  origin,
  onDone,
}: {
  origin: { x: number; y: number };
  onDone: () => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    const plane = root.querySelector<SVGGElement>('[data-plane]');
    const trail = root.querySelector<SVGPolylineElement>('[data-trail]');
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const f = miniFlight(Math.min(t, MINI_SECONDS), origin);
      plane?.setAttribute(
        'transform',
        `translate(${f.pos.x.toFixed(1)} ${f.pos.y.toFixed(1)}) rotate(${f.rot.toFixed(1)}) scale(${f.scale.toFixed(2)})`,
      );
      trail?.setAttribute(
        'points',
        f.trail.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
      );
      if (t < MINI_SECONDS) raf = requestAnimationFrame(tick);
      else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [origin, onDone]);
  return (
    <svg ref={svg} className="mini-plane" aria-hidden="true" width="1" height="1">
      <polyline data-trail="" className="pp-trail-line" fill="none" />
      <g data-plane="">
        <polygon className="pp-sheet" points="14,0 -12,-9 -6,0 -12,9" />
        <polygon className="pp-flap" points="14,0 -6,0 -12,9" />
      </g>
    </svg>
  );
}
