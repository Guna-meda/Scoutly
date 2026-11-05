import { stage } from '@content/en';
import { StaticScreen } from '../chat/ScreenStack';
import { Container } from '../layout/Container';
import { Icon, type IconName } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { fill } from '@/lib/stage-mode';

export const beatIcons: readonly IconName[] = ['bolt', 'target', 'check-circle'];
export const beatTones = ['lime', 'blue', 'green'] as const;

/** Three steps in a vertical sequence: card, caption and a static frame each. */
export function StageStacked() {
  return (
    <div className="stage-stacked" data-mode="stacked">
      <Container>
        {stage.beats.map((b, i) => (
          <article key={b.label} className="stk-step">
            <div className="stk-text">
              <div className="beat-card beat-card-open" data-tone={i + 1}>
                <Pill tone={beatTones[i] ?? 'white'}>{b.label}</Pill>
                <h3 className="beat-headline">{b.headline}</h3>
                <Icon name={beatIcons[i] ?? 'bolt'} size={32} className="beat-icon" />
              </div>
              <p className="stk-caption">
                <span className="t-label">{fill(stage.ui.stepOf, { n: i + 1 })}</span>
                <span className="stk-caption-text">{b.caption}</span>
              </p>
            </div>
            <StaticScreen beat={i as 0 | 1 | 2} size="phone" />
          </article>
        ))}
      </Container>
    </div>
  );
}
