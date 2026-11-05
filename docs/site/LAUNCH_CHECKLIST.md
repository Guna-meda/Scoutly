# Scoutly site: launch checklist

Run `pnpm check:launch` in `apps/site`. It fails while any `«PH:key»` remains, while `NEXT_PUBLIC_WHATSAPP_NUMBER` is unset, or while `scripts/links-pending.json` is non-empty (it is empty now).

## Placeholders (19) and what the owner must supply

| Key                                                                      | Where it appears                                                                                  | Needed from the owner                                                      |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `whatsapp_number`                                                        | env `NEXT_PUBLIC_WHATSAPP_NUMBER`; every Start on WhatsApp button falls back to `#join` until set | Scoutly WhatsApp number, digits, international format                      |
| `contact_email`                                                          | footer                                                                                            | Public contact address                                                     |
| `legal_entity`                                                           | privacy, terms                                                                                    | Company legal name and registered address                                  |
| `grievance_officer`                                                      | privacy                                                                                           | DPDP grievance officer name and contact                                    |
| `deletion_sla`                                                           | home (control, FAQ 10), privacy, data-deletion                                                    | How fast deletion requests are handled                                     |
| `security_contact`                                                       | security                                                                                          | Responsible-disclosure address                                             |
| `launch_date`                                                            | not rendered yet                                                                                  | Date, only if it should be shown                                           |
| `pricing_headline`, `pricing_plans`, `pricing_price_inr`, `pricing_note` | pricing section (flag `pricing`, off)                                                             | All pricing copy and INR amounts; then turn the flag on                    |
| `analytics_provider`                                                     | cookies page                                                                                      | Cookieless provider and key (then add the loader in `ConsentAnalytics`)    |
| `social_links`                                                           | not rendered yet                                                                                  | Profiles to link, if any                                                   |
| `og_image_copy`                                                          | not used yet (share image uses the H1)                                                            | Final share-image line, if different                                       |
| `verification_method`                                                    | not rendered yet                                                                                  | Confirm how addresses are verified so step 4 of "How it finds" is accurate |
| `retention_period`                                                       | privacy                                                                                           | How long data is kept                                                      |
| `data_processors`                                                        | privacy                                                                                           | Services that process data for Scoutly                                     |
| `governing_law`                                                          | terms                                                                                             | Governing law and courts                                                   |
| `effective_date`                                                         | all legal pages                                                                                   | Effective date                                                             |

## Decisions and setup still open

- Hosting and domain; set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ENV=production` (until then every page is noindex and robots disallows all).
- Waitlist and deletion storage: dev store writes `.data/*.jsonl`. Production needs a real store behind `WaitlistStore` (`src/lib/waitlist-store.ts`). The rate limiter is in memory and per instance; use a shared store when running more than one instance. Set `RATE_LIMIT_SALT`.
- Someone must read the deletion requests and act on them within the promised time.
- Lawyer review of privacy, terms, cookies, consent text and the draft banner (then remove "Draft, pending lawyer review.").
- Analytics choice (default: none).
- WhatsApp brand guidelines if the WhatsApp name or logo is shown in the call to action.
- `src/app/icon.svg` is the favicon and the Organization logo; replace if a final logo exists.

## Final manual pass

- [ ] All gates green: typecheck, lint, test, hex, placeholders, claims, content, build, a11y, links, lighthouse.
- [ ] `LAUNCH=1 pnpm check:launch` passes.
- [ ] Read every page once for the honesty rules: no invented numbers, proof or outcome promises; competitor never named; WhatsApp disclaimer in footer; all sample data tagged SAMPLE.
- [ ] Phone check on a real Android device (360 to 412 wide): stage pins, controls reachable, no clipping.
- [ ] Submit the waitlist and deletion forms end to end, including a duplicate and a rate-limit hit.
- [ ] Cookie preferences: change choice, reload, choice persists; nothing loads without consent.
- [ ] Keyboard pass and a screen-reader pass of home, FAQ and forms.
- [ ] Share preview of `/` renders the Open Graph image.
