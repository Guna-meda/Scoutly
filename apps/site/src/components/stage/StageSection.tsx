import { stage } from '@content/en';
import { StageEnhancer } from './StageEnhancer';
import { StageStacked } from './StageStacked';

/**
 * The pinned "how it works" stage. Server-rendered as the stacked layout (also the no-JS and
 * reduced-motion layout); StageEnhancer upgrades it to the pinned layout on the client when allowed.
 */
export function StageSection() {
  return (
    <section id="how-it-works" aria-labelledby="stage-heading" className="stage-section">
      <h2 id="stage-heading" className="sr-only">
        {stage.ui.heading}
      </h2>
      <StageEnhancer>
        <StageStacked />
      </StageEnhancer>
    </section>
  );
}
