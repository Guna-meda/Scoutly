import Link from 'next/link';
import { global } from '@content/en';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-content px-4 py-16 lg:px-12 lg:py-24">
      <h1 className="h2">{global.notFound.title}</h1>
      <p className="lead">{global.notFound.body}</p>
      <p className="lead">
        <Link href="/" className="underline">
          {global.notFound.homeLink}
        </Link>
      </p>
    </main>
  );
}
