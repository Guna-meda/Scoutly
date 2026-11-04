import { heroSchema } from './schema';

export const hero = heroSchema.parse({
  eyebrow: 'A talent agent on WhatsApp',
  h1: 'Find the startup. Write the email. You press SEND.',
  lead: 'Scoutly finds early-stage startups that fit you, finds the right person to write to, and drafts a short email from your own work. Nothing goes out until you reply SEND.',
  button: 'Start on WhatsApp',
  smallLine: 'No emails sent without your SEND.',
});
