import { Pill, type PillTone } from '../ui/Pill';

type Props = {
  index: number;
  name: string;
  meta: string;
  why: string;
  source: string;
  fit: string;
  tone: PillTone;
  whyLabel: string;
  sourceLabel: string;
};

/** One match: name, meta, reason, source and a fit label that carries words. */
export function MatchCard({ name, why, fit, tone }: Props) {
  return (
    <li className="match">
      <span className={`match-av match-av-${tone}`} aria-hidden="true">
        {name.charAt(0)}
      </span>
      <div className="match-main">
        <div className="match-top">
          <span className="match-name">{name}</span>
          <Pill tone={tone}>{fit}</Pill>
        </div>
        <span className="match-line">{why}</span>
      </div>
    </li>
  );
}
