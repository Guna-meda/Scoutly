import { ph } from './ph';

/** Home page copy beyond the hero and stage. Source: docs/site/CONTENT.md sections 1 to 10. */

export const heroExtra = {
  deviceAriaLabel: 'Chat preview that cycles through three steps',
};

export const features = {
  label: 'What Scoutly does',
  items: [
    { label: 'Simple', line: 'Send your resume, or tell Scoutly about your work.' },
    { label: 'Specific', line: 'Matches come with a source and a reason.' },
    { label: 'Yours', line: 'You approve every email before it leaves.' },
  ],
  linkNote: 'See how it works',
} as const;

export const replies = {
  heading: 'Replies come to you',
  notification: 'Priya replied to your note.',
  reply: 'Thanks for writing. Can you send two links to your work?',
  note: 'Follow-ups stop the moment someone replies.',
  deviceLabel: 'Notification and reply',
} as const;

export const find = {
  heading: 'How Scoutly finds the right person',
  steps: [
    { title: 'Your profile.', body: "What you've built and what you want next, confirmed by you." },
    {
      title: 'Public signals.',
      body: 'Hiring pages, funding news, founder posts and roadmaps. Public sources only.',
    },
    { title: 'The person.', body: 'A founder or hiring manager, not a generic inbox.' },
    {
      title: 'A verified email.',
      body: 'Scoutly checks the address before it writes anything.',
    },
    { title: 'Your draft.', body: 'Short, specific, in plain words. You decide.' },
  ],
  note: 'Companies with no open role are included too. Each match says whether the company is hiring or a cold intro.',
  stepLabel: 'Step {n}',
} as const;

export const emailCompare = {
  heading: 'Short and specific beats long and polite.',
  goodLabel: 'Scoutly draft',
  badLabel: 'What we avoid',
  good: [
    'Hi Priya,',
    "I'm Aarav, a frontend engineer. I rebuilt my last team's checkout flow and moved it onto a shared component library.",
    "Your public roadmap says Fernway is taking its product to mobile web next, and I've spent two years on exactly that.",
    'Would a 15-minute call this week make sense? My resume is attached.',
    'Thanks, Aarav',
  ],
  /** Segments of the typical email; `bad` ones are struck through and carry a callout. */
  bad: [
    { text: 'Hi ' },
    { text: '[Name]', bad: 'Placeholder' },
    { text: ', I am writing to express my keen interest in any opportunities at ' },
    { text: 'your esteemed company', bad: 'Generic praise' },
    { text: '. I am a ' },
    {
      text: 'hard-working, passionate team player with excellent communication skills',
      bad: 'No specifics',
    },
    { text: ' and a proven track record. Please find my CV attached. ' },
    {
      text: 'I look forward to hearing from you at your earliest convenience.',
      bad: 'No clear ask',
    },
  ],
  tooLong: 'Too long',
  standard: 'About 60 to 90 words. One clear ask. Only facts you confirmed.',
} as const;

export const control = {
  heading: 'You stay in control.',
  items: [
    {
      title: 'You approve every email.',
      body: 'Nothing goes out unseen. Reply SEND, EDIT or DISCARD.',
    },
    { title: 'It sends from your Gmail.', body: 'Replies come straight to you.' },
    {
      title: 'Public sources only.',
      body: 'No scraping of private data and no LinkedIn scraping.',
    },
    {
      title: 'It stops when it should.',
      body: 'Follow-ups end on a reply, a bounce or an opt-out. At most two follow-ups.',
    },
    {
      title: 'Delete your data.',
      body: 'Ask, and we delete it.',
      note: `Response time: ${ph('deletion_sla')}`,
    },
    { title: 'Nothing invented.', body: 'Every claim comes from facts you confirmed.' },
  ],
  link: { label: 'Read the privacy page', href: '/privacy' },
} as const;

export const pricing = {
  heading: ph('pricing_headline'),
  plans: ph('pricing_plans'),
  price: ph('pricing_price_inr'),
  note: ph('pricing_note'),
} as const;

export const faq = {
  heading: 'Questions',
  items: [
    {
      q: 'Will Scoutly send emails without asking me?',
      a: 'No. You see the exact draft first. Nothing is sent until you reply SEND. You can also EDIT or DISCARD.',
    },
    {
      q: 'Do you scrape LinkedIn?',
      a: 'No. Scoutly uses public sources only and does not scrape LinkedIn or private data.',
    },
    {
      q: 'What if a founder says stop?',
      a: 'Follow-ups stop on any reply, a bounce or an opt-out. Scoutly does not keep nudging.',
    },
    {
      q: 'Which email address does it send from?',
      a: 'Your own Gmail, so replies come to you.',
    },
    {
      q: 'Can I delete my data?',
      a: `Yes. Use the data deletion request page. (Response time: ${ph('deletion_sla')})`,
    },
    {
      q: 'Will this get me an interview or a job?',
      a: "We can't promise that. Scoutly helps you write good emails and reach the right people. Replies are up to them.",
    },
  ],
  toggleLabel: 'Show or hide the answer',
} as const;

export const join = {
  heading: 'Send your resume. See your matches.',
  or: 'Or',
  waitlistHeading: 'Join the waitlist',
  emailLabel: 'Email',
  consentLabel:
    'I agree that Scoutly may email me about launch and early access. See the privacy page.',
  consentLinkText: 'privacy page',
  submit: 'Join the waitlist',
  sending: 'Sending',
  success: "You're on the list.",
  error: "That didn't work. Try again, or start on WhatsApp.",
  rateLimited: 'Too many tries. Please wait a little and try again.',
  invalidEmail: 'Enter a valid email address.',
  consentRequired: 'Please tick the box to continue.',
} as const;

export const deletion = {
  title: 'Data deletion request',
  intro:
    'Ask us to delete the data Scoutly holds about you. We will confirm by email before we delete anything.',
  emailLabel: 'Email you used with Scoutly',
  detailsLabel: 'What should we delete? (optional)',
  consentLabel: 'I confirm this request is about my own data.',
  submit: 'Send deletion request',
  sending: 'Sending',
  success: 'Request received. We will email you to confirm.',
  error: "That didn't work. Please try again.",
  rateLimited: 'Too many tries. Please wait a little and try again.',
  invalidEmail: 'Enter a valid email address.',
  consentRequired: 'Please tick the box to continue.',
  slaLine: `Response time: ${ph('deletion_sla')}`,
} as const;

export const teams = {
  heading: 'We look where startups show up.',
  before: 'Scoutly scans ',
  items: [
    { name: 'Y Combinator', detail: 'New batches and the companies in them.' },
    { name: 'Product Hunt', detail: 'Fresh launches, the day they go live.' },
    { name: 'TechCrunch', detail: 'Funding rounds and launch news.' },
    { name: 'Crunchbase', detail: 'Who raised, how much and when.' },
    { name: 'Wellfound', detail: 'Startup jobs and hiring signals.' },
  ],
  between: [', ', ', ', ', ', ' and '],
  after:
    ', plus funding news, careers pages and literally the rest of the internet, looking for startups that just raised, launched or started hiring.',
  detailLabel: 'About this source',
  tones: ['yellow', 'blue', 'white', 'pink', 'blue'],
} as const;
