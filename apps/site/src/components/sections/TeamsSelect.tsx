'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { stage, teams } from '@content/en';

type Edge = 'left' | 'right' | 'top' | 'bottom';
type Fill = { edge: Edge; on: boolean };
const matches = stage.specific.matches;

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

  const current = matches[active];
  const parts: ReactNode[] = [<span key="before">{teams.before}</span>];
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
        onClick={() => setActive(i)}
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
        <span>{m.name}</span>
      </button>,
    );
    parts.push(
      <span key={`sep-${i}`}>{i < matches.length - 1 ? teams.between[i] : teams.after}</span>,
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
          <strong>{current.name}</strong> · {current.fit}.{' '}
          {current.why.charAt(0).toUpperCase() + current.why.slice(1)}
        </p>
      ) : null}
    </div>
  );
}
