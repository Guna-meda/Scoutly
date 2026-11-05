type Props = {
  size?: number;
  /** Accessible name. Without it the mark is decorative (aria-hidden). */
  label?: string;
  className?: string;
};

/** The Scoutly mark: a ring with a gap in its top-right quarter and an arrow leaving through it. */
export function Mark({ size = 32, label, className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
    >
      <circle cx="16" cy="16" r="11" strokeDasharray="52 17.1" />
      <path d="M14 18 L25 7 M17.5 7 H25 V14.5" />
    </svg>
  );
}
