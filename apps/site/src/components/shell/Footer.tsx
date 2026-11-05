import Link from 'next/link';
import { footer, global, isPlaceholderValue } from '@content/en';
import { Container } from '../layout/Container';
import { Mark } from '../ui/Mark';

/** Ink footer: brand, three link columns (explore, legal, contact) and the disclaimer row. */
export function Footer() {
  const contactIsPlaceholder = isPlaceholderValue(footer.contactValue);
  return (
    <footer className="site-footer" data-inert-when-menu>
      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label={global.homeLinkLabel}>
              <Mark size={32} />
              <span>{global.siteName}</span>
            </Link>
            <p className="footer-tagline">{footer.tagline}</p>
          </div>

          <nav aria-label={footer.exploreLabel} className="footer-col">
            <h2 className="footer-heading">{footer.exploreLabel}</h2>
            <ul className="footer-links">
              {footer.exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footer.legalLabel} className="footer-col">
            <h2 className="footer-heading">{footer.legalLabel}</h2>
            <ul className="footer-links">
              {footer.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-heading">{footer.contactLabel}</h2>
            <p className="footer-contact">
              {contactIsPlaceholder ? (
                <span data-placeholder="true">{footer.contactValue}</span>
              ) : (
                <a className="footer-link" href={`mailto:${footer.contactValue}`}>
                  {footer.contactValue}
                </a>
              )}
            </p>
            <p className="footer-note">{footer.languageNote}</p>
          </div>
        </div>

        <p className="footer-disclaimer">{footer.disclaimer}</p>
      </Container>
    </footer>
  );
}
