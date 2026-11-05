import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { global, styleguide as sg } from '@content/en';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Icon, iconNames } from '@/components/ui/Icon';
import { Mark } from '@/components/ui/Mark';
import { Pill } from '@/components/ui/Pill';
import { Body, BodyL, Display, H2, H3, Label, UI } from '@/components/ui/Text';
import { ScreenStack } from '@/components/chat/ScreenStack';
import { isStyleguideEnabled } from '@/lib/site';
import { BeatFlip } from './BeatFlip';

export const metadata: Metadata = {
  title: sg.title,
  robots: { index: false, follow: false },
};

const beats = [0, 1, 2] as const;

const surfaces = [
  ['bg', 'bg-bg'],
  ['surface', 'bg-surface'],
  ['beat-1', 'bg-beat-1'],
  ['chat-bg', 'bg-chat-bg'],
] as const;

/** Development-only. A production build serves 404 here and the sitemap never lists it. */
export default function StyleguidePage() {
  if (!isStyleguideEnabled(process.env.NEXT_PUBLIC_ENV)) notFound();
  const b = sg.buttonLabels;

  return (
    <>
      <Section>
        <Display>{sg.title}</Display>
        <BodyL className="mt-6">{sg.intro}</BodyL>
      </Section>

      <Section labelledBy="sg-type" className="border-t-2 border-line">
        <H2 id="sg-type">{sg.sections.type}</H2>
        <div className="mt-8 flex flex-col gap-4">
          <Display as="p">{sg.typeSamples.display}</Display>
          <H2 as="p">{sg.typeSamples.h2}</H2>
          <H3 as="p">{sg.typeSamples.h3}</H3>
          <BodyL>{sg.typeSamples.bodyL}</BodyL>
          <Body>{sg.typeSamples.body}</Body>
          <UI as="p">{sg.typeSamples.ui}</UI>
          <Label as="p">{sg.typeSamples.label}</Label>
          {surfaces.map(([on, bg]) => (
            <div key={on} className={`${bg} border-2 border-line rounded-m p-4`}>
              <Body tone="muted" on={on}>
                {sg.typeSamples.muted}
              </Body>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="sg-buttons" className="border-t-2 border-line">
        <H2 id="sg-buttons">{sg.sections.buttons}</H2>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button>{b.primary}</Button>
          <Button variant="secondary">{b.secondary}</Button>
          <Button size="lg">{b.primary}</Button>
          <Button variant="secondary" size="lg">
            {b.secondary}
          </Button>
          <Button href="/styleguide">{b.link}</Button>
          <Button variant="secondary" href="/styleguide">
            {b.link}
          </Button>
          <Button disabled>{b.disabled}</Button>
          <Button variant="secondary" disabled>
            {b.disabled}
          </Button>
          <Button loading>{b.loading}</Button>
          <Button variant="secondary" loading>
            {b.loading}
          </Button>
          <Button icon={<Icon name="plane" size={20} />}>{b.primary}</Button>
          <Button data-force="hover">{b.primary}</Button>
          <Button variant="secondary" data-force="focus">
            {b.secondary}
          </Button>
        </div>
      </Section>

      <Section labelledBy="sg-pills" className="border-t-2 border-line">
        <H2 id="sg-pills">{sg.sections.pills}</H2>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Pill tone="lime">{sg.fitLabels.strong}</Pill>
          <Pill tone="pink">{sg.fitLabels.good}</Pill>
          <Pill tone="white">{sg.fitLabels.stretch}</Pill>
          <Pill tone="white" kind="tag">
            {global.sampleTag}
          </Pill>
        </div>
      </Section>

      <Section labelledBy="sg-icons" className="border-t-2 border-line">
        <H2 id="sg-icons">{sg.sections.icons}</H2>
        <ul className="mt-8 flex list-none flex-wrap gap-6 p-0">
          {iconNames.map((name) => (
            <li key={name} className="flex flex-col items-center gap-2">
              <Icon name={name} size={32} />
              <UI as="span">{name}</UI>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center gap-6">
          <Mark size={20} />
          <Mark size={32} />
          <Mark size={64} />
          <span className="rounded-m bg-action p-3 text-action-text">
            <Mark size={32} />
          </span>
        </div>
      </Section>

      <Section labelledBy="sg-device" className="border-t-2 border-line">
        <H2 id="sg-device">{sg.sections.device}</H2>
        <H3 as="h3" className="mt-8">
          {sg.sections.deviceDesktop}
        </H3>
        <div className="mt-4 flex flex-wrap items-start gap-6">
          {beats.map((b) => (
            <ScreenStack key={b} beat={b} size="desktop" />
          ))}
        </div>
        <H3 as="h3" className="mt-12">
          {sg.sections.devicePhone}
        </H3>
        <div className="mt-4 flex flex-wrap items-start gap-6">
          {beats.map((b) => (
            <ScreenStack key={b} beat={b} size="phone" />
          ))}
        </div>
        <H3 as="h3" className="mt-12">
          {sg.sections.deviceStack}
        </H3>
        <div className="mt-4">
          <BeatFlip
            labels={beats.map((b) => `${sg.sections.beatPrefix} ${b + 1}`)}
            stacks={beats.map((b) => (
              <ScreenStack key={b} beat={b} size="desktop" />
            ))}
          />
        </div>
      </Section>

      <Section id="join" labelledBy="sg-join" className="border-t-2 border-line bg-beat-1">
        <H2 id="sg-join">{sg.sections.join}</H2>
        <Body className="mt-4">{sg.joinTarget}</Body>
      </Section>
    </>
  );
}
