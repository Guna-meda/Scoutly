import type { ReactNode } from 'react';
import { deviceLabel } from '@content/en';
import { cx } from '../ui/cx';

type Props = {
  /** 0 to 2. Used for the accessible label ("step n of 3"). */
  beat: 0 | 1 | 2;
  /** "auto" follows the viewport; the fixed sizes are for the styleguide. */
  size?: 'auto' | 'desktop' | 'phone';
  children: ReactNode;
};

/** The phone-shaped frame. Pure markup; W03 drives it. */
export function DeviceFrame({ beat, size = 'auto', children }: Props) {
  return (
    <div
      role="group"
      aria-label={deviceLabel(beat + 1)}
      className={cx(
        'device',
        size === 'desktop' && 'device-desktop',
        size === 'phone' && 'device-phone',
      )}
    >
      {children}
    </div>
  );
}
