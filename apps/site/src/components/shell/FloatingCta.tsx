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
  const [helpAway, setHelpAway] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const join = document.getElementById('join');
    // On phones the pinned stage needs the room; the header already carries the call to action.
    const stage = document.querySelector('.stage-pin');
    const phone = window.matchMedia('(max-width: 1023.98px)');
    let joinOn = false;
    let stageOn = false;
    let footerOn = false;
    const footer = document.querySelector('.site-footer');
    const update = () => {
      const onStage = stageOn && phone.matches;
      setAway(joinOn || onStage || footerOn);
      setHelpAway(onStage || footerOn);
    };
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === join) joinOn = e.isIntersecting;
        else if (e.target === footer) footerOn = e.isIntersecting;
        else stageOn = e.isIntersecting;
      }
      update();
    });
    if (join) observer.observe(join);
    if (stage) observer.observe(stage);
    if (footer) observer.observe(footer);
    phone.addEventListener('change', update);
    return () => {
      observer.disconnect();
      phone.removeEventListener('change', update);
      setAway(false);
      setHelpAway(false);
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
      <Link
        href="/#faq"
        className="fab-help on-ink"
        aria-label={helpLabel}
        data-inert-when-menu
        data-away={helpAway ? 'true' : 'false'}
        tabIndex={helpAway ? -1 : undefined}
        aria-hidden={helpAway ? true : undefined}
      >
        <Icon name="chat-bubble" />
      </Link>
    </>
  );
}
