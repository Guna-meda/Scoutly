import type { ReactNode } from 'react';

export const iconNames = [
  'bolt',
  'target',
  'check-circle',
  'paperclip',
  'plane',
  'chevron-left',
  'chevron-right',
  'plus',
  'menu',
  'chat-bubble',
  'doc',
] as const;
export type IconName = (typeof iconNames)[number];

/** Original glyphs on a 24 px grid, stroked with currentColor. */
const paths: Record<IconName, ReactNode> = {
  bolt: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12.5z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12h.01" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  paperclip: (
    <path d="m19.5 11.5-7.7 7.7a4.6 4.6 0 0 1-6.5-6.5l8.2-8.2a3.1 3.1 0 0 1 4.4 4.4l-8.2 8.2a1.5 1.5 0 0 1-2.2-2.2l7.5-7.5" />
  ),
  plane: <path d="M21 3 3 10.5l7 3 3 7zM10 13.5 21 3" />,
  'chevron-left': <path d="m15 5-7 7 7 7" />,
  'chevron-right': <path d="m9 5 7 7-7 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  'chat-bubble': (
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
};

type Props = {
  name: IconName;
  size?: number;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  label?: string;
  className?: string;
};

export function Icon({ name, size = 24, label, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
    >
      {paths[name]}
    </svg>
  );
}
