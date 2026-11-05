'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { stage } from '@content/en';
import { ScreenStack } from '../chat/ScreenStack';
import { Container } from '../layout/Container';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { clampBeat, fill, type Beat, type StageMode } from '@/lib/stage-mode';
import { beatIcons, beatTones } from './StageStacked';

const beats = [0, 1, 2] as const;
const fitTones = ['white', 'lime', 'pink'] as const;
const fits = stage.specific.matches.map((m) => m.fit);

function headerHeight(): number {
  return (
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64
  );
}

/**
 * Pinned stage. `beat` is the single source of truth: scroll (IntersectionObserver on three zones),
 * buttons, dots and card labels all set it. No wheel/touch listeners, no preventDefault.
 */
export function PinnedStage({ mode }: { mode: Exclude<StageMode, 'stacked'> }) {
  const [beat, setBeat] = useState<Beat>(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lock = useRef<number | null>(null);

  useEffect(() => {
    let io: IntersectionObserver | undefined;
    const connect = () => {
      io?.disconnect();
      const hh = headerHeight();
      // A 2px line just under the header; the zone crossing it is the active beat.
      io = new IntersectionObserver(
        (entries) => {
          if (lock.current !== null) return;
          for (const e of entries) {
            if (e.isIntersecting)
              setBeat(clampBeat(Number((e.target as HTMLElement).dataset.zone)));
          }
        },
        { rootMargin: `-${hh}px 0px -${Math.max(0, window.innerHeight - hh - 2)}px 0px` },
      );
      zoneRefs.current.forEach((z) => z && io?.observe(z));
    };
    connect();
    window.addEventListener('resize', connect);
    return () => {
      io?.disconnect();
      window.removeEventListener('resize', connect);
    };
  }, []);

  const goTo = useCallback((raw: number) => {
    const next = clampBeat(raw);
    setBeat(next);
    const wrap = wrapRef.current;
    const z1 = zoneRefs.current[1];
    const z2 = zoneRefs.current[2];
    if (!wrap || !z1 || !z2) return;
    const step = z2.offsetTop - z1.offsetTop;
    const y = wrap.getBoundingClientRect().top + window.scrollY - headerHeight() + next * step + 2;
    // Hold the observer off while scrolling so intermediate zones do not flicker the state.
    if (lock.current !== null) window.clearTimeout(lock.current);
    lock.current = window.setTimeout(() => {
      lock.current = null;
    }, 900);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  const b = stage.beats;
  const announce = fill(stage.ui.announce, { n: beat + 1, headline: b[beat]?.headline ?? '' });

  const controls = (
    <div className="stage-controls" role="group" aria-label={stage.ui.controls}>
      <button
        type="button"
        className="stage-nav"
        aria-label={stage.ui.prev}
        disabled={beat === 0}
        onClick={() => goTo(beat - 1)}
      >
        <Icon name="chevron-left" size={22} />
      </button>
      <div className="stage-dots">
        {beats.map((i) => (
          <button
            key={i}
            type="button"
            className="stage-dot"
            aria-label={fill(stage.ui.goTo, { n: i + 1 })}
            aria-current={i === beat ? 'step' : undefined}
            onClick={() => goTo(i)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="stage-nav"
        aria-label={stage.ui.next}
        disabled={beat === 2}
        onClick={() => goTo(beat + 1)}
      >
        <Icon name="chevron-right" size={22} />
      </button>
    </div>
  );

  return (
    <div ref={wrapRef} className="stage-pin" data-mode={mode} data-beat={beat}>
      {beats.map((i) => (
        <div
          key={i}
          ref={(el) => {
            zoneRefs.current[i] = el;
          }}
          className="stage-zone"
          data-zone={i}
          aria-hidden="true"
        />
      ))}
      <div className="stage-sticky">
        <Container>
          {mode === 'desktop' ? (
            <div className="stage-grid">
              <div className="beat-cards">
                {beats.map((i) => (
                  <div key={i} className="beat-card" data-tone={i + 1} data-active={i === beat}>
                    <div className="beat-headline-wrap" aria-hidden={i !== beat} inert={i !== beat}>
                      <h3 className="beat-headline">{b[i]?.headline}</h3>
                    </div>
                    <button
                      type="button"
                      className="beat-label"
                      aria-pressed={i === beat}
                      onClick={() => goTo(i)}
                    >
                      {b[i]?.label}
                    </button>
                    <Icon name={beatIcons[i] ?? 'bolt'} size={32} className="beat-icon" />
                  </div>
                ))}
              </div>
              <div className="stage-centre">
                <ScreenStack beat={beat} />
                {controls}
              </div>
              <div className="caption-card">
                <span className="t-label">{fill(stage.ui.stepOf, { n: beat + 1 })}</span>
                <div className="caption-stack">
                  {beats.map((i) => (
                    <p
                      key={i}
                      className="caption-text"
                      data-state={i === beat ? 'active' : 'off'}
                      aria-hidden={i !== beat}
                    >
                      {b[i]?.caption}
                    </p>
                  ))}
                </div>
                <Rewards beat={beat} />
              </div>
            </div>
          ) : (
            <div className="stage-phone">
              <ScreenStack beat={beat} />
              <div className="step-cards">
                {beats.map((i) => (
                  <div
                    key={i}
                    className="step-card"
                    data-tone={i + 1}
                    data-state={i === beat ? 'active' : 'off'}
                    aria-hidden={i !== beat}
                    inert={i !== beat}
                  >
                    <Pill tone={beatTones[i] ?? 'white'}>{b[i]?.label}</Pill>
                    <h3 className="step-headline">{b[i]?.headline}</h3>
                    <p className="step-caption">{b[i]?.caption}</p>
                  </div>
                ))}
              </div>
              {controls}
            </div>
          )}
        </Container>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

/** Fixed 150 x 110 slot in the caption card; one small icon scene per beat. */
function Rewards({ beat }: { beat: Beat }) {
  return (
    <div className="reward-slot" aria-hidden="true">
      <div className="reward" data-state={beat === 0 ? 'active' : 'off'}>
        <span className="rwd-clip">
          <Icon name="paperclip" size={44} />
        </span>
        <span className="rwd-check">
          <Icon name="check-circle" size={44} />
        </span>
      </div>
      <div className="reward" data-state={beat === 1 ? 'active' : 'off'}>
        {fits.map((f, i) => (
          <Pill key={f} tone={fitTones[i] ?? 'white'} className="rwd-pill">
            {f}
          </Pill>
        ))}
      </div>
      <div className="reward" data-state={beat === 2 ? 'active' : 'off'}>
        <span className="rwd-toggle">
          <span className="rwd-toggle-on" />
          <span className="rwd-knob" />
        </span>
      </div>
    </div>
  );
}
