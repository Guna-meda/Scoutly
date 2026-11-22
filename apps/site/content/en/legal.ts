import { CONTACT_EMAIL } from './contact';
import { ph } from './ph';

/**
 * Plain-language drafts that describe only what the product does (docs/site/CONTENT.md).
 * Legal specifics are placeholders for the owner and a lawyer. Never invent them here.
 */
export type LegalLink = { label: string; href: string };
export type LegalBody = {
  paragraphs?: string[];
  bullets?: string[];
  /** Links shown after the text. External links open in the same tab. */
  links?: LegalLink[];
};
export type LegalSection = LegalBody & {
  heading: string;
  /** Anchor id, so other pages can link to the section. */
  id?: string;
  subsections?: (LegalBody & { heading: string })[];
};
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
  description:
    'What Scoutly collects, how it uses your Google user data, and how you can delete it.',
  intro:
    'This page explains in plain words what data Scoutly uses and the choices you have. It is written with India’s Digital Personal Data Protection Act in mind.',
  sections: [
    { heading: 'What Scoutly does', bullets: whatWeDo },
    {
      heading: 'What we collect',
      bullets: [
        'What you send us on WhatsApp: your resume, your messages and the work details you confirm.',
        'Your email address and the Gmail connection you approve, so emails can go from your own account.',
        'Links you share, such as a portfolio or LinkedIn page: we read the public details on that page to build your profile.',
        'For the waitlist: your email address, the consent text you saw and the time you agreed.',
      ],
    },
    {
      heading: 'Google user data',
      id: 'google-user-data',
      paragraphs: [
        'Scoutly’s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.',
        'This section covers what we receive from your Google Account when you connect Gmail. You connect Gmail only when you choose to.',
      ],
      links: [
        {
          label: 'Google API Services User Data Policy',
          href: 'https://developers.google.com/terms/api-services-user-data-policy',
        },
      ],
      subsections: [
        {
          heading: 'What Google user data we access',
          paragraphs: ['Scoutly asks Google for two permissions.'],
          bullets: [
            'Send email from your account (technical name: gmail.send). Used by the feature that sends the emails you approved with SEND, from your own Gmail, and the follow-ups described above. It is needed because the email must go from your address.',
            'Read-only access to Gmail (technical name: gmail.readonly). Scoutly uses it only on the email threads Scoutly itself sent. Used by the features that stop follow-ups and tell you about replies: it shows when someone replies, an email bounces or someone opts out. It is also how Scoutly checks whether a send went out after a crash, so it does not send twice or miss one.',
            'Scoutly does not read any other mail. Google offers this permission as read-only access to Gmail as a whole, so the limit to threads Scoutly sent is a rule Scoutly follows in how it uses the access.',
          ],
        },
        {
          heading: 'How we use it',
          bullets: [
            'To send the emails you approved.',
            'To see replies, bounces and opt-outs in the threads Scoutly sent, and stop follow-ups when they happen.',
            'To tell you on WhatsApp when someone replies.',
            'For nothing else.',
          ],
        },
        {
          heading: 'How it is stored and protected',
          paragraphs: [
            'Your Gmail connection token is stored encrypted.',
            `Other storage and protection details: ${ph('gmail_storage_details')}.`,
          ],
        },
        {
          heading: 'Who receives it',
          paragraphs: [
            `Services that process data for Scoutly: ${ph('data_processors')}.`,
            `Reply text goes to our language model provider: ${ph('reply_text_to_llm_provider')}. If yes, it is used only to classify replies for your own account.`,
            'We do not sell Google user data and we do not share it for advertising.',
          ],
        },
        {
          heading: 'What we never do with it',
          bullets: [
            'We do not use Gmail data for advertising, and we do not sell it.',
            'We do not use Gmail data to train generalized machine-learning models.',
            'No person at Scoutly reads your Gmail data, except with your agreement for specific data, for security, to follow the law, or in aggregated internal operations that are not tied to you.',
          ],
        },
        {
          heading: 'How long we keep it, and deletion',
          paragraphs: [
            `Retention period: ${ph('retention_period')}.`,
            `You can ask us to delete your data at any time using the data deletion request page. Deletion requests are answered within: ${ph('deletion_sla')}.`,
          ],
        },
        {
          heading: 'How to disconnect Gmail',
          bullets: [
            'In your WhatsApp chat with Scoutly, send DISCONNECT.',
            'Or remove Scoutly in your Google Account permissions page.',
          ],
          links: [
            {
              label: 'Google Account permissions page',
              href: 'https://myaccount.google.com/permissions',
            },
          ],
        },
        {
          heading: 'What happens after you disconnect',
          paragraphs: [
            `Scoutly can no longer send from or read your Gmail. Data Scoutly already stored is kept for the retention period above unless you ask us to delete it sooner using the data deletion request page. Retention: ${ph('retention_period')}.`,
          ],
        },
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
        'Public information only. Scoutly does not read private data.',
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
        `Contact: ${CONTACT_EMAIL}.`,
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
  revokeHeading: 'First, you can disconnect Gmail yourself',
  revokeIntro: 'There are two ways to take back Gmail access right now, without waiting for us:',
  revokeSteps: [
    'In your WhatsApp chat with Scoutly, send DISCONNECT.',
    'Or open your Google Account permissions page and remove Scoutly.',
  ],
  revokeLink: {
    label: 'Google Account permissions page',
    href: 'https://myaccount.google.com/permissions',
  },
  deletedHeading: 'What we delete',
  deletedIntro:
    'When we act on a deletion request, we delete the data we hold about you that is listed under “What we collect” in the privacy policy:',
  deletedItems: [
    'Your resume, your WhatsApp messages and the work details you confirmed.',
    'Your email address and the stored Gmail connection.',
    'Any waitlist record: your email address, the consent text you saw and the time you agreed.',
  ],
  deletedNote:
    'Disconnecting Gmail stops Scoutly from sending and reading. It does not delete stored data by itself. Send a request below for that.',
  formHeading: 'Request deletion',
};
