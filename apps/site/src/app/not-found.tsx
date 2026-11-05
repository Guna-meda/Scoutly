import Link from 'next/link';
import { global } from '@content/en';
import { Section } from '@/components/layout/Section';
import { BodyL, H2 } from '@/components/ui/Text';

export default function NotFound() {
  return (
    <Section>
      <H2 as="h1">{global.notFound.title}</H2>
      <BodyL className="mt-6">{global.notFound.body}</BodyL>
      <BodyL className="mt-6">
        <Link href="/" className="footer-link">
          {global.notFound.homeLink}
        </Link>
      </BodyL>
    </Section>
  );
}
