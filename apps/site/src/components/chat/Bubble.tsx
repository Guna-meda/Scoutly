import type { ReactNode } from 'react';
import { cx } from '../ui/cx';

type Props = {
  /** "in" is Scoutly (surface); "out" is the user (acid). */
  from?: 'in' | 'out';
  wide?: boolean;
  className?: string;
  children: ReactNode;
};

export function Bubble({ from = 'in', wide, className, children }: Props) {
  return (
    <div className={cx('bubble', from === 'out' && 'bubble-out', wide && 'bubble-wide', className)}>
      {children}
    </div>
  );
}
