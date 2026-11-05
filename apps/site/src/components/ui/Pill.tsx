import type { ReactNode } from 'react';
import { cx } from './cx';

/** Only the three allowed fills: yellow (beat-1), pink (beat-2), white (surface). Text is always ink. */
export type PillTone = 'lime' | 'pink' | 'white' | 'blue' | 'green';

type Props = {
  tone: PillTone;
  /** "tag" uses the Label style (for "Sample"); "fit" is the fit-label style. */
  kind?: 'fit' | 'tag';
  className?: string;
  children?: ReactNode;
};

export function Pill({ tone, kind = 'fit', className, children }: Props) {
  return (
    <span className={cx('pill', `pill-${tone}`, kind === 'tag' && 'pill-tag', className)}>
      {children}
    </span>
  );
}
