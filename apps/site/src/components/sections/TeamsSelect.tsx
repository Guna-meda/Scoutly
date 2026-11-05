'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { teams } from '@content/en';

type Edge = 'left' | 'right' | 'top' | 'bottom';
type Fill = { edge: Edge; on: boolean };
const matches = teams.items;

/** Nearest edge of a rect to a pointer position. */
function nearestEdge(rect: DOMRect, x: number, y: number): Edge {
  const d: [Edge, number][] = [
    ['left', Math.abs(x - rect.left)],
    ['right', Math.abs(rect.right - x)],
    ['top', Math.abs(y - rect.top)],
    ['bottom', Math.abs(rect.bottom - y)],
  ];
  return d.sort((a, b) => a[1] - b[1])[0]?.[0] ?? 'left';
}

/**
 * An intro sentence whose names select like layers in a design tool: a frame with resize
 * handles and a live size tag slides to the chosen name, and its logo fills from the edge the
 * pointer came in. Original implementation. Works with hover, focus and tap; the sentence reads
 * as plain text without JS.
 */
export function TeamsSelect() {
  const [active, setActive] = useState(0);
  const [fills, setFills] = useState<Fill[]>(matches.map(() => ({ edge: 'left', on: false })));
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const wrap = useRef<HTMLParagraphElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = useCallback(() => {
    const w = wrap.current;
    const el = items.current[active];
    if (!w || !el) return;
    const a = w.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    setBox({ x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height });
  }, [active]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    const w = wrap.current;
    if (!w) return;
    const ro = new ResizeObserver(measure);
    ro.observe(w);
    return () => ro.disconnect();
  }, [measure]);

  const setFill = (i: number, edge: Edge, on: boolean) =>
    setFills((f) => f.map((v, j) => (j === i ? { edge, on } : v)));

  /* Touch screens have no hover, so the selection roams on its own: random names, never the same
     one twice in a row, paused while off-screen, after a tap, or with reduced motion. */
  const activeRef = useRef(0);
  const pausedUntil = useRef(0);
  const visible = useRef(true);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    const w = wrap.current;
    if (!w) return;
    const touch = window.matchMedia('(hover: none)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const io = new IntersectionObserver(([e]) => {
      visible.current = !!e?.isIntersecting;
    });
    io.observe(w);
    const edges: Edge[] = ['left', 'right', 'top', 'bottom'];
    const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)] as T;
    const id = window.setInterval(() => {
      if (!touch.matches || reduced.matches || !visible.current) return;
      if (Date.now() < pausedUntil.current) return;
      const prev = activeRef.current;
      const next = pick(matches.map((_, i) => i).filter((i) => i !== prev));
      setFills((f) =>
        f.map((v, j) =>
          j === prev
            ? { edge: pick(edges), on: false }
            : j === next
              ? { edge: pick(edges), on: true }
              : v,
        ),
      );
      setActive(next);
    }, 2200);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, []);

  const current = matches[active];
  const parts: ReactNode[] = [
    <span key="before" className="ts-plain">
      {teams.before}
    </span>,
  ];
  matches.forEach((m, i) => {
    const f = fills[i] ?? { edge: 'left' as Edge, on: false };
    const horizontal = f.edge === 'left' || f.edge === 'right';
    const logoStyle = {
      '--ox': f.edge === 'left' ? 'left' : f.edge === 'right' ? 'right' : 'center',
      '--oy': f.edge === 'top' ? 'top' : f.edge === 'bottom' ? 'bottom' : 'center',
      '--sx': horizontal ? 0 : 1,
      '--sy': horizontal ? 1 : 0,
    } as CSSProperties;
    parts.push(
      <button
        key={m.name}
        ref={(el) => {
          items.current[i] = el;
        }}
        type="button"
        className="ts-item"
        aria-pressed={i === active}
        onPointerEnter={(e) => {
          setActive(i);
          setFill(
            i,
            nearestEdge(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY),
            true,
          );
        }}
        onPointerLeave={(e) => {
          setFill(
            i,
            nearestEdge(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY),
            false,
          );
        }}
        onFocus={() => {
          setActive(i);
          setFill(i, 'left', true);
        }}
        onBlur={() => setFill(i, 'right', false)}
        onClick={() => {
          pausedUntil.current = Date.now() + 6000;
          setActive(i);
          setFills((f) =>
            f.map((v, j) =>
              j === i ? { edge: 'left', on: true } : v.on ? { edge: 'right', on: false } : v,
            ),
          );
        }}
      >
        <span
          className="ts-logo"
          data-tone={teams.tones[i]}
          data-on={f.on}
          style={logoStyle}
          aria-hidden="true"
        >
          <span className="ts-fill" />
          <span className="ts-initial">{m.name.charAt(0)}</span>
        </span>
        <span className="ts-name">{m.name}</span>
      </button>,
    );
    parts.push(
      <span key={`sep-${i}`} className="ts-plain">
        {i < matches.length - 1 ? teams.between[i] : teams.after}
      </span>,
    );
  });

  const frameStyle: CSSProperties | undefined = box
    ? { transform: `translate(${box.x}px, ${box.y}px)`, width: box.w, height: box.h }
    : undefined;

  return (
    <div className="ts">
      <p ref={wrap} className="ts-text">
        <span className="ts-frame" aria-hidden="true" data-ready={box !== null} style={frameStyle}>
          <i className="ts-h ts-h-tl" />
          <i className="ts-h ts-h-tr" />
          <i className="ts-h ts-h-bl" />
          <i className="ts-h ts-h-br" />
          {box ? (
            <span className="ts-size">
              {Math.round(box.w)} × {Math.round(box.h)}
            </span>
          ) : null}
        </span>
        {parts}
      </p>
      {current ? (
        <p className="ts-detail" role="status" aria-live="polite">
          <span className="sr-only">{teams.detailLabel}: </span>
          <strong>{current.name}</strong> · {current.detail}
        </p>
      ) : null}
    </div>
  );
}
