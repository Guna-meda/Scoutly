import { global, hero } from '@content/en';

export default function HomePage() {
  return (
    <>
      <header className="mx-auto max-w-content px-4 py-4 lg:px-12">
        <p className="font-bold tracking-wide">{global.siteName}</p>
      </header>
      <main id="main" className="mx-auto max-w-content px-4 py-16 lg:px-12 lg:py-24">
        <h1 className="display">{hero.h1}</h1>
        <p className="lead">{hero.lead}</p>
      </main>
    </>
  );
}
