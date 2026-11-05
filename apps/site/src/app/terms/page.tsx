import type { Metadata } from 'next';
import { terms } from '@content/en';
import { LegalPage } from '@/components/legal/LegalPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: terms.title,
  description: terms.description,
  path: '/terms',
});

export default function Page() {
  return <LegalPage doc={terms} />;
}
