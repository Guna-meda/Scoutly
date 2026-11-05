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
export function MatchCard({
  index,
  name,
  meta,
  why,
  source,
  fit,
  tone,
  whyLabel,
  sourceLabel,
}: Props) {
  return (
    <li className="match">
      <div className="match-top">
        <span className="match-name">
          {index}. {name}
        </span>
        <Pill tone={tone}>{fit}</Pill>
      </div>
      <span className="match-line">{meta}</span>
      <span className="match-line">
        {whyLabel} {why}{' '}
        <span className="match-source">
          {sourceLabel} {source}
        </span>
      </span>
    </li>
  );
}
