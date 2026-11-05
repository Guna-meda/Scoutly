import { ph } from './ph';
import { placeholdersSchema } from './schema';

/** Every key from the placeholder table in docs/site/CONTENT.md. Fill values here. */
export const placeholders = placeholdersSchema.parse({
  whatsapp_number: ph('whatsapp_number'),
  contact_email: ph('contact_email'),
  legal_entity: ph('legal_entity'),
  grievance_officer: ph('grievance_officer'),
  deletion_sla: ph('deletion_sla'),
  security_contact: ph('security_contact'),
  launch_date: ph('launch_date'),
  pricing_headline: ph('pricing_headline'),
  pricing_plans: ph('pricing_plans'),
  pricing_price_inr: ph('pricing_price_inr'),
  pricing_note: ph('pricing_note'),
  analytics_provider: ph('analytics_provider'),
  social_links: ph('social_links'),
  og_image_copy: ph('og_image_copy'),
  verification_method: ph('verification_method'),
  retention_period: ph('retention_period'),
  data_processors: ph('data_processors'),
  governing_law: ph('governing_law'),
  effective_date: ph('effective_date'),
});
