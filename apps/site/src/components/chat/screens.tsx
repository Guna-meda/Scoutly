import { stage } from '@content/en';
import type { PillTone } from '../ui/Pill';
import { Bubble } from './Bubble';
import { DraftBubble } from './DraftBubble';
import { FileBubble } from './FileBubble';
import { MatchCard } from './MatchCard';
import { ProgressLine } from './ProgressLine';
import { QuickReplies } from './QuickReplies';
import { SentNote } from './SentNote';

/** Beat 1, final state: file sent, reading done (check shown), next-step message. */
export function ScreenSimple() {
  const s = stage.simple;
  return (
    <>
      <FileBubble name={s.fileName} />
      <Bubble>{s.reply}</Bubble>
      <ProgressLine label={s.progressLabel} state="done" />
      <Bubble>{s.next}</Bubble>
    </>
  );
}

const fitTones: readonly PillTone[] = ['white', 'lime', 'pink'];

/** Beat 2, final state: three matches, all fit labels visible. */
export function ScreenSpecific() {
  const s = stage.specific;
  return (
    <>
      <Bubble>{s.intro}</Bubble>
      <ol className="match-list">
        {s.matches.map((m, i) => (
          <MatchCard
            key={m.name}
            index={i + 1}
            {...m}
            tone={fitTones[i] ?? 'white'}
            whyLabel={s.whyLabel}
            sourceLabel={s.sourceLabel}
          />
        ))}
      </ol>
      <Bubble>{s.outro}</Bubble>
    </>
  );
}

/** Beat 3, resting state: draft, quick replies (not pressed), sent note shown. */
export function ScreenYours() {
  const y = stage.yours;
  return (
    <>
      <DraftBubble
        header={y.draftHeader}
        greeting={y.greeting}
        paragraphs={y.paragraphs}
        signoff={y.signoff}
      />
      <QuickReplies {...y.quickReplies} />
      <SentNote>{y.sentNote}</SentNote>
    </>
  );
}

export const screens = [ScreenSimple, ScreenSpecific, ScreenYours] as const;
