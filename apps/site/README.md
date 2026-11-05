# @scoutly/site

Marketing site for Scoutly. Next.js (App Router), Tailwind v4, TypeScript strict. It is a separate app and **must not import from `packages/core` or `packages/ai`** (enforced by ESLint `no-restricted-imports`). Specs live in `docs/site/`.

## Run

```bash
pnpm install                      # from the repo root
cp apps/site/.env.example apps/site/.env.local
pnpm --filter @scoutly/site dev   # http://localhost:3000
pnpm --filter @scoutly/site build && pnpm --filter @scoutly/site start
```

Requires Node 22 and pnpm 9.15. The build downloads the Bricolage Grotesque font once and self-hosts it; no request to Google happens at runtime. The site is `noindex` unless `NEXT_PUBLIC_ENV=production`.

## Scripts (run with `pnpm --filter @scoutly/site <name>`)

| Script                | What it does                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dev`/`build`/`start` | Next.js. `/` is statically prerendered.                                                                                                                      |
| `typecheck`           | `tsc --noEmit` (strict, `noUncheckedIndexedAccess`).                                                                                                         |
| `lint`                | ESLint (Next + `jsx-a11y` strict, zero warnings) and Prettier check.                                                                                         |
| `format`              | Prettier write.                                                                                                                                              |
| `test`                | Vitest: contrast pairs against `tokens.css`, content schemas, `ph()`.                                                                                        |
| `test:a11y`           | Playwright + axe at 375 and 1280, normal and reduced motion, zero serious/critical. Needs a build first.                                                     |
| `measure:js`          | Gzipped JS for `/` from the build output (framework vs app code). Needs a build first. Excludes the `noModule` polyfill that modern browsers never download. |
| `lighthouse`          | Lighthouse CI, mobile, budgets: LCP < 2.5 s, CLS < 0.02, script size <= 150 KB, <= 2 font files (latin + latin-ext of one family). Needs a build first.      |
| `check:links`         | Crawls the built site with linkinator. Internal broken links fail; external ones warn. Needs a build first.                                                  |
| `check:hex`           | Fails on any hex colour outside `src/styles/tokens.css`.                                                                                                     |
| `check:placeholders`  | Fails on `TODO`, `FIXME`, `lorem`, `{{`, `xxx`. Lists every `«PH:key»` (warning; failure with `LAUNCH=1` or `--launch`).                                     |
| `check:claims`        | Fails on banned hype words and on a digit followed by `users`, `%` or `interviews`, unless listed in `scripts/claims-allowlist.json`.                        |
| `check:content`       | Warns on hard-coded user-facing text in JSX under `src/`.                                                                                                    |
| `check:launch`        | The three scanners in launch mode. **Fails today by design** while placeholders exist.                                                                       |
| `verify`              | Everything above except `check:launch`.                                                                                                                      |

`check:content` limits: it is a regex heuristic. It finds text between JSX tags and `alt`, `aria-label`, `title`, `placeholder` string attributes. It does not see strings built in expressions, template literals, or strings passed as props, and generic type syntax can occasionally false-positive. It never fails the build.

## UI primitives and shell (W01)

- Primitives: `src/components/ui` (Text presets, Button, Pill, Icon, Mark), `layout` (Container, Section), `shell` (Header, Footer, SkipLink, FloatingCta). Everything is a server component except three small client islands: `HeaderBehavior` (hide on scroll down), `MobileMenu` (enhances the native details/summary phone menu) and `FloatingCta` (pill and help bubble).
- Breakpoints (Tailwind theme in `globals.css`): xs 375, md 768, lg 1024, xl 1280, 2xl 1920. Phone-first: unprefixed styles are phone styles.
- `--header-h` (64px) is set in `tokens.css`; anchors and the future stage use it.
- WhatsApp link: `src/lib/whatsapp.ts` builds `https://wa.me/<digits>?text=Hi` from `NEXT_PUBLIC_WHATSAPP_NUMBER`; unset or invalid falls back to `#join` with `data-placeholder="true"`, and `check:launch` fails.
- `/styleguide` shows every primitive. It is `noindex` everywhere, 404 in a production build (`NEXT_PUBLIC_ENV=production`) and never in the sitemap.
- `scripts/links-pending.json` lists routes and anchors that do not exist yet. `check:links` warns for them; `check:launch` fails while the list is non-empty. Empty it in W06.
- There are no screenshot baselines and no visual-regression job by decision (W01).

## Device and chat screens (W02)

Static, server-rendered markup. Sample data only, every device carries a SAMPLE tag.

```
DeviceFrame (role=group, "Sample WhatsApp-style chat, step n of 3")
  ChatHeader (Mark avatar, name, role, SAMPLE Pill)
  .chat-body
    ScreenSimple   FileBubble, Bubble, ProgressLine (done), Bubble
    ScreenSpecific Bubble, ol > MatchCard x3 (fit Pill with words), Bubble
    ScreenYours    DraftBubble (article), QuickReplies (not focusable), SentNote
```

- `ScreenStack beat={0|1|2}` layers the three screens in one frame. `beat` is the only input: each screen gets `data-state="active|before|after"`; non-active screens are `visibility:hidden`, `aria-hidden` and `inert`. No transitions (W03 adds the cross-fade).
- `ScreenStacked` renders three frames in sequence, each fully visible, for the reduced-motion and no-JS layout.
- All copy lives in `content/en/stage.ts` (with `SAMPLE_NAMES`). `QuickReplies` are plain spans styled like buttons: no tabindex, no role, no handlers.
- `/styleguide` has a Device section: three screens at desktop and phone size, and a stack with a dev-only beat control (`BeatFlip`, the only client code in this phase).

## Content and placeholders

All user-facing copy lives in `content/en/*.ts`, validated by zod schemas in `content/en/schema.ts`. Components import from `@content/en` and never contain strings.

- **Change copy:** edit the file in `content/en/` (for example `hero.ts`). No component edit is needed.
- **Add content:** add the field to the schema in `schema.ts`, set it in the content file, then read it from `@content/en` in a component.
- **Placeholders:** values not supplied by the owner use `ph('key')`, which returns the visible marker `«PH:key»`. Keys are typed (`PlaceholderKey`), so a typo is a compile error. `check:placeholders` lists them. To fill one, replace `ph('key')` in `content/en/placeholders.ts` with the real value. `check:launch` fails until none remain.
- **Flags:** `content/en/flags.ts` (`pricing: false`, `repliesBeat: true`, `waitlist: true`).

## Tokens

`src/styles/tokens.css` is the only file with hex values and mirrors `docs/site/DESIGN_SYSTEM.md` sections 2 to 4 and `docs/site/MOTION.md` section 1. Tailwind maps them in `globals.css` (`@theme inline`), so use utilities such as `bg-bg`, `text-ink`, `border-line`. `src/styles/contrast-pairs.ts` lists every text/background pair; the unit test fails if a token change drops a pair below 4.5:1 (3:1 for large text and UI borders) or pairs `--ink-2` with `--beat-2`.

## Link checker choice

linkinator: pure Node (no binary to install on Windows or CI), crawls a local `next start` server, and lets the script classify internal versus external failures.

## Waitlist storage

`POST /api/waitlist` and `POST /api/data-deletion` write through `WaitlistStore` (`src/lib/waitlist-store.ts`). The shipped implementation appends to `.data/*.jsonl` (git-ignored) and is for development only. Production needs a real store once hosting is chosen. The rate limiter (`src/lib/rate-limit.ts`) is in memory, so limits are per server instance.
