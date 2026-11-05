import { describe, expect, it } from 'vitest';
import { Body, Display } from './Text';

describe('Text type guard', () => {
  it('rejects ink-2 on pink at compile time', () => {
    // @ts-expect-error --ink-2 may never sit on --beat-2 (pink)
    const bad = <Body tone="muted" on="beat-2" />;
    // @ts-expect-error muted text must say which surface it sits on
    const alsoBad = <Body tone="muted" />;
    const ok = <Body tone="muted" on="surface" />;
    const heading = <Display as="h2" />;
    expect([bad, alsoBad, ok, heading]).toHaveLength(4);
  });
});
