import { ph } from './ph';

/**
 * Plain-language drafts that describe only what the product does (docs/site/CONTENT.md).
 * Legal specifics are placeholders for the owner and a lawyer. Never invent them here.
 */
export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

export const legalCommon = {
  banner: 'Draft, pending lawyer review.',
  effectiveLabel: 'Effective date',
  effective: ph('effective_date'),
  backHome: 'Back to home',
};

const whatWeDo = [
  'You chat with Scoutly on WhatsApp. You send your resume or tell Scoutly about your work.',
  'Scoutly finds early-stage startups that fit you, using public sources only, and finds the right person to write to.',
  'Scoutly drafts a short email from facts you confirmed. Nothing is sent until you reply SEND. You can also EDIT or DISCARD.',
  'Emails are sent from your own Gmail. Follow-ups stop on a reply, a bounce or an opt-out, and there are at most two.',
];

export const privacy: LegalDoc = {
  title: 'Privacy',
  description: 'What Scoutly collects, why, and how you can delete it.',
  intro:
    'This page explains in plain words what data Scoutly uses and the choices you have. It is written with India’s Digital Personal Data Protection Act in mind.',
  sections: [
    { heading: 'What Scoutly does', bullets: whatWeDo },
    {
      heading: 'What we collect',
      bullets: [
        'What you send us on WhatsApp: your resume, your messages and the work details you confirm.',
        'Your email address and the Gmail connection you approve, so emails can go from your own account.',
        'For the waitlist: your email address, the consent text you saw and the time you agreed.',
      ],
    },
    {
      heading: 'What we use it for',
      bullets: [
        'To find startups that fit you and to draft emails you approve.',
        'To keep follow-ups on the right thread and stop them when they should stop.',
        'To email you about launch and early access, only if you joined the waitlist.',
      ],
    },
    {
      heading: 'What we do not do',
      bullets: [
        'We do not send anything without your SEND.',
        'We do not scrape LinkedIn or private data.',
        'We do not invent facts about you.',
        'We do not sell your data. We load no advertising or tracking before you agree.',
      ],
    },
    {
      heading: 'Who handles your data',
      paragraphs: [`Services that process data for Scoutly: ${ph('data_processors')}.`],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [`Retention period: ${ph('retention_period')}.`],
    },
    {
      heading: 'Your choices',
      bullets: [
        'Ask us to delete your data at any time using the data deletion request page.',
        'Change your cookie and analytics choice on the cookie preferences page.',
        'Ask questions or raise a complaint with our grievance officer.',
      ],
    },
    {
      heading: 'Who we are and how to reach us',
      paragraphs: [
        `Operator: ${ph('legal_entity')}.`,
        `Grievance officer: ${ph('grievance_officer')}.`,
        `Contact: ${ph('contact_email')}.`,
        `Deletion requests are answered within: ${ph('deletion_sla')}.`,
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: 'Terms',
  description: 'The terms for using Scoutly.',
  intro: 'These terms describe how Scoutly works and what we expect from each other.',
  sections: [
    { heading: 'What Scoutly is', bullets: whatWeDo },
    {
      heading: 'Your part',
      bullets: [
        'Give us true facts about yourself. Emails are drafted only from what you confirm.',
        'Read each draft. You decide whether to SEND, EDIT or DISCARD it.',
        'Use Scoutly for your own job search, not for spam.',
      ],
    },
    {
      heading: 'No promises about outcomes',
      paragraphs: [
        'We cannot promise interviews, jobs or replies. Scoutly helps you write good emails and reach the right people. Replies are up to them.',
      ],
    },
    {
      heading: 'WhatsApp and Meta',
      paragraphs: [
        'Scoutly is not affiliated with WhatsApp or Meta. You chat with it on WhatsApp.',
      ],
    },
    {
      heading: 'Stopping',
      paragraphs: [
        'You can stop at any time. You can also ask us to delete your data using the data deletion request page.',
      ],
    },
    {
      heading: 'The legal details',
      paragraphs: [
        `Operator: ${ph('legal_entity')}.`,
        `Governing law and courts: ${ph('governing_law')}.`,
      ],
    },
  ],
};

export const security: LegalDoc = {
  title: 'Security',
  description: 'How to report a security problem.',
  intro:
    'If you find a security problem in Scoutly or this site, please tell us first so we can fix it.',
  sections: [
    {
      heading: 'Report a problem',
      paragraphs: [
        `Write to ${ph('security_contact')} with what you found and how to reproduce it.`,
        'Please give us reasonable time to fix it before sharing details publicly.',
      ],
    },
    {
      heading: 'What helps',
      bullets: [
        'Do not access, change or delete other people’s data.',
        'Do not run attacks that slow the service down for others.',
        'Tell us the page or step where it happens.',
      ],
    },
    {
      heading: 'How we handle your data',
      bullets: [
        'Emails go from your own Gmail, and only after you reply SEND.',
        'We use public sources only.',
        'You can ask us to delete your data at any time.',
      ],
    },
  ],
};

export const cookies = {
  title: 'Cookie preferences',
  description: 'See and change your cookie and analytics choice.',
  intro:
    'This site sets no advertising or tracking cookies. Optional, privacy-friendly analytics load only if you agree, and only once a provider is set up.',
  stateLabel: 'Your choice now:',
  states: {
    granted: 'Analytics allowed',
    denied: 'Analytics declined',
    unset: 'No choice yet (nothing optional is loaded)',
  },
  accept: 'Allow analytics',
  decline: 'Decline analytics',
  saved: 'Saved on this device.',
  storageNote: 'Your choice is stored in this browser only.',
  providerLine: `Analytics provider: ${ph('analytics_provider')}.`,
  unavailable: 'Your browser does not allow saving this choice. Nothing optional is loaded.',
};

export const dataDeletionPage = {
  description: 'Ask Scoutly to delete your data.',
};
