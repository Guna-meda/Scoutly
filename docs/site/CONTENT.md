# Scoutly site: content

All copy for the English site. In code, this lives in `apps/site/content/en/*.ts`, never in components. Components receive content as props so translation (Hindi and others later) never touches layout.

Status: **draft copy for owner review.** Every line follows the voice rules below. Anything marked `«PH:key»` is a placeholder from the list at the end.

## Voice rules

- Plain, confident, short. Fragments are fine. No hype words ("revolutionary", "supercharge", "10x"). No emoji in headlines.
- State what is automated and what the user controls.
- No fabricated proof: no logos, review counts, user counts, quotes or metrics. Where we have no proof, show the product (real flow, sample data tagged "sample").
- Never promise outcomes (interviews, jobs, reply rates).
- Use the product's words: SEND, EDIT, DISCARD, matches, fit label.
- Say "on WhatsApp". Never name the competitor.

## Global

- Site name: Scoutly
- Primary button: **Start on WhatsApp** (links to `wa.me/«PH:whatsapp_number»?text=Hi`)
- Secondary: **Join the waitlist**
- Nav: How it works · Privacy · FAQ
- Footer disclaimer: **Scoutly is not affiliated with WhatsApp or Meta.**
- Footer draft-law note (legal pages only): *Draft, pending lawyer review.*

## 1. Hero

- Eyebrow: A talent agent on WhatsApp
- H1: **Find the startup. Write the email. You press SEND.**
- Lead: Scoutly finds early-stage startups that fit you, finds the right person to write to, and drafts a short email from your own work. Nothing goes out until you reply SEND.
- Button: Start on WhatsApp
- Small line under the button: No emails sent without your SEND.
- Device caption (hero loop): Sample conversation

## 2. Feature row (matches the three beats)

- **Simple**: Send your resume, or tell Scoutly about your work.
- **Specific**: Matches come with a source and a reason.
- **Yours**: You approve every email before it leaves.

## 3. Pinned stage (three beats)

| Beat | Card label | Headline | Caption |
|---|---|---|---|
| 1 | Simple | Send your resume. That's it. | Drop your resume or tell Scoutly about your work, right on WhatsApp. |
| 2 | Specific | Startups that fit, with a real reason. | Each match shows a source, whether they're hiring, and a fit label with a one-line reason from your own work. |
| 3 | Yours | Nothing goes out until you say SEND. | You see the exact email. Edit it, send it or discard it. It goes from your own Gmail. |

Accessible step announcement: "Step {n} of 3: {headline}".

Controls: aria-labels "Previous step", "Next step", "Go to step {n}".

### Sample chat (device) — all text marked SAMPLE

Names are fictional and must stay obviously fictional. Do not replace them with real companies or people.

Beat 1: user sends `aarav_resume.pdf` (tag "Sample file"). Scoutly: "Got it, Aarav. I'm reading your work now." Progress line: "Reading your work". Then: "I'll show you matches first. Nothing gets written until you pick one."

Beat 2: "3 matches for you. Sample data, not real companies."
1. Fernway · Seed · Bengaluru · Hiring: Frontend engineer · Why: you moved a checkout flow onto a component library. · Source: company careers page · **Strong fit**
2. Kite & Loom · Series A · Remote India · No open role, cold intro · Why: your design-system work matches their public hiring note. · Source: founder blog post · **Good fit**
3. Northwind Labs · Seed · Pune · Hiring: Product engineer · Why: you shipped features end to end with a small team. · Source: job board listing · **Stretch**
Then: "Reply with a number and I'll draft the email."

Beat 3: "Draft for Priya at Fernway · email verified · sample"

> Hi Priya,
>
> I'm Aarav, a frontend engineer. I rebuilt my last team's checkout flow and moved it onto a shared component library.
>
> Your public roadmap says Fernway is taking its product to mobile web next, and I've spent two years on exactly that.
>
> Would a 15-minute call this week make sense? My resume is attached.
>
> Thanks, Aarav

Quick replies: SEND · EDIT · DISCARD. After SEND: "Sent from your own Gmail. I follow up on day 4 to 5 and day 12 to 14, and stop the moment anyone replies."

Email format rules (the sample obeys them; so must any new sample): first-name greeting, three short paragraphs of at most two lines, one blank line between them, about 60 to 90 words, one easy ask, no placeholders, only facts the user confirmed.

## 4. Replies come to you (optional beat 4)

- Notification: "Priya replied to your note." (sample)
- Reply text (sample): "Thanks for writing. Can you send two links to your work?"
- Note: Follow-ups stop the moment someone replies.

## 5. How it finds the right person

- H2: **How Scoutly finds the right person**
- Steps (each one short line):
  1. **Your profile.** What you've built and what you want next, confirmed by you.
  2. **Public signals.** Hiring pages, funding news, founder posts and roadmaps. Public sources only.
  3. **The person.** A founder or hiring manager, not a generic inbox.
  4. **A verified email.** Scoutly checks the address before it writes anything.
  5. **Your draft.** Short, specific, in plain words. You decide.
- Note under the steps: Companies with no open role are included too. Each match says whether the company is hiring or a cold intro.

## 6. What an email looks like

- H2: **Short and specific beats long and polite.**
- Good (label "Scoutly draft"): the Beat 3 sample email above.
- Typical (label "What we avoid"), with struck-through problems:
  > Hi [Name], I am writing to express my keen interest in any opportunities at your esteemed company. I am a hard-working, passionate team player with excellent communication skills and a proven track record. Please find my CV attached. I look forward to hearing from you at your earliest convenience.
  Callouts: placeholder, generic praise, no specifics, no clear ask, too long.
- Standard line: About 60 to 90 words. One clear ask. Only facts you confirmed.

## 7. You stay in control

- H2: **You stay in control.**
- Items:
  1. **You approve every email.** Nothing goes out unseen. Reply SEND, EDIT or DISCARD.
  2. **It sends from your Gmail.** Replies come straight to you.
  3. **Public sources only.** No scraping of private data and no LinkedIn scraping.
  4. **It stops when it should.** Follow-ups end on a reply, a bounce or an opt-out. At most two follow-ups.
  5. **Delete your data.** Ask, and we delete it. *(response time: «PH:deletion_sla»)*
  6. **Nothing invented.** Every claim comes from facts you confirmed.
- Link: Read the privacy page

## 8. Pricing (flag `pricing`, hidden until decided)

- All copy `«PH:pricing_*»`. Prices in INR when known. Do not render while the flag is off.

## 9. FAQ

Trimmed to six on 2026-11-05 at the owner's request. Do not add the dropped ones back (follow-up count, who it writes to, made-up claims, company types, email length, WhatsApp affiliation) without asking. The footer still carries the "not affiliated" line.

1. **Will Scoutly send emails without asking me?** No. You see the exact draft first. Nothing is sent until you reply SEND. You can also EDIT or DISCARD.
2. **Do you scrape LinkedIn?** No. Scoutly uses public sources only and does not scrape LinkedIn or private data.
3. **What if a founder says stop?** Follow-ups stop on any reply, a bounce or an opt-out. Scoutly does not keep nudging.
4. **Which email address does it send from?** Your own Gmail, so replies come to you.
5. **Can I delete my data?** Yes. Use the data deletion request page. *(response time: «PH:deletion_sla»)*
6. **Will this get me an interview or a job?** We can't promise that. Scoutly helps you write good emails and reach the right people. Replies are up to them.

## 10. Closing call and waitlist

- H2: **Send your resume. See your matches.**
- Button: Start on WhatsApp
- Or: Join the waitlist (email field, label "Email", button "Join the waitlist")
- Consent text (checkbox, required): "I agree that Scoutly may email me about launch and early access. See the privacy page." *(lawyer to confirm)*
- Success: "You're on the list." Error: "That didn't work. Try again, or start on WhatsApp."

## 11. Footer

Legal links (Privacy, Terms, Cookie preferences, Data deletion request, Security) · Contact `meda.gunavathi25@gmail.com` · Language note: "English for now. More languages later." · Not affiliated with WhatsApp or Meta.

## Placeholder list

Every placeholder is rendered visibly in preview builds (as `«PH:key»`) and **fails the build in `pnpm check:launch`**. Fill these in `content/en/placeholders.ts`.

| Key | What I need from the owner |
|---|---|
| `whatsapp_number` | Scoutly's WhatsApp number (env var `NEXT_PUBLIC_WHATSAPP_NUMBER`) |
| `legal_entity` | Company legal name and registered address |
| `grievance_officer` | DPDP grievance officer name and contact |
| `deletion_sla` | How fast deletion requests are handled |
| `security_contact` | Responsible-disclosure address |
| `launch_date` | Launch date, if it should be shown (otherwise omit the line) |
| `pricing_*` | All pricing copy and INR amounts (flag stays off until decided) |
| `analytics_provider` | Which cookieless analytics tool, and its key |
| `social_links` | Any social profiles to link in the footer |
| `og_image_copy` | Final line for share images |
| `verification_method` | Confirm how addresses are verified, so step 4 of "How it finds" is accurate |
| `retention_period` | How long data is kept (privacy page) |
| `data_processors` | Names of the services that process data for Scoutly (privacy page) |
| `governing_law` | Governing law and courts (terms page) |
| `effective_date` | Effective date shown on legal pages |

Not decided and **must not be invented anywhere**: pricing, launch date, number of users, success rates, testimonials, partner companies, funding.
