# Scoutly site: pages, routes and wiring

Next.js App Router, TypeScript strict, static prerender for every page by default. Only the waitlist API route needs a server runtime. Workspace: `apps/site` in the pnpm monorepo. It imports nothing from `packages/core` or `packages/ai`.

## 1. Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Sections 1 to 11 below |
| `/privacy` | Privacy policy | DPDP-aware. Draft, pending lawyer review |
| `/terms` | Terms | Draft, pending lawyer review |
| `/cookies` | Cookie preferences | Shows the consent state and lets users change it |
| `/data-deletion` | Data deletion request | Form (email, what to delete). Same API protections as the waitlist |
| `/security` | Security and responsible disclosure | Contact `«PH:security_contact»` |
| `/api/waitlist` | POST only | See section 4 |
| `/not-found` | 404 | Friendly, with a link home and the WhatsApp button |
| `/sitemap.xml`, `/robots.txt` | Generated | Production indexable; staging `noindex` |

Legal pages carry a visible banner: "Draft, pending lawyer review." Do not present them as final.

## 2. Home page sections (order)

1. **Top bar**: mark, How it works, Privacy, FAQ, Start on WhatsApp. Sticky, never overlaps the stage. Hides on scroll down, returns on scroll up.
2. **Hero**: H1, lead, primary button, "No emails sent without your SEND", looping sample device.
3. **Feature row**: Simple, Specific, Yours. Each card is a link that jumps to its beat.
4. **Pinned stage**: see MOTION.md and DESIGN_SYSTEM.md section 7.
5. **Replies come to you** (optional, flag `repliesBeat`, default on).
6. **How Scoutly finds the right person**: sticky heading plus five steps.
7. **What an email looks like**: good against typical.
8. **You stay in control**: six items, link to Privacy.
9. **Pricing**: behind flag `pricing`, default off.
10. **FAQ**: 12 questions, `FAQPage` structured data.
11. **Closing call, waitlist and footer**.

Anchors: `#how-it-works` (stage), `#find`, `#email`, `#control`, `#faq`, `#join`.

## 3. Content, flags and config

- Content: `apps/site/content/en/*.ts`, typed with a schema (zod). One file per section plus `global.ts`, `faq.ts`, `legal/*.ts`, `placeholders.ts`. Locale folders later (`content/hi/`). Components never contain user-facing strings.
- Feature flags in `content/flags.ts` or env: `pricing` (false), `repliesBeat` (true), `waitlist` (true).
- Env vars (`.env.example` documented, never commit real values):
  - `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, international format, **placeholder until owner supplies**)
  - `NEXT_PUBLIC_SITE_URL`
  - `WAITLIST_STORE` (how submissions are stored, decided in W05)
  - `RATE_LIMIT_SALT`
  - `ANALYTICS_*` (provider key, only loaded after consent)
- WhatsApp link builder: `https://wa.me/<number>?text=Hi` with the text URL-encoded. If the number is a placeholder, the button renders but is marked and `check:launch` fails.

## 4. Waitlist and deletion-request API

- `POST /api/waitlist` with `{ email, consent: true, company: "" }` (`company` is the honeypot, must be empty).
- Validate with zod. Reject unless `consent === true`. Store the email, consent text version and timestamp. No tracking before consent.
- Rate limit per IP hash (salted, not stored raw) and per email: a small sliding window, return 429 with a plain message.
- Return generic success even for duplicates. Never reveal whether an email exists.
- Log no personal data. CSRF: same-origin check plus `Content-Type: application/json`.
- `/data-deletion` reuses the same hardening with its own route and schema.

## 5. SEO and sharing

- Per-page `metadata` (title, description, canonical, language). Title pattern "Scoutly: {page}".
- Open Graph and Twitter images pre-rendered (one default, one per legal page type). Text uses `«PH:og_image_copy»` until set.
- JSON-LD: `Organization` (name, URL, logo; no invented social links or numbers) and `FAQPage` (generated from `content/en/faq.ts`, identical text to the page).
- `sitemap.xml` lists every public page. `robots.txt` allows all in production, disallows all on staging via env.
- Do not add review or rating markup. We have none.

## 6. Analytics and consent

Cookieless and privacy-friendly where possible, loaded only through a consent-aware wrapper. Default is **no analytics** until consent. No ad pixels, no third-party trackers, no embedded social widgets. The cookie preferences page reads and writes the consent value.

## 7. Quality bar

See ACCESSIBILITY_AND_PERFORMANCE.md. Every page passes axe with zero serious violations, the Lighthouse budgets, link check and the placeholder scan.
