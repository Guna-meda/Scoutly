# Scoutly: Google OAuth verification guide (Gmail scopes)

Status: draft for the owner. Written without access to Google's live pages, so check each Google-owned detail below against the current Google documentation before you submit. Values the owner has not supplied are written as `<...>`; fill them in. Do not guess them.

Scopes requested:

| Scope | Plain name | Class |
|---|---|---|
| `https://www.googleapis.com/auth/gmail.send` | Send email on your behalf | Sensitive |
| `https://www.googleapis.com/auth/gmail.readonly` | Read-only access to Gmail | **Restricted** (see section 5) |

## 1. What to enter in Google Auth Platform > Branding

`<SITE_URL>` is the production address of the site (the value of `NEXT_PUBLIC_SITE_URL`, no trailing slash). **Not supplied yet.**

| Field | Value |
|---|---|
| App name | `Scoutly` (exactly this, same as the page title, header and legal pages) |
| User support email | `<support email>`. The site currently shows `meda.gunavathi25@gmail.com` in the footer and the Contact link. Confirm it is the address you want Google to use. |
| App logo | Upload `apps/site/public/scoutly-logo-120.png` (120 x 120). A 512 x 512 version is at `apps/site/public/scoutly-logo-512.png`. |
| Application home page | `<SITE_URL>/` |
| Application privacy policy link | `<SITE_URL>/privacy` |
| Application terms of service link | `<SITE_URL>/terms` |
| Authorised domain | The registrable domain of `<SITE_URL>`, for example `example.com` if the site is `https://www.example.com`. No `https://`, no path. |
| Developer contact email | `<an address you read>`. Google writes here about the review. |

Before you enter these, make sure the production site is live with `NEXT_PUBLIC_ENV=production` and `NEXT_PUBLIC_SITE_URL` set. Google's reviewers must reach the home page, `/privacy` and `/terms` without login or redirect, and the privacy link must be visible on the home page (it is, in the "How Scoutly uses your Gmail" section and the footer). All placeholders (`«PH:...»`) must be gone from those three pages first: see `LAUNCH_CHECKLIST.md`.

## 2. Verify the domain in Google Search Console

1. Open Google Search Console and choose **Add property**, then **Domain** (not "URL prefix").
2. Enter the registrable domain from section 1.
3. Search Console shows a `TXT` record such as `google-site-verification=...`. Copy it exactly.
4. At the DNS host for the domain, add a `TXT` record: host `@` (or the bare domain), value the string you copied. Leave the TTL at the default.
5. Wait for DNS to update (minutes to hours), then press **Verify** in Search Console. Keep the TXT record in place: removing it un-verifies the domain.
6. Use a Google account that is an owner or editor of the Google Cloud project, or add the Search Console owner as one, so the domain shows as verified in Auth Platform.

## 3. Draft scope justifications (owner's voice)

Paste into the "justification" fields. Edit anything that is not true of the product as built. Keep it short and concrete.

### `gmail.send`

> Scoutly is a job-search assistant that runs on WhatsApp. A user tells Scoutly about their work, Scoutly finds early-stage startups and drafts a short outreach email, and the user approves the exact email by replying SEND. Scoutly then needs to send that approved email from the user's own Gmail address, so that it comes from the person who wrote it and replies come straight back to them. `gmail.send` is the narrowest scope that does this: it only lets Scoutly send messages. It does not let Scoutly read, list, change or delete anything in the mailbox. Nothing is sent without the user's SEND. A narrower scope does not exist for sending.

### `gmail.readonly`

> After Scoutly sends an approved email, it follows up at most twice. It must stop the moment the recipient replies, the email bounces or the recipient opts out; otherwise it would keep emailing someone who answered or asked to stop. To know that, Scoutly needs to read the email threads that Scoutly itself created. It also needs to read the thread to confirm whether a send actually went out after a crash or timeout, so that it never sends the same email twice and never reports a failed send as sent. We use the read access only on threads Scoutly sent. We do not read, search or store other mail. `gmail.send` alone cannot do this because it cannot read anything. `gmail.metadata` cannot do this because it does not include message bodies, and detecting a reply or an opt-out needs the reply text. Data from this scope is used only for these features. It is not used for advertising, not sold, and not used to train generalized machine-learning models.

Notes for the owner, so the justification stays true:

- Google offers `gmail.readonly` for the whole mailbox. "Only threads Scoutly sent" is how Scoutly uses the access, not a restriction Google enforces. Make sure the code really does only fetch threads it created (by stored thread id) and say so in the demo.
- If you decide reply text is sent to a language model provider, say so here too (see the privacy page, "Who receives it"). Google asks about third-party transfer.
- Check whether a narrower scope than `gmail.readonly` would now work for you (for example `gmail.metadata` plus a different way of seeing replies). Google may ask why not. The draft above says why not for `gmail.metadata`; confirm that is still right for the product.

## 4. Demo video script

Requirements: upload to YouTube as **Unlisted** and paste the link in the verification form. Record in English (or add English captions). Use a real browser window so the address bar is visible. Use a test Google account you own. No sensitive real mail on screen.

1. **Site.** Show the home page at its production URL. Scroll to "How Scoutly uses your Gmail". Click through to the privacy policy and show the URL in the address bar and the "Google user data" section, including the Limited Use statement.
2. **Start the connect flow.** In the WhatsApp chat with Scoutly (screen-record the phone or WhatsApp Web), start connecting Gmail, then open the link Scoutly sends.
3. **Consent screen.** On the Google consent screen show the **client ID in the browser address bar** (the `client_id=` part of the URL) and read out both permissions listed: send email, and read-only access to Gmail. Show the app name "Scoutly" and the privacy and terms links.
4. **Approve.** Click Allow. Show Scoutly confirming the connection.
5. **Send.** Ask Scoutly for a draft, show the exact email, reply SEND, and show the email arriving in the Gmail Sent folder of the test account.
6. **Reply detected.** From a second account, reply to that email. Show Scoutly telling the user that someone replied, and that follow-ups stop.
7. **Disconnect.** Show sending DISCONNECT in the WhatsApp chat and Scoutly confirming. Then open the Google Account permissions page (`https://myaccount.google.com/permissions`) and show how Scoutly would be removed there.
8. Say out loud, once, what each permission is used for and that only threads Scoutly sent are read.

Keep it under about five minutes. Do not edit out the consent screen or the address bar.

## 5. gmail.readonly is a restricted scope

- `gmail.readonly` is classified by Google as a **restricted** scope. `gmail.send` is **sensitive**. Restricted scopes need, besides the verification above, a security assessment by a Google-approved third party before the app can be used publicly by more than a small number of users, and the assessment is repeated on a schedule Google sets.
- What this means for timing: plan for weeks to months, not days. Sensitive-scope review, restricted-scope review and the assessment each have their own wait, and Google may send questions that restart a step. The assessment costs money and engineering time; get quotes from the approved assessors Google lists. We do not have a figure and have not invented one.
- Until verification and assessment finish, the app stays in Testing mode (a limited list of named test users, with tokens that expire quickly) or shows an "unverified app" warning with a user cap. Check Google's current rules for the exact limits.
- Plan the launch around this: do not announce general availability of the Gmail connection before it is done. The waitlist and the rest of the site can go live earlier.
- Check Google's current "Restricted scope verification" and "API Services User Data Policy" pages before you submit; they change.

## 6. Pre-submit checklist

- [ ] Production site live over HTTPS on the authorised domain, with `NEXT_PUBLIC_ENV=production` and `NEXT_PUBLIC_SITE_URL` set.
- [ ] Home, `/privacy` and `/terms` load without login or redirects, are indexable and have the right canonical URL.
- [ ] No `«PH:...»` placeholder remains on home, privacy, terms, data deletion or cookies (`LAUNCH=1 pnpm check:launch` in `apps/site`).
- [ ] Legal entity, registered address, grievance officer, deletion response time, retention period, data processors, reply-text answer, governing law, effective date and security contact are filled in.
- [ ] The Limited Use statement on `/privacy` matches the text on Google's current API Services User Data Policy page.
- [ ] A lawyer has reviewed the privacy policy and terms; the draft banner is removed only after that.
- [ ] The privacy page names both scopes in plain words and by technical name, and explains each use.
- [ ] The home page shows a visible link to `/privacy` in its body.
- [ ] App name is exactly `Scoutly` in Branding, page titles, header and legal pages.
- [ ] 120 x 120 logo uploaded in Branding; support and developer emails are addresses you read.
- [ ] Domain verified in Search Console (DNS TXT record in place).
- [ ] Only the two scopes above are requested in the OAuth client and listed in the consent screen configuration.
- [ ] Scope justifications pasted and edited to match the code.
- [ ] Demo video recorded as in section 4, uploaded to YouTube as Unlisted, link tested while logged out.
- [ ] The DISCONNECT command in WhatsApp works and revokes the Gmail token.
- [ ] The data deletion form has a production store and a named person who acts on requests within the stated time.
- [ ] Gmail connection token is stored encrypted, as the privacy page says.
- [ ] Budget and schedule for the third-party security assessment are agreed.
