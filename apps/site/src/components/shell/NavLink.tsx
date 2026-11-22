'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Header and menu link. Plain page links (/privacy, /terms) get aria-current="page" on that page.
 * Anchors (/#faq) and mailto links never do. Without JS it is an ordinary link.
 */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isMail = href.startsWith('mailto:');
  const isPage = !isMail && !href.includes('#') && href === pathname;
  if (isMail) {
    return (
      <a href={href} className="nav-link">
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className="nav-link" aria-current={isPage ? 'page' : undefined}>
      {label}
    </Link>
  );
}
