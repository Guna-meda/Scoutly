import type { Metadata } from 'next';
import { privacy } from '@content/en';
import { LegalPage } from '@/components/legal/LegalPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: privacy.title,
  description: privacy.description,
  path: '/privacy',
});

export default function Page() {
  return <LegalPage doc={privacy} />;
}
