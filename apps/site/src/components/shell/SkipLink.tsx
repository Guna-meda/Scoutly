import { global } from '@content/en';

export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      {global.skipToContent}
    </a>
  );
}
