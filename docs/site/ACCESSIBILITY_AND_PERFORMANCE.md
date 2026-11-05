# Scoutly site: accessibility and performance

Mobile is the primary viewport (Android, 4G). Target: WCAG 2.2 AA on every page.

## 1. Accessibility rules

Contrast
- Body text 4.5:1 minimum, large text and UI borders 3:1, in **every state**, including hover, focus, disabled and mid-transition. Palette pairs are listed in `src/styles/contrast-pairs.ts` and tested in CI.
- `--ink-2` never sits on pink. No text opacity tricks. Colour is never the only signal.

Structure and semantics
- One `h1` per page, headings in order. Landmarks: `header`, `nav aria-label="Main"`, `main`, `footer`. A "Skip to content" link is the first focusable element.
- Real `button`, `a`, `input` and `label` elements. Never a `div` with a click handler.
- Language: `<html lang="en">`; per-locale routing later.

Keyboard and focus
- Everything reachable by Tab in reading order, with a visible focus ring (3 px ink outline, 3 px offset; white inner ring on ink fills). No focus traps. Esc closes any overlay.
- Targets at least 44 x 44 px, with at least 8 px between neighbours.

The pinned stage
- It is a `section` labelled by its heading. The three steps are also reachable by **buttons** (previous, next, step dots, card labels), not only by scroll.
- Inactive steps get `aria-hidden="true"` and `inert`, so screen readers and Tab skip them. The active step's headline is announced through a polite live region: "Step 2 of 3: Startups that fit, with a real reason."
- Dots use `aria-current="step"`. Buttons at the ends are `disabled`.
- The sample chat is real, text-based HTML, not an image, with a visible "Sample" tag and an `aria-label` on the device ("Sample WhatsApp-style chat, step 2 of 3").
- Reduced motion, no JS, and screen-reader reading order all get the stacked three-step version.

Motion
- Honour `prefers-reduced-motion`. No flashing above 3 per second. Looping animation pauses off screen and has no auto-play over 5 seconds without a pause control (or is decorative and stops after one loop).
- No scroll hijacking: no wheel or touch listeners that call `preventDefault`.

Forms
- Visible labels, programmatic error text (`aria-describedby`), no placeholder-only labels, honeypot field hidden from assistive tech (`aria-hidden`, `tabindex="-1"`). Consent checkbox is required and unchecked by default.

Content
- Plain language. Alt text on any informative image; decorative SVG `aria-hidden`. Link text says where it goes. Do not rely on colour alone for fit labels.

## 2. Performance budgets (mid-range Android, 4G)

| Metric | Budget |
|---|---|
| LCP | under 2.5 s (hero text is the LCP element; no hero image or video) |
| CLS | under 0.02, aim for 0 |
| INP | under 200 ms |
| Stage JS | under 60 KB gzipped |
| Total JS on home | under 150 KB gzipped, hydration islands only |
| Fonts | one variable font, preloaded, `font-display: swap`, size-adjusted fallback, latin plus latin-ext only |
| Images | none required; OG images pre-rendered; any other image AVIF or WebP with width and height set |

How we hit them
- Server components for all sections. Client islands only for: pinned stage, hero chat loop, FAQ, waitlist form, floating pill.
- The sample chat is HTML and CSS, not video or Lottie.
- Fixed-size slots for every animated element (reward icons, device, cards) so nothing shifts.
- No third-party scripts before consent. Analytics is cookieless, loaded after consent, deferred.
- `preconnect` only to hosts we really use. No webfont request to Google at runtime (self-host via `next/font`).
- Long tasks: none over 50 ms during first scroll through the stage.

## 3. CI gates (all must pass)

1. `pnpm typecheck` (TypeScript strict) and `pnpm lint` (ESLint with jsx-a11y).
2. `pnpm test` unit tests (including the contrast-pair test and the content schema test).
3. `pnpm test:a11y`: Playwright plus `@axe-core/playwright` on every route at 375 and 1280, in light mode, normal and reduced motion. Zero serious or critical violations.
4. *(removed by owner decision: no visual regression tests. Check the stage by eye at 375, 768 and 1280.)*
5. Lighthouse CI against the budgets above, on the built site, mobile preset.
6. `pnpm check:links`: internal and external link check (external allowed to warn, internal must pass).
7. `pnpm check:placeholders`: fails on `TODO`, `lorem`, `{{`, `FIXME`, `xxx`, and any text matching `«PH:`. In normal CI, `«PH:` is a warning that prints the list; with `LAUNCH=1` it is a failure.
8. `pnpm check:content`: every string comes from `content/`; flags hard-coded user-facing text in components.
9. `pnpm check:claims`: fails on banned words in content ("revolutionary", "supercharge", "10x", "guarantee", "guaranteed") and on any digit followed by "users", "%", or "interviews" unless it is in the allow-list.

## 4. Manual checks before launch

- Screen reader pass (VoiceOver and TalkBack) on home, FAQ, waitlist, stage.
- Keyboard-only pass on every page.
- Real mid-range Android device on 4G for LCP and stage smoothness.
- 200 percent zoom and 320 px width: no horizontal scroll, no clipped content.
- Hindi-length text test: pseudo-locale with 40 percent longer strings does not break the layout.