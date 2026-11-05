import type { Metadata } from 'next';
import { security } from '@content/en';
import { LegalPage } from '@/components/legal/LegalPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: security.title,
  description: security.description,
  path: '/security',
});

export default function Page() {
  return <LegalPage doc={security} />;
}
