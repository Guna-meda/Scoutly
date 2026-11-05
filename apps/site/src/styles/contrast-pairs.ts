/**
 * Every text/background and UI pair from docs/site/DESIGN_SYSTEM.md section 2.
 * Names refer to tokens in tokens.css; the test resolves the values from that file.
 */
export type TokenName =
  | 'bg'
  | 'surface'
  | 'ink'
  | 'ink-2'
  | 'beat-1'
  | 'beat-2'
  | 'beat-3'
  | 'action'
  | 'action-text'
  | 'chat-bg'
  | 'track'
  | 'ok'
  | 'warn'
  | 'line';

export type PairKind = 'text' | 'large-text' | 'ui';

export interface ContrastPair {
  fg: TokenName;
  bg: TokenName;
  kind: PairKind;
}

export const MIN_RATIO: Record<PairKind, number> = {
  text: 4.5,
  'large-text': 3,
  ui: 3,
};

export const contrastPairs: readonly ContrastPair[] = [
  // ink text
  { fg: 'ink', bg: 'bg', kind: 'text' },
  { fg: 'ink', bg: 'surface', kind: 'text' },
  { fg: 'ink', bg: 'beat-1', kind: 'text' },
  { fg: 'ink', bg: 'beat-2', kind: 'text' },
  { fg: 'ink', bg: 'beat-3', kind: 'text' },
  { fg: 'ink', bg: 'chat-bg', kind: 'text' },
  // ink-2 captions: allowed surfaces only (never pink)
  { fg: 'ink-2', bg: 'bg', kind: 'text' },
  { fg: 'ink-2', bg: 'surface', kind: 'text' },
  { fg: 'ink-2', bg: 'beat-1', kind: 'text' },
  { fg: 'ink-2', bg: 'chat-bg', kind: 'text' },
  // primary button
  { fg: 'action-text', bg: 'action', kind: 'text' },
  // status
  { fg: 'ok', bg: 'surface', kind: 'text' },
  { fg: 'warn', bg: 'surface', kind: 'text' },
  // disabled button: ink on track (no opacity)
  { fg: 'ink', bg: 'track', kind: 'text' },
  // focus ring: ink ring on page ground, white inner ring on ink fill
  { fg: 'action-text', bg: 'action', kind: 'ui' },
  // outlines and icons against every surface they sit on
  { fg: 'line', bg: 'bg', kind: 'ui' },
  { fg: 'line', bg: 'surface', kind: 'ui' },
  { fg: 'line', bg: 'beat-1', kind: 'ui' },
  { fg: 'line', bg: 'beat-2', kind: 'ui' },
  { fg: 'line', bg: 'chat-bg', kind: 'ui' },
  { fg: 'line', bg: 'track', kind: 'ui' },
];

/** Combinations that must never appear in `contrastPairs` (DESIGN_SYSTEM.md section 2 rules). */
export const forbiddenPairs: readonly { fg: TokenName; bg: TokenName }[] = [
  { fg: 'ink-2', bg: 'beat-2' },
];
