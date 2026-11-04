import { z } from 'zod';

export const placeholderKeys = [
  'whatsapp_number',
  'contact_email',
  'legal_entity',
  'grievance_officer',
  'deletion_sla',
  'security_contact',
  'launch_date',
  'pricing_headline',
  'pricing_plans',
  'pricing_price_inr',
  'pricing_note',
  'analytics_provider',
  'social_links',
  'og_image_copy',
  'verification_method',
] as const;

export type PlaceholderKey = (typeof placeholderKeys)[number];

const nonEmpty = z.string().min(1);

export const globalSchema = z.object({
  siteName: nonEmpty,
  primaryButton: nonEmpty,
  secondaryButton: nonEmpty,
  nav: z.object({ howItWorks: nonEmpty, privacy: nonEmpty, faq: nonEmpty }),
  skipToContent: nonEmpty,
  footerDisclaimer: nonEmpty,
  notFound: z.object({ title: nonEmpty, body: nonEmpty, homeLink: nonEmpty }),
});
export type GlobalContent = z.infer<typeof globalSchema>;

export const heroSchema = z.object({
  eyebrow: nonEmpty,
  h1: nonEmpty,
  lead: nonEmpty,
  button: nonEmpty,
  smallLine: nonEmpty,
});
export type HeroContent = z.infer<typeof heroSchema>;

export const flagsSchema = z.object({
  pricing: z.boolean(),
  repliesBeat: z.boolean(),
  waitlist: z.boolean(),
});
export type Flags = z.infer<typeof flagsSchema>;

export const placeholdersSchema = z.object({
  whatsapp_number: nonEmpty,
  contact_email: nonEmpty,
  legal_entity: nonEmpty,
  grievance_officer: nonEmpty,
  deletion_sla: nonEmpty,
  security_contact: nonEmpty,
  launch_date: nonEmpty,
  pricing_headline: nonEmpty,
  pricing_plans: nonEmpty,
  pricing_price_inr: nonEmpty,
  pricing_note: nonEmpty,
  analytics_provider: nonEmpty,
  social_links: nonEmpty,
  og_image_copy: nonEmpty,
  verification_method: nonEmpty,
});
