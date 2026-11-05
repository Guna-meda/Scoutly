'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Mark } from '../ui/Mark';

type Props = {
  label: string;
  helpLabel: string;
  href: string;
  isPlaceholder: boolean;
};

/**
 * Floating "Start on WhatsApp" pill plus the help bubble. The pill slides away and becomes inert
 * while an element with id="join" is on screen; with no #join on the page it stays.
 */
export function FloatingCta({ label, helpLabel, href, isPlaceholder }: Props) {
  const [away, setAway] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const target = document.getElementById('join');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setAway(Boolean(entry?.isIntersecting)));
    observer.observe(target);
    return () => {
      observer.disconnect();
      setAway(false);
    };
  }, [pathname]);

  return (
    <>
      <div
        className="fab-pill"
        data-inert-when-menu
        data-away={away ? 'true' : 'false'}
        inert={away}
      >
        <Button
          href={href}
          size="lg"
          icon={<Mark size={28} />}
          data-placeholder={isPlaceholder ? 'true' : undefined}
        >
          {label}
        </Button>
      </div>
      <Link href="/#faq" className="fab-help on-ink" aria-label={helpLabel} data-inert-when-menu>
        <Icon name="chat-bubble" />
      </Link>
    </>
  );
}
