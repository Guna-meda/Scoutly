import Link from 'next/link';
import { footer, isPlaceholderValue } from '@content/en';
import { Container } from '../layout/Container';
import { Body, UI } from '../ui/Text';

export function Footer() {
  const contactIsPlaceholder = isPlaceholderValue(footer.contactValue);
  return (
    <footer className="site-footer" data-inert-when-menu>
      <Container className="flex flex-col gap-6">
        <nav aria-label={footer.legalLabel}>
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
        <Body as="p">
          {footer.contactLabel}:{' '}
          {contactIsPlaceholder ? (
            <span data-placeholder="true">{footer.contactValue}</span>
          ) : (
            <a className="footer-link" href={`mailto:${footer.contactValue}`}>
              {footer.contactValue}
            </a>
          )}
        </Body>
        <UI as="p">{footer.languageNote}</UI>
        <UI as="p">{footer.disclaimer}</UI>
      </Container>
    </footer>
  );
}
