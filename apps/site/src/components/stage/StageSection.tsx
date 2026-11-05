import { stage } from '@content/en';
import { PinnedStage } from './PinnedStage';
import { StageStacked } from './StageStacked';

/**
 * The pinned "how it works" stage. Both layouts are server-rendered; CSS picks one (see stage.css), so there is no layout shift.
 * Stacked is the default, the no-JS and the reduced-motion layout.
 */
export function StageSection() {
  return (
    <section id="how-it-works" aria-labelledby="stage-heading" className="stage-section">
      <h2 id="stage-heading" className="sr-only">
        {stage.ui.heading}
      </h2>
      <StageStacked />
      <PinnedStage />
    </section>
  );
}
