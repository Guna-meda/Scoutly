import { hero } from '@content/en';
import { Section } from '@/components/layout/Section';
import { StageSection } from '@/components/stage/StageSection';
import { BodyL, Display } from '@/components/ui/Text';

export default function HomePage() {
  return (
    <>
      <Section>
        <Display>{hero.h1}</Display>
        <BodyL className="mt-6 max-w-[40em]">{hero.lead}</BodyL>
      </Section>
      <StageSection />
    </>
  );
}
