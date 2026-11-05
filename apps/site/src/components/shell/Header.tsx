import Link from 'next/link';
import { global, nav } from '@content/en';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Mark } from '../ui/Mark';

/**
 * Sticky top bar. Server-rendered. Behaviour (hide on scroll down) lives in HeaderBehavior and the
 * menu enhancement in MobileMenu; without JS the bar is always visible and the menu is a native
 * <details>/<summary> disclosure.
 */
export function Header() {
  const wa = getWhatsAppLink();
  const links = nav.items.map((item) => (
    <li key={item.href}>
      <Link href={item.href} className="nav-link">
        {item.label}
      </Link>
    </li>
  ));
  const cta = (className?: string) => (
    <Button
      href={wa.href}
      className={className}
      data-placeholder={wa.isPlaceholder ? 'true' : undefined}
    >
      {global.primaryButton}
    </Button>
  );

  return (
    <header id="site-header" className="site-header">
      <Container className="header-inner">
        <Link href="/" className="brand" aria-label={global.homeLinkLabel}>
          <Mark size={28} />
          <span aria-hidden="true">{global.siteName}</span>
        </Link>

        <nav aria-label={global.mainNavLabel} className="nav-inline">
          <ul>{links}</ul>
        </nav>

        <div className="flex items-center gap-3">
          {cta('header-cta')}
          <details id="mobile-menu" className="menu">
            <summary aria-label={global.menu.label}>
              <Icon name="menu" className="menu-icon-open" />
              <Icon name="plus" className="menu-icon-close" />
            </summary>
            <div className="menu-panel">
              <nav aria-label={global.mainNavLabel}>
                <ul>{links}</ul>
              </nav>
              {cta()}
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
