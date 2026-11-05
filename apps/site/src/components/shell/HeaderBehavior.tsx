'use client';

import { useEffect } from 'react';
import { stepHeader, type HeaderState } from '@/lib/header-visibility';

/**
 * Hide-on-scroll-down for #site-header. Renders nothing; toggles data-hidden on the server-rendered
 * header. One passive scroll listener throttled by requestAnimationFrame. No preventDefault.
 * Under prefers-reduced-motion the header never hides.
 */
export function HeaderBehavior() {
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let state: HeaderState = { lastY: window.scrollY, hidden: false };
    let queued = false;

    const commit = (next: HeaderState) => {
      if (next === state) return;
      state = next;
      if (next.hidden) header.setAttribute('data-hidden', 'true');
      else header.removeAttribute('data-hidden');
    };
    const update = () => {
      queued = false;
      commit(
        stepHeader(state, {
          y: window.scrollY,
          headerHeight: header.offsetHeight,
          focusInside: header.contains(document.activeElement),
          menuOpen: header.querySelector('details[open]') !== null,
          reducedMotion: motion.matches,
        }),
      );
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };
    // A hidden header is not focusable, so reveal it before Tab moves focus into it.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') commit({ lastY: window.scrollY, hidden: false });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    header.addEventListener('focusin', update);
    header.addEventListener('toggle', update, true); // toggle does not bubble, so capture it
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
      header.removeEventListener('focusin', update);
      header.removeEventListener('toggle', update, true);
    };
  }, []);

  return null;
}
