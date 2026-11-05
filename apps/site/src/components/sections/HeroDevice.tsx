'use client';

import { useEffect, useRef, useState } from 'react';
import { heroExtra } from '@content/en';
import { ScreenStack } from '../chat/ScreenStack';
import type { Beat } from '@/lib/stage-mode';

/** Hero sample chat: cycles the three screens every 3 s. Pauses off screen and when the tab is hidden. */
export function HeroDevice() {
  const [beat, setBeat] = useState<Beat>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    };
    const sync = () => {
      stop();
      if (visible && !document.hidden)
        timer = window.setInterval(() => setBeat((b) => ((b + 1) % 3) as Beat), 3000);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div ref={ref} className="hero-device">
      <ScreenStack beat={beat} />
      <p className="hero-device-caption">{heroExtra.deviceCaption}</p>
    </div>
  );
}
