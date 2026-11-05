export type Beat = 0 | 1 | 2;
export type StageMode = 'stacked' | 'desktop' | 'phone';

export type StageEnv = { reduceMotion: boolean; width: number; height: number };

/** Minimum heights at which the pinned layout fits without cropping the device (phone includes the 84 px floating bar). */
export const MIN_HEIGHT_DESKTOP = 700;
export const MIN_HEIGHT_PHONE = 820;
export const DESKTOP_WIDTH = 1024;

/** Stacked is the server, no-JS and reduced-motion layout; pinned only when motion is allowed and it fits. */
export function decideMode({ reduceMotion, width, height }: StageEnv): StageMode {
  if (reduceMotion) return 'stacked';
  if (width >= DESKTOP_WIDTH) return height >= MIN_HEIGHT_DESKTOP ? 'desktop' : 'stacked';
  return height >= MIN_HEIGHT_PHONE ? 'phone' : 'stacked';
}

export function clampBeat(n: number): Beat {
  return Math.min(2, Math.max(0, Math.round(Number.isFinite(n) ? n : 0))) as Beat;
}

/** Beat for a scroll offset (px) inside the pinned wrapper, given the step length. Zones: [0,.5), [.5,1.5), [1.5,..). */
export function beatForOffset(offset: number, stepLen: number): Beat {
  if (stepLen <= 0) return 0;
  const t = offset / stepLen;
  return t < 0.5 ? 0 : t < 1.5 ? 1 : 2;
}

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}
