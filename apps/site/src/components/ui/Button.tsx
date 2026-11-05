import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

type Own = {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  /** Not-allowed state: track fill, ink text, dashed outline, aria-disabled. Stays focusable. */
  disabled?: boolean;
  /** Busy state: keeps width, shows a spinner, ignores activation. */
  loading?: boolean;
  /** Leading decorative icon. */
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type AsButton = Own &
  Omit<ComponentPropsWithoutRef<'button'>, keyof Own | 'disabled'> & { href?: undefined };
type AsLink = Own & Omit<ComponentPropsWithoutRef<'a'>, keyof Own | 'href'> & { href: string };

export type ButtonProps = AsButton | AsLink;

/**
 * Renders <a> when `href` is given (Next Link for internal paths) and <button> otherwise.
 * Server-safe: no handlers. Disabled and loading controls get aria-disabled and cannot navigate or submit.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', disabled, loading, icon, className, children } = props;
  const inactive = Boolean(disabled || loading);
  const classes = cx(
    'btn',
    `btn-${variant}`,
    size === 'lg' && 'btn-lg',
    variant === 'primary' && 'on-ink',
    className,
  );
  const content = (
    <>
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : icon}
      {children}
    </>
  );
  const state = {
    'aria-disabled': inactive || undefined,
    'aria-busy': loading || undefined,
  };

  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      disabled: _d,
      loading: _l,
      icon: _i,
      className: _c,
      children: _ch,
      ...anchor
    } = props;
    if (inactive) {
      // A link without href is not navigable; role keeps it announced as a link.
      return (
        <a {...anchor} role="link" className={classes} {...state}>
          {content}
        </a>
      );
    }
    const internal = href.startsWith('/') && !href.startsWith('//');
    return internal ? (
      <Link {...anchor} href={href} className={classes}>
        {content}
      </Link>
    ) : (
      <a {...anchor} href={href} className={classes}>
        {content}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    disabled: _d,
    loading: _l,
    icon: _i,
    className: _c,
    children: _ch,
    type,
    ...button
  } = props;
  return (
    <button
      {...button}
      type={inactive ? 'button' : (type ?? 'button')}
      className={classes}
      {...state}
    >
      {content}
    </button>
  );
}
