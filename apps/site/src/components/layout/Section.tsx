import type { ReactNode } from 'react';
import { cx } from '../ui/cx';
import { Container } from './Container';

type Props = {
  /** Anchor id, for example "join". */
  id?: string;
  as?: 'section' | 'div';
  /** Accessible name: id of the heading that labels this section. */
  labelledBy?: string;
  className?: string;
  children?: ReactNode;
};

/** Vertical rhythm: 64 px phone, 96 px desktop (--section-pad). Clears the sticky header on anchor jumps. */
export function Section({ id, as: Tag = 'section', labelledBy, className, children }: Props) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={cx('section', className)}>
      <Container>{children}</Container>
    </Tag>
  );
}
