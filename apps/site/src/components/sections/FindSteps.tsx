'use client';

import { useEffect, useRef, useState } from 'react';
import { find } from '@content/en';
import { fill } from '@/lib/stage-mode';

/**
 * Five steps. On wide screens with motion allowed (CSS decides) the step in the middle of the
 * viewport is highlighted and a line draws down to the next. Otherwise it is a plain numbered list.
 */
export function FindSteps() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <ol className="find-steps">
      {find.steps.map((s, i) => (
        <li
          key={s.title}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-i={i}
          className="find-step"
          data-state={i === active ? 'active' : i < active ? 'past' : 'next'}
        >
          <span className="find-num" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <p className="find-title">
              <span className="sr-only">{fill(find.stepLabel, { n: i + 1 })}. </span>
              {s.title}
            </p>
            <p className="find-body">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
