# W01: layout, header, footer, buttons, typography, grid, floating pill, help bubble (PLAN, awaiting "go")

Status: plan only. No code written. Real names from W00: package `@scoutly/site`, scripts `typecheck lint test test:a11y test:visual lighthouse check:links check:hex check:placeholders check:claims check:content check:launch verify`. Versions kept as W00 left them (Next 16.4.5, React 19.3.1, Tailwind 4.3.4, TypeScript 6.0.3 and ESLint 9 fallbacks, Prettier: semis, single quotes, 100 cols, trailing commas all).

## 0. Checks done before planning

- `docs/site/*` vs code: no conflict found. One gap: `--header-h` and breakpoint tokens do not exist in `tokens.css` (DESIGN_SYSTEM and MOTION reference `--header-h`). Adding tokens is allowed by the brief; existing values are untouched. I will list the additions in the report.
- **View Transitions are not stable** in the installed stack: React 19.3.1 exposes `ViewTransition` only in `@types/react/experimental.d.ts`, and Next's support is behind an experimental flag. Plan: **skip animation 11 and say so in the report.** No experimental flags in production code.
- W00 `check-content` heuristic only warns. New components will keep strings in `content/en/*.ts` so it stays at zero warnings.

## 1. Component list and props

All under `src/components/`. Server components unless marked client.

| Component | Props (summary) | Notes |
|---|---|---|
| `ui/Text` + presets `Display H2 H3 BodyL Body UI Label` | `as`, `className`, `tone?: 'ink' \| 'muted'`, `on?: 'bg' \| 'surface' \| 'beat-1' \| 'chat-bg'` | Sizes from tokens (clamps). **Guard:** `tone="muted"` requires an `on` from the allowed list; `beat-2` is not in the type, so ink-2-on-pink is a compile error. A type-level test (`expectTypeOf`/`@ts-expect-error`) proves it. Existing contrast test still covers the pairs. |
| `layout/Container` | `as`, `className` | max 1180, gutters from `--gutter` (16 phone, 48 desktop) |
| `layout/Section` | `id?`, `as`, `className` | padding from `--section-pad` (64/96); `id` for anchors; `scroll-margin-top: var(--header-h)` |
| `ui/Button` | polymorphic: `href` present renders `<a>` (or Next `Link` for internal), else `<button type="button">`; `variant: 'primary' \| 'secondary'`, `size: 'md' \| 'lg'`, `disabled`, `loading`, `icon?` | min height 44, 2px outline, full radius; hover lift 2px; press scale .97; `aria-disabled` + no navigation for disabled links; `loading` sets `aria-busy`, keeps width, disables activation. Primary uses a white inner ring on focus. |
| `ui/Pill` | `tone: 'lime' \| 'pink' \| 'white'` (= beat-1, beat-2, surface), `as` | for fit labels and "SAMPLE" tag; always ink text |
| `ui/Icon` | `name` (exactly 11 names), `size`, `label?` | 24 grid, stroke 2.2, `aria-hidden` unless `label` |
| `ui/Mark` | `size`, `label?` | exact SVG from DESIGN_SYSTEM section 5, `currentColor`, `role="img"` + `aria-label` only if label |
| `shell/Header` (server) + `shell/HeaderBehavior` (client) + `shell/MobileMenu` (client) | content from `content/en/global.ts` | see section 3 |
| `shell/Footer` | content from `content/en/footer.ts` | stacked on phone, 44px links |
| `shell/SkipLink` | | first focusable element |
| `shell/FloatingCta` (client) | | pill + help bubble, section 4 |
| `lib/whatsapp.ts` | `buildWhatsAppHref(number?: string): { href: string; isPlaceholder: boolean }` | section 5 |

Breakpoints (documented in `tokens.css` comment and README, wired in Tailwind `@theme`): `--breakpoint-xs: 375px`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1920`. (Tailwind needs these as theme vars, not CSS custom props, for `md:` variants; values live in `globals.css @theme`, not hex, so check:hex is unaffected.)

## 2. File tree

```
apps/site/
  content/en/{footer,nav,styleguide}.ts   (new; global.ts gains skip/help/menu/pill labels, schema.ts extended)
  src/app/layout.tsx (shell), page.tsx (kept proof, inside shell), styleguide/page.tsx, sitemap.ts
  src/components/{ui,layout,shell}/...
  src/lib/{whatsapp.ts,whatsapp.test.ts,header-visibility.ts,header-visibility.test.ts}
  src/styles/{tokens.css (+--header-h, --pill-h), globals.css (+Button/pill/utility classes)}
  scripts/links-pending.json; scripts/check-links.ts (reads it); scripts/check-launch.ts (fails if non-empty)
  e2e/{a11y.spec.ts (+styleguide), keyboard.spec.ts, layout.spec.ts, visual.spec.ts (+styleguide baselines)}
  e2e/__screenshots__/...   (committed baselines, /styleguide only)
```

## 3. Client versus server split, header, mobile menu

- **Server:** typography, layout, Button, Pill, Icon, Mark, Footer, header markup. Zero JS.
- **Client islands (only these):**
  1. `HeaderBehavior`: hide on scroll down, show on scroll up. Not a wrapper around children; renders nothing and toggles `data-hidden` on the header element via a ref/id, so header markup stays server-rendered.
  2. `MobileMenu`: open/close state, focus management.
  3. `FloatingCta`: IntersectionObserver for `#join`, inert toggling.
- **Header hide approach:** one passive `scroll` listener throttled with `requestAnimationFrame`; pure decision function `nextHeaderState(prevY, y, {focusInside, menuOpen, reducedMotion, threshold})` extracted to `lib/header-visibility.ts` and unit-tested. Rules: always visible when `y < header height`, when focus is inside the header (`focusin`/`focusout`), when the mobile menu is open, and on small deltas (8px dead zone). Hidden state uses `transform: translateY(-100%)` + `visibility` after the transition so hidden links leave the tab order; under reduced motion it never animates and I choose to **never hide** (header stays visible), which is the safest reading of "never animating". No `preventDefault`, no wheel/touch listeners.
- **`--header-h`:** token default `64px` in `tokens.css` (so it is set at first paint with no JS and no layout shift); header has fixed block-size equal to it. The sticky header sits in normal flow (`position: sticky; top: 0`), so it never overlaps content; `scroll-margin-top` on sections uses it. No ResizeObserver needed because the height is fixed per breakpoint.
- **Mobile menu pattern: disclosure, not a modal dialog.** Justification: it is a short list of 3 links plus the CTA, and a disclosure keeps the header and the button in the accessibility tree, which is simpler for screen readers and avoids a focus trap. The brief also asks for background `inert`, focus moving in, Esc and outside tap closing, and focus return. So: button `aria-expanded` + `aria-controls`; on open, `<main>`, footer and floating CTA get `inert`, focus moves to the first link; Esc and an outside pointerdown close and return focus to the button; Tab wraps naturally because everything else is inert (no custom trap). Panel is full width under the header, links 44px+. Under 768px the nav is in the menu; at 768 and up the three links render inline (so the menu button is `md:hidden`).
- No-JS: the menu panel is hidden by default; with no JS the menu button would do nothing. Mitigation: nav links are inside a `<details>`-free structure; to stay usable without JS the three links also appear in the footer... Noted as a risk below; decision: use native `<details>`-style progressive enhancement only if cheap, otherwise accept (the footer carries Privacy; the primary CTA stays visible in the header on phones next to the menu button).

## 4. Floating pill and help bubble (client island)

- Phone (< 1024): full-width bar, 16px from edges, `bottom: calc(16px + env(safe-area-inset-bottom))`. Desktop: fixed bottom-right, offset left of the 52px help bubble. The help bubble is also a fixed element in the same island.
- IntersectionObserver on `#join` (queried after mount and on route change via `usePathname`). While it intersects: pill gets `data-away`, `transform: translateY(...)`, `visibility:hidden` after transition, and `inert`. If `#join` does not exist, the pill stays.
- `body` bottom padding on phones = `--pill-h` (token) + 16 + safe area, applied via a `padding-bottom` rule scoped to `body` under 1024px, so the footer is never covered.
- Hover lift 2px, press scale .97, using `--ease`/`--dur-*`; under reduced motion the durations are already 1ms; additionally lift/slide are disabled via `@media (prefers-reduced-motion: reduce)` (slide becomes instant toggle).
- Help bubble: 52px ink circle, chat-bubble icon, `aria-label` from content, `href="/#faq"`.
- The pill is the same `Button` plus `Mark size=28`; WhatsApp href from the builder.

## 5. WhatsApp builder

`buildWhatsAppHref(raw)`: trims, strips `+`, spaces and dashes, requires `^\d{8,15}$`; otherwise (unset, empty, contains `«PH:`, non-numeric) returns `{ href: '#join', isPlaceholder: true }`. Valid returns `https://wa.me/<digits>?text=Hi` using `encodeURIComponent`. Buttons spread `data-placeholder="true"` when placeholder. Launch check: `check-placeholders` already fails on `«PH:whatsapp_number»`; I add a launch rule that fails if `NEXT_PUBLIC_WHATSAPP_NUMBER` is invalid, and `check-launch` also fails on a non-empty `links-pending.json`.

## 6. Dev styleguide

`/styleguide`: statically rendered page showing every primitive and state (including forced hover/focus/disabled via data attributes), header and footer in context, pill. In production (`NEXT_PUBLIC_ENV=production`) the route calls `notFound()` (returns 404); everywhere else it has `robots: noindex`. `sitemap.ts` is added now (home only) and never lists `/styleguide`. Caveat: a static route using `notFound()` at build time prerenders a 404 in production; verified by test against a production build.

## 7. Content and pending links

New content files: `footer.ts` (legal links, contact line using `ph('contact_email')`, language note, WhatsApp disclaimer), `nav.ts` content merged into global (labels exist), plus `styleguide.ts` for demo copy. Footer/nav link to `/privacy`, `/terms`, `/cookies`, `/data-deletion`, `/security`, `/#how-it-works`, `/#faq`. `scripts/links-pending.json` lists those routes and anchors; `check-links` prints them as warnings and treats them as expected failures (not errors); `check-launch` fails while non-empty. Must be emptied in W06.

## 8. Tests

- Unit (vitest): whatsapp builder (valid, +/spaces, too short, letters, placeholder, empty/undefined); `header-visibility` decision table; button-state contrast pairs added to `contrast-pairs.ts` (primary rest/hover/disabled, secondary rest/hover/disabled, focus ring vs bg) with hover/disabled colours expressed only with existing tokens (no opacity tricks; disabled = `--track` fill + `--ink` text, still >= 4.5:1; to be confirmed by the test); a type test for the ink-2/pink guard.
- axe: `/styleguide` and `/` at 375 and 1280, normal and reduced motion, zero serious/critical.
- Keyboard: Tab order skip link -> header -> main -> footer -> pill; menu open with Enter/Space, Esc closes, focus returns; focus ring visible on every interactive element (computed outline width >= 3px) and 44px size assert for every `a/button` on `/styleguide`.
- Layout: no horizontal scroll at 320, 375, 768, 1280, 1920 on `/` and `/styleguide`; header does not overlap `main` (bounding boxes); header hides on scroll down and returns on scroll up (non-reduced), `--header-h` computed; pill hidden/inert when a `#join` stub is scrolled in (styleguide includes a demo `#join` target section), pill never overlaps footer text at bottom of page on 375.
- Visual: first baselines for `/styleguide` at 375, 768, 1280 x normal/reduced = 6, committed. Generated on Windows/Chromium here; **risk:** CI runs Linux, where font rendering differs. Mitigation: generate baselines in CI-compatible way (Playwright's Linux docker or a CI "update snapshots" artifact) - see open question.
- Production check: build with `NEXT_PUBLIC_ENV=production` and assert `/styleguide` 404 and `sitemap.xml` has no styleguide (scripted in the e2e/verify pipeline via a small separate build step or a node check on the build output).

## 9. Risks

1. **Visual baselines OS mismatch** (Windows vs Linux CI) will make `test:visual` flaky/failing in CI. See Q1.
2. **JS budget:** home was 138 KB of 150 KB gzipped (transfer). Three small islands should add ~3-6 KB; measure and report. If over, fall back to CSS-only for the pill/header where possible.
3. **Header hiding vs sticky inside `inert` menu** interplay and iOS rubber-band scroll negative offsets: handled by clamping `y` and the dead zone.
4. **No-JS mobile menu** (section 3). 
5. `NEXT_PUBLIC_ENV` is inlined at build time, so the 404-in-production behaviour needs a dedicated production build in tests (slower `verify`).
6. Tailwind v4 custom breakpoints require `@theme` names; the five documented breakpoints are defined there.
7. `scroll-margin-top` and `position: sticky` require no ancestor `overflow` clipping; the shell avoids `overflow-x: hidden` hacks (using `overflow-x: clip` only if needed, and the 320px test guards it).

## 10. Open questions (answer with "go")

1. **Baseline OS:** OK to generate the committed baselines on Linux via a CI-produced artifact (or a Playwright Docker run locally) instead of Windows? Default if you say nothing: generate locally on Windows, make `test:visual` CI-tolerant by running it in CI only with `--update-snapshots` disabled and tagging the baselines `win32`; Linux CI would then skip them. I recommend the Docker/Linux approach.
2. **Disabled button colour:** OK to define disabled as `--track` fill with `--ink` text and a dashed `--line`-style cue plus `aria-disabled` (no opacity)? Contrast ink on track is about 12:1.
3. **Reduced motion header:** OK that under `prefers-reduced-motion` the header simply never hides?
