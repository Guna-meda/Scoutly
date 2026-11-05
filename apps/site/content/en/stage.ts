import { stageSchema } from './schema';

/** Fictional names used in the sample chat. Tests assert nothing else is used. */
export const SAMPLE_NAMES = ['Aarav', 'Priya', 'Fernway', 'Kite & Loom', 'Northwind Labs'] as const;

/** Sample chat and the three beats. Source: docs/site/CONTENT.md section 3. All data is fictional. */
export const stage = stageSchema.parse({
  device: {
    ariaLabel: 'Sample WhatsApp-style chat, step {n} of 3',
    name: 'Scoutly',
    role: 'talent agent',
    sampleTag: 'Sample',
  },
  beats: [
    {
      label: 'Simple',
      headline: "Send your resume. That's it.",
      caption: 'Drop your resume or tell Scoutly about your work, right on WhatsApp.',
    },
    {
      label: 'Specific',
      headline: 'Startups that fit, with a real reason.',
      caption:
        "Each match shows a source, whether they're hiring, and a fit label with a one-line reason from your own work.",
    },
    {
      label: 'Yours',
      headline: 'Nothing goes out until you say SEND.',
      caption:
        'You see the exact email. Edit it, send it or discard it. It goes from your own Gmail.',
    },
  ],
  simple: {
    fileName: 'aarav_resume.pdf',
    fileTag: 'Sample file',
    reply: "Got it, Aarav. I'm reading your work now.",
    progressLabel: 'Reading your work',
    next: "I'll show you matches first. Nothing gets written until you pick one.",
  },
  specific: {
    intro: '3 matches for you. Sample data, not real companies.',
    whyLabel: 'Why:',
    sourceLabel: 'Source:',
    matches: [
      {
        name: 'Fernway',
        meta: 'Seed · Bengaluru · Hiring: Frontend engineer',
        why: 'you moved a checkout flow onto a component library.',
        source: 'company careers page',
        fit: 'Strong fit',
      },
      {
        name: 'Kite & Loom',
        meta: 'Series A · Remote India · No open role, cold intro',
        why: 'your design-system work matches their public hiring note.',
        source: 'founder blog post',
        fit: 'Good fit',
      },
      {
        name: 'Northwind Labs',
        meta: 'Seed · Pune · Hiring: Product engineer',
        why: 'you shipped features end to end with a small team.',
        source: 'job board listing',
        fit: 'Stretch',
      },
    ],
    outro: "Reply with a number and I'll draft the email.",
  },
  yours: {
    draftHeader: 'Draft for Priya at Fernway · email verified · sample',
    greeting: 'Hi Priya,',
    paragraphs: [
      "I'm Aarav, a frontend engineer. I rebuilt my last team's checkout flow and moved it onto a shared component library.",
      "Your public roadmap says Fernway is taking its product to mobile web next, and I've spent two years on exactly that.",
      'Would a 15-minute call this week make sense? My resume is attached.',
    ],
    signoff: 'Thanks, Aarav',
    quickReplies: { send: 'SEND', edit: 'EDIT', discard: 'DISCARD' },
    sentNote:
      'Sent from your own Gmail. I follow up on day 4 to 5 and day 12 to 14, and stop the moment anyone replies.',
  },
});

export function deviceLabel(step: number): string {
  return stage.device.ariaLabel.replace('{n}', String(step));
}
