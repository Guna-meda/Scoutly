import { flagsSchema } from './schema';

export const flags = flagsSchema.parse({
  pricing: false,
  repliesBeat: true,
  waitlist: true,
});
