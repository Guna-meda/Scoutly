# W00: scaffold apps/site, tokens and quality gates (PLAN, awaiting "go")

Status: plan only. Nothing under `apps/` has been created.

## 0. Blocker found while reading the repo

The prompt assumes an existing monorepo. `D:\Projects\Scoutly` currently contains **only `docs/site/*.md`**. It has none of: root `package.json`, `pnpm-workspace.yaml`, base `tsconfig`, ESLint/Prettier configs, `.github/workflows/`, `CLAUDE.md`, `docs/plans/` (this file creates it), `packages/core`, `packages/ai`, and it is **not a git repository**.

So there are no "repo conventions" to follow for package naming, lint, formatting, CI style or caching. I will not guess silently. Proposed defaults if you say "go" without changing them:

| Item | Default I will use |
|---|---|
| Root | Create minimal root `package.json` (private, `packageManager: pnpm@9.15.0`, `engines.node >=22`), `pnpm-workspace.yaml` with `apps/*` and `packages/*`, `.nvmrc` = 22, `.gitignore`, `.editorconfig` |
| Package name | `@scoutly/site` |
| Base tsconfig | `tsconfig.base.json` at root (strict); `apps/site/tsconfig.json` extends it |
| Prettier | single quotes, no semis off (semis on), 100 cols, trailing commas `all` (root `.prettierrc`) |
| ESLint | flat config inside `apps/site` only |
| CI | `.github/workflows/site.yml`, pnpm via `pnpm/action-setup`, `actions/setup-node` with pnpm cache |
| Git | I will NOT run `git init`. Tell me if you want it. |

These root files are "edits the workspace needs"; each would be listed in the report.

## 1. Versions (from `pnpm view`, 2026-11-05)

next 16.4.5, react / react-dom 19.3.1, tailwindcss + @tailwindcss/postcss 4.3.4, zod 4.6.7, eslint-config-next 16.4.5, eslint-plugin-jsx-a11y 6.10.2, eslint 10.14.0, prettier 3.9.10, vitest 5.1.0, @playwright/test 1.64.1, @axe-core/playwright 4.14.0, @lhci/cli 0.16.0, linkinator 8.1.0, tsx 4.23.15, typescript 7.0.2, @types/node 26.6.6.

Version risks (will verify at install, pin exact, no `^` drift):
- **typescript 7.0.2** is the native-compiler line; `next`, `eslint-config-next`, `typescript-eslint` may not support it yet. Fallback: latest 5.x/6.x that Next 16 supports. I will check peer ranges and choose the newest supported one.
- **eslint 10** vs `eslint-config-next` / `eslint-plugin-jsx-a11y` peer ranges (jsx-a11y 6.10.2 may cap at eslint 9). Fallback: eslint 9.x.
- **@types/node**: use the `22.x` line to match the Node 22 runtime, not 26.
- `lychee` on npm is not the Rust link checker; irrelevant, see decision below.

## 2. Decisions and why

1. **Tailwind v4, CSS-first.** Tokens live in `tokens.css` as `:root` variables; `globals.css` has `@theme inline { --color-bg: var(--bg); ... }` so utilities (`bg-bg`, `text-ink`) reference variables. No hex outside `tokens.css`. A grep check enforces it (and is added to `check:content`-style tooling as part of lint script).
2. **Font** via `next/font/google` Bricolage_Grotesque, `variable: '--font-sans'`, `display: 'swap'`, `subsets: ['latin','latin-ext']`, `adjustFontFallback: true`, weight range 400 to 800 (variable axis). Build-time self-host. Known limit: build needs network to fetch the font once; CI has it. If the build sandbox is offline I will tell you rather than vendor the font silently.
3. **Contrast test** parses `tokens.css` directly (single source of truth) rather than duplicating hex into the test. `contrast-pairs.ts` references token names; the test resolves them and asserts the ratio. Includes explicit rule: no pair has fg `--ink-2` and bg `--beat-2`. `--ok` and `--warn` on white, white on ink, and UI borders (3.0) included.
4. **Content pipeline.** `content/en/{global,placeholders,hero,flags}.ts` + `schema.ts` (zod). `ph(key)` returns `«PH:key»` and is typed against the placeholder key union, so a typo fails typecheck. `pricing_*` modelled as explicit keys (`pricing_plans`, `pricing_price_inr`, ...) since the doc gives only a wildcard; flagged as an open question.
5. **Link checker: linkinator.** Pure Node (no Rust binary, works on Windows and in CI without extra setup), can crawl a local static server, supports `--skip` for external and exit codes by scope. I run it twice: internal pass (fail), external pass (warn, exit 0 wrapper). lychee would need a binary install.
6. **Lighthouse CI** (`@lhci/cli`) mobile preset, `startServerCommand` = `next start`, assertions: LCP < 2500, CLS < 0.02 (error), total JS bytes budget 150 KB gzip. The 60 KB "stage JS" budget has no stage yet; I will encode it as a resource-summary budget for later and say so.
7. **Static prerender**: no `export const dynamic`, no server APIs on `/`. Verified from `next build` route table (`○` static).
8. **noindex default**: `metadata.robots` and `robots.ts` read `NEXT_PUBLIC_ENV`; only `production` is indexable.
9. **Scanners** are plain TypeScript run with `tsx`, no extra deps. Allow-list for `check-claims` lives in `scripts/claims-allowlist.json`. `check-content` is a regex heuristic over `.tsx` (JSX text nodes and `alt/aria-label/title/placeholder` literals); limits documented in README (misses strings built in expressions, template literals).
10. **Playwright** projects: viewport 375 and 1280 x colorScheme/`reducedMotion` normal and reduce. Runs against `next build && next start`. `test:visual` is a separate spec with no baselines committed; command exits cleanly with "no baselines" documented, update only via explicit `--update-snapshots`.
11. **Import isolation**: ESLint `no-restricted-imports` for `@scoutly/core`, `@scoutly/ai`, `**/packages/**`, plus a grep in the report.
12. **404 page**: minimal `not-found.tsx` pulling a string from `content/en/global.ts` so the a11y smoke test has something real. This is minimal and adds `notFound` strings to `global.ts` (one small addition beyond the spec; flagging it).

## 3. Files to create

```
package.json, pnpm-workspace.yaml, tsconfig.base.json, .nvmrc, .gitignore, .prettierrc, .editorconfig   (root; see section 0)
.github/workflows/site.yml
apps/site/
  package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs
  vitest.config.ts, playwright.config.ts, lighthouserc.json, .env.example, README.md
  content/en/{global,hero,placeholders,flags,schema,index}.ts
  src/app/{layout.tsx,page.tsx,not-found.tsx,robots.ts}
  src/lib/{content.ts,ph.ts}
  src/styles/{tokens.css,globals.css,contrast-pairs.ts,contrast.test.ts}
  content/en/content.test.ts   (schema + ph tests)
  e2e/{a11y.spec.ts,visual.spec.ts}
  scripts/{check-placeholders,check-claims,check-content,check-links}.ts, scripts/claims-allowlist.json, scripts/lib.ts
```

## 4. Order of work

1. Root workspace files + install, resolve version risks (section 1).
2. `apps/site` scaffold, tsconfig, ESLint/Prettier, `tokens.css` (copy values verbatim), `globals.css`, Tailwind mapping, font.
3. Content pipeline + proof home page + 404.
4. Contrast test (+ demonstrate failure with a bad token, revert).
5. Scanners (+ demonstrate each failing, revert).
6. Vitest, Playwright/axe, visual scaffold, Lighthouse CI, link checker.
7. Scripts wiring, `verify`, `.env.example`, README.
8. CI workflow.
9. Run everything, grep checks (hex, `packages/` imports, `any`), fill the report.

## 5. Risks

- Missing monorepo foundations (section 0) mean root decisions are mine, not inherited.
- TS 7 / ESLint 10 ecosystem compatibility (section 1).
- Lighthouse and Playwright need Chrome/Chromium; I will run `playwright install chromium`. Lighthouse numbers on this Windows machine are indicative, not a mid-range Android on 4G.
- `tokens.css` must match docs value for value: the doc's `--beat-3` and `--surface` are both `#FFFFFF` and `--line`/`--action` both `#141414`; kept as separate tokens as specified.
- Doc detail: DESIGN_SYSTEM section 4 gives the outline as `--outline: 2px solid var(--line)`; I will add it to tokens.css as written.

## 6. Open questions (answer with "go")

1. Section 0: OK to create the root workspace files with the defaults above (package name `@scoutly/site`, `git init` not run)? Or does the real monorepo live elsewhere and I should be pointed at it?
2. Pricing placeholder keys: the table gives only `pricing_*`. OK to define `pricing_headline`, `pricing_plans`, `pricing_price_inr`, `pricing_note`?
3. Version fallback policy: if TS 7 or ESLint 10 are unsupported by Next 16 tooling, OK to drop to the newest supported majors?
