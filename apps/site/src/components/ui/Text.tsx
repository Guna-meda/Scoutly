import type { ReactNode } from 'react';
import { cx } from './cx';

export type TextElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'div'
  | 'li'
  | 'small'
  | 'strong'
  | 'label'
  | 'figcaption';

/**
 * Surfaces where the muted ink colour (--ink-2) is allowed (DESIGN_SYSTEM.md section 2).
 * `beat-2` (pink) and `beat-3` (blue) are deliberately absent: ink-2 on blue is 3.9:1 and fails AA, and pink stays out to keep the rule simple.
 */
export type MutedSurface = 'bg' | 'surface' | 'beat-1' | 'chat-bg';

type ToneProps = { tone?: 'ink'; on?: undefined } | { tone: 'muted'; on: MutedSurface };

type VariantName = 'display' | 'h2' | 'h3' | 'body-l' | 'body' | 'ui' | 'label';

export type TextProps = {
  as?: TextElement;
  id?: string;
  className?: string;
  children?: ReactNode;
} & ToneProps;

const defaults: Record<VariantName, TextElement> = {
  display: 'h1',
  h2: 'h2',
  h3: 'h3',
  'body-l': 'p',
  body: 'p',
  ui: 'span',
  label: 'span',
};

export function Text({
  variant,
  as,
  tone = 'ink',
  className,
  children,
  id,
}: TextProps & { variant: VariantName }) {
  const Tag = as ?? defaults[variant];
  return (
    <Tag id={id} className={cx(`t-${variant}`, tone === 'muted' && 'tone-muted', className)}>
      {children}
    </Tag>
  );
}

type Preset = (props: TextProps) => ReactNode;
const make = (variant: VariantName): Preset =>
  function Preset(props) {
    return <Text variant={variant} {...props} />;
  };

export const Display = make('display');
export const H2 = make('h2');
export const H3 = make('h3');
export const BodyL = make('body-l');
export const Body = make('body');
export const UI = make('ui');
export const Label = make('label');
