'use client';

import { useEffect, useRef, useState } from 'react';
import { emailCompare } from '@content/en';

const paragraphs = emailCompare.good;
const total = paragraphs.join('').length;
const offsets = paragraphs.map((_, i) => paragraphs.slice(0, i).join('').length);

/**
 * The good email. Server-rendered complete. On first entry into view (motion allowed) it types in
 * once; untyped text keeps its space so nothing shifts. Screen readers get the full text throughout.
 */
export function TypedEmail() {
  const [n, setN] = useState(total);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      let i = 0;
      setN(0);
      timer = window.setInterval(() => {
        i += 3;
        setN(Math.min(i, total));
        if (i >= total) window.clearInterval(timer);
      }, 24);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, []);

  return (
    <div ref={ref} className="email-body">
      <div className="sr-only">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div aria-hidden="true">
        {paragraphs.map((p, i) => {
          const shown = Math.max(0, Math.min(p.length, n - (offsets[i] ?? 0)));
          return (
            <p key={p}>
              {p.slice(0, shown)}
              <span className="ghost">{p.slice(shown)}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
