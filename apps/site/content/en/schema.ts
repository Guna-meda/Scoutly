import { z } from 'zod';

export const placeholderKeys = [
  'whatsapp_number',
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
  'retention_period',
  'data_processors',
  'governing_law',
  'effective_date',
] as const;

export type PlaceholderKey = (typeof placeholderKeys)[number];

const nonEmpty = z.string().min(1);

export const globalSchema = z.object({
  siteName: nonEmpty,
  homeLinkLabel: nonEmpty,
  primaryButton: nonEmpty,
  secondaryButton: nonEmpty,
  nav: z.object({ howItWorks: nonEmpty, privacy: nonEmpty, faq: nonEmpty }),
  mainNavLabel: nonEmpty,
  menu: z.object({ label: nonEmpty, panelLabel: nonEmpty }),
  helpLabel: nonEmpty,
  sampleTag: nonEmpty,
  skipToContent: nonEmpty,
  footerDisclaimer: nonEmpty,
  notFound: z.object({ title: nonEmpty, body: nonEmpty, homeLink: nonEmpty }),
});
export type GlobalContent = z.infer<typeof globalSchema>;

const link = z.object({ label: nonEmpty, href: nonEmpty });

export const navSchema = z.object({
  items: z.array(link).min(1),
});
export type NavContent = z.infer<typeof navSchema>;

export const footerSchema = z.object({
  tagline: nonEmpty,
  exploreLabel: nonEmpty,
  exploreLinks: z.array(link).min(1),
  legalLabel: nonEmpty,
  legalLinks: z.array(link).min(1),
  contactLabel: nonEmpty,
  contactValue: nonEmpty,
  languageNote: nonEmpty,
  disclaimer: nonEmpty,
});
export type FooterContent = z.infer<typeof footerSchema>;

export const styleguideSchema = z.object({
  title: nonEmpty,
  intro: nonEmpty,
  sections: z.record(z.string(), nonEmpty),
  sample: nonEmpty,
  buttonLabels: z.object({
    primary: nonEmpty,
    secondary: nonEmpty,
    disabled: nonEmpty,
    loading: nonEmpty,
    link: nonEmpty,
  }),
  fitLabels: z.object({ strong: nonEmpty, good: nonEmpty, stretch: nonEmpty }),
  typeSamples: z.object({
    display: nonEmpty,
    h2: nonEmpty,
    h3: nonEmpty,
    bodyL: nonEmpty,
    body: nonEmpty,
    ui: nonEmpty,
    label: nonEmpty,
    muted: nonEmpty,
  }),
  joinTarget: nonEmpty,
});
export type StyleguideContent = z.infer<typeof styleguideSchema>;

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
  retention_period: nonEmpty,
  data_processors: nonEmpty,
  governing_law: nonEmpty,
  effective_date: nonEmpty,
});

const match = z.object({
  name: nonEmpty,
  meta: nonEmpty,
  why: nonEmpty,
  source: nonEmpty,
  fit: nonEmpty,
});

export const stageSchema = z.object({
  device: z.object({
    ariaLabel: nonEmpty, // contains {n}
    name: nonEmpty,
    role: nonEmpty,
  }),
  beats: z.array(z.object({ label: nonEmpty, headline: nonEmpty, caption: nonEmpty })).length(3),
  ui: z.object({
    heading: nonEmpty,
    stepOf: nonEmpty,
    announce: nonEmpty,
    prev: nonEmpty,
    next: nonEmpty,
    goTo: nonEmpty,
    controls: nonEmpty,
  }),
  simple: z.object({
    fileName: nonEmpty,
    reply: nonEmpty,
    progressLabel: nonEmpty,
    next: nonEmpty,
  }),
  specific: z.object({
    intro: nonEmpty,
    whyLabel: nonEmpty,
    sourceLabel: nonEmpty,
    matches: z.array(match).length(3),
    outro: nonEmpty,
  }),
  yours: z.object({
    draftHeader: nonEmpty,
    greeting: nonEmpty,
    paragraphs: z.array(nonEmpty).length(3),
    signoff: nonEmpty,
    quickReplies: z.object({ send: nonEmpty, edit: nonEmpty, discard: nonEmpty }),
    sentNote: nonEmpty,
  }),
});
export type StageContent = z.infer<typeof stageSchema>;
