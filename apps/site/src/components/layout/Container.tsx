import type { ReactNode } from 'react';
import { cx } from '../ui/cx';

type Props = {
  as?: 'div' | 'header' | 'footer' | 'nav' | 'ul';
  className?: string;
  children?: ReactNode;
};

/** Max content width 1180, gutters 16 (phone) and 48 (desktop) via --gutter. */
export function Container({ as: Tag = 'div', className, children }: Props) {
  return <Tag className={cx('container', className)}>{children}</Tag>;
}
