'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { decideMode, type StageMode } from '@/lib/stage-mode';
import { PinnedStage } from './PinnedStage';

const queries = [
  '(prefers-reduced-motion: reduce)',
  '(min-width: 1024px)',
  '(min-height: 700px)',
  '(min-height: 820px)',
] as const;

/** Renders the server's stacked layout until the client knows motion is allowed and the viewport fits. */
export function StageEnhancer({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StageMode>('stacked');

  useEffect(() => {
    const mqs = queries.map((q) => window.matchMedia(q));
    const update = () =>
      setMode(
        decideMode({
          reduceMotion: mqs[0]?.matches ?? true,
          width: mqs[1]?.matches ? 1024 : 0,
          height: mqs[3]?.matches ? 820 : mqs[2]?.matches ? 700 : 0,
        }),
      );
    update();
    mqs.forEach((m) => m.addEventListener('change', update));
    return () => mqs.forEach((m) => m.removeEventListener('change', update));
  }, []);

  return mode === 'stacked' ? children : <PinnedStage mode={mode} />;
}
