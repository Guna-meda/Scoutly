export interface WhatsAppLink {
  href: string;
  /** True when the number is missing or invalid; the button then falls back to #join. */
  isPlaceholder: boolean;
}

const FALLBACK_HREF = '#join';

/**
 * Builds https://wa.me/<digits>?text=Hi. Accepts digits with an optional leading "+", spaces,
 * dashes and parentheses. Anything else (unset, empty, a «PH:» marker, too short or long) returns
 * the #join fallback flagged as a placeholder.
 */
export function buildWhatsAppHref(raw: string | undefined | null): WhatsAppLink {
  const digits = (raw ?? '')
    .trim()
    .replace(/^\+/, '')
    .replace(/[\s\-()]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(digits)) return { href: FALLBACK_HREF, isPlaceholder: true };
  return { href: `https://wa.me/${digits}?text=${encodeURIComponent('Hi')}`, isPlaceholder: false };
}

export function getWhatsAppLink(): WhatsAppLink {
  return buildWhatsAppHref(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
}
