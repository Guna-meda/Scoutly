# Google verification prep: final report (2026-11-22)

Branch work, not pushed, not deployed. Companion guide: `GOOGLE_VERIFICATION.md`.

## What changed, by file (`apps/site` unless noted)

**A. Navbar**
- `content/en/schema.ts`, `content/en/global.ts`: nav labels are now How it works, FAQ, Privacy, Terms, Contact.
- `content/en/nav.ts`: five items; Contact is `mailto:` the contact email (from `content/en/contact.ts`).
- `src/components/shell/NavLink.tsx` (new), `Header.tsx`: shared by the header and the phone menu; current page gets `aria-current="page"`.
- `src/styles/components.css`: active-page style. `MobileMenu.tsx` unchanged (it already works on whatever links the panel holds).
- `scripts/links-pending.json`: unchanged and still empty: every nav target exists (`#how-it-works`, `#faq`, `/privacy`, `/terms`), and mailto is not crawled.
- Tests: `content/en/content.test.ts` (nav list), `e2e/menu-and-overflow.spec.ts` (desktop and phone menu items, active page). No existing test or spec depended on the old three items.

**B. Home**: `content/en/home.ts` (`gmail`), `HomeSections.tsx` (`GmailSection`), `src/app/page.tsx` (placed right after the stage), `sections.css`. Visible body link to `/privacy#google-user-data`.

**C. Privacy**: `content/en/legal.ts`: new "Google user data" section with the Limited Use statement and link first, then subsections. `LegalPage.tsx` renders subsections, links, section anchors and marks placeholders inside bullets. Two new placeholders (see below) in `schema.ts`, `placeholders.ts`.

**D. False claims**: see list below. `scripts/check-claims.ts` now bans `scrap*` and "no/not ... LinkedIn" wording (tests are exempt); `claims-allowlist.json` stays empty with a note. Nothing in the old scripts or allowlist required the old claims.

**E.** `src/app/data-deletion/page.tsx`, `legal.ts` (`dataDeletionPage`): two ways to revoke Gmail access, then what is deleted, then the form. `/terms` has no placeholders the owner values could fill (all owner values are blank).

**F.** `public/scoutly-logo-120.png`, `public/scoutly-logo-512.png` (rendered from `src/app/icon.svg`); `src/lib/jsonld.ts` Organization logo now points to the 512 PNG.

**G, docs**: `GOOGLE_VERIFICATION.md` (new); `CONTENT.md`, `PAGES.md`, `LAUNCH_CHECKLIST.md` synced.

### Removed or changed strings (D)
| Where | Before | After |
|---|---|---|
| `home.ts` control item 3 title | Public sources only. | Public information only. |
| `home.ts` control item 3 body | No scraping of private data and no LinkedIn scraping. | Scoutly does not read private data. |
| `home.ts` FAQ | "Do you scrape LinkedIn?" with its answer | Deleted (FAQ is now five questions) |
| `legal.ts` privacy, What we do not do | We do not scrape LinkedIn or private data. | Public information only. Scoutly does not read private data. |
| `legal.ts` privacy, What we collect | (none) | Added: Links you share, such as a portfolio or LinkedIn page: we read the public details on that page to build your profile. |
| `legal.ts` privacy description | What Scoutly collects, why, and how you can delete it. | What Scoutly collects, how it uses your Google user data, and how you can delete it. |
| `docs/site/CONTENT.md` | Same old claims and FAQ item | Updated |

Searched the whole app, check scripts and allowlist for "LinkedIn" and "scrap": only the files above matched. "Public sources only" remains in `legal.ts` (`whatWeDo`, shown on privacy and terms) and the Security page ("We use public sources only.") and the "How it finds" copy: these are the true statement the task asked to keep, not LinkedIn claims.

## Checks run (in `apps/site`)
- typecheck, lint (eslint and prettier), test (88 pass), check:hex, check:claims, check:content (1 pre-existing warning, "Company" honeypot label in `SubmitForm.tsx`), build: all pass.
- check:links: 0 internal broken. 11 external warnings: `localhost:3000` canonical links (from the dev default site URL) and the two Google URLs, which this sandbox cannot reach.
- e2e (a11y, menu, device, stage): 50 pass, **1 fails: `a11y home @1280 motion=no-preference`** (color-contrast 3.87 on `.feature-line`, text inside a feature card caught mid scroll-driven fade). It fails identically on the commit before my changes, so I did not cause it and did not touch the animation. Needs an owner or designer decision (for example, make the row's text contrast hold at 0% animation progress).
- The sandbox's Playwright browser did not match the pinned version, so e2e ran against `/opt/pw-browsers/chromium` through a temporary config outside the repo.
- Not run: `pnpm lighthouse`, `check:launch` (it fails by design while placeholders remain).
- F, checked on a production build with `NEXT_PUBLIC_ENV=production` and a test `NEXT_PUBLIC_SITE_URL`: `/`, `/privacy`, `/terms` return 200 with no redirect, `robots` is `index, follow`, canonical is correct, all three are in `sitemap.xml`, `robots.txt` allows all. Titles are `Scoutly`, `Scoutly: Privacy`, `Scoutly: Terms`. The real production URL is not set.

## Open placeholders (OWNER VALUES still missing)
- `legal_entity` and registered address (privacy, terms; the address has no separate field yet: add one when supplied)
- `grievance_officer` (name and email)
- `deletion_sla` (home FAQ, privacy, data deletion)
- `retention_period` (privacy, three places)
- `data_processors` (privacy, twice)
- `reply_text_to_llm_provider` (new, yes or no). When supplied, replace the sentence in privacy "Who receives it". If yes: "Reply text goes to our language model provider. It is used only to classify replies for your own account." If no: remove the sentence.
- `gmail_storage_details` (new): storage and protection beyond "the token is stored encrypted"
- `governing_law` (terms)
- `effective_date` (all legal pages)
- `security_contact` (security page)
- `whatsapp_number`: not set, so every Start on WhatsApp button falls back to `#join`
- Older placeholders unaffected by this task: `launch_date`, `pricing_*`, `analytics_provider`, `social_links`, `og_image_copy`, `verification_method`.
- Also not supplied: support/contact email. The site already shows `meda.gunavathi25@gmail.com` (`content/en/contact.ts`), described there as owner-supplied; I used it for the Contact link. Confirm it.
- `NEXT_PUBLIC_SITE_URL` and the production domain.

## Claims the owner must confirm
1. "Public information only. Scoutly does not read private data." Scoutly does read the Gmail threads it sent (with permission) and a profile a user links. Make sure this wording is accurate in context, or narrow it.
2. "Links you share ... we read the public details on that page to build your profile": confirm it matches what the product does, including company LinkedIn pages.
3. The Limited Use statement: could not be fetched here. Compare it with Google's live API Services User Data Policy.
4. "No person at Scoutly reads your Gmail data, except with your agreement, for security, to follow the law, or in aggregated internal operations", and "does not train generalized machine-learning models": these are policy commitments taken from the task text. The product and company must really operate that way.
5. "We do not share it for advertising / do not sell", the list of who receives data, and the reply-text answer.
6. "The Gmail connection token is stored encrypted": confirm in code.
7. After disconnecting: "Scoutly can no longer send from or read your Gmail" and data is kept for the retention period unless deleted sooner. Confirm DISCONNECT really revokes the token.
8. "What we delete" on the data deletion page lists the categories from "What we collect". Confirm that logs, backups and processors are covered, and say if anything must be kept by law.
9. Read-only access: the page says Scoutly uses it only on threads it sent, and says plainly that Google's permission is mailbox-wide. Confirm the code only fetches threads it created.
10. The whole privacy page for DPDP: grievance officer, retention and consent wording.

## Other things the owner needs to know
- The deletion form writes to a local file store (`.data/*.jsonl`) and a person must act on requests. It needs a production store (`WaitlistStore` in `src/lib/waitlist-store.ts`) and someone to act within the promised time. I did not build this.
- `gmail.readonly` is a restricted scope: the public launch needs Google's security assessment (see `GOOGLE_VERIFICATION.md`, section 5).
- The phone menu was checked by e2e (keyboard, Esc, focus return, same five items), not on a real device or screen reader.
