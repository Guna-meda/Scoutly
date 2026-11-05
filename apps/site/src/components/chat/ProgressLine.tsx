import { Icon } from '../ui/Icon';
import { Bubble } from './Bubble';

type Props = {
  label: string;
  /** End-state visuals: "reading" shows a partly filled track, "done" a full track and a check. */
  state: 'reading' | 'done';
};

export function ProgressLine({ label, state }: Props) {
  return (
    <Bubble wide className="progress-bubble">
      <div className="progress-row">
        {state === 'done' ? (
          <span className="progress-slot">
            <span className="progress-dot-rw" aria-hidden="true" />
            <Icon name="check-circle" size={18} className="progress-ok rw-check" />
          </span>
        ) : (
          <span className="progress-dot" aria-hidden="true" />
        )}
        <span>{label}</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div
          className={
            state === 'done'
              ? 'progress-fill progress-fill-done'
              : 'progress-fill progress-fill-reading'
          }
        />
      </div>
    </Bubble>
  );
}
