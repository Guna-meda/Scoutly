# W02: device frame and the three chat screens (PLAN, awaiting "go")

Status: plan only. No W02 code written. Branch `site/w02` not created yet.

## 0. Findings

- `Chat.reference.html` is at `docs/site/Chat.reference.html`, not `docs/prompts-reference/`. Plan: copy it to `docs/prompts-reference/Chat.reference.html` as the brief says. It is a visual reference only (custom `x-dc` tags, inline hex, Google Fonts link); I port the look, not the runtime.
- Reference vs `DESIGN_SYSTEM.md` (markdown wins): reference uses 13.5px base text, a 60px chat header, 34px avatar, 4px/16px bubble corners (matches), 14px match-card radius (doc: 16px bubbles, `--r-m` 16), 12px quick-reply radius and 14px text (brief says 15px text, 44px high, so 15px wins), a gray `SAMPLE` pill filled pink with 10.5px text (brief: Pill component, so tone `white` or `lime`, 12px Label style). The reference also has a "Today" chip and real `<button>`s, which the brief rules out (no focusable quick replies).
- Git: W01 is still uncommitted on `main`. Before W02 I will create `site/w01`, commit W01 in logical commits there, then branch `site/w02` from it. `main` is not touched. Branches are pushed to `origin` (non-force).
- A background `find /` I started to locate the reference is still running; harmless, can be ignored or stopped.

## 1. Component tree (all server components, no new client JS)

```
src/components/device/DeviceFrame.tsx     role=group, aria-label from content, sizes from tokens
src/components/chat/{ChatHeader,Bubble,FileBubble,ProgressLine,MatchCard,DraftBubble,QuickReplies,SentNote}.tsx
src/components/chat/screens/{ScreenSimple,ScreenSpecific,ScreenYours}.tsx
src/components/chat/{ScreenStack,ScreenStacked}.tsx
src/app/styleguide/{DeviceSection.tsx (server), BeatFlip.tsx (client, styleguide-only)}
content/en/stage.ts (+ SAMPLE_NAMES), schema additions
src/styles/components.css (device and chat classes, tokens only)
```

`beat` drives `ScreenStack` only through `data-state="active|before|after"` on each screen (CSS: non-active are `visibility:hidden`, plus `aria-hidden` and `inert`). No transitions in W02.

## 2. Key decisions

1. Frame sizes via CSS classes with the exact clamp from the brief; phone width 100%, height `min(440px, 55svh)`.
2. Screens use tight spacing tokens (gap 8px, padding 14x12) and `overflow: hidden` on the frame only; a layout check at 330x680, 375 and 320 verifies the last element is visible; if not, spacing shrinks, not font size.
3. Quick replies are `<span>`s styled like buttons (no tabindex, no role, no handlers); SEND uses `--action`/`--action-text`.
4. Progress `done`: full fill plus check icon (`--ok`); `reading`: partial fill. Beat 3 rests with SEND unpressed and `SentNote` shown.
5. Draft email: `<article>` with greeting, exactly three paragraphs and sign-off, text word for word from `CONTENT.md`. The reference splits the draft into 4 body lines (the third body paragraph's ask is the 4th); I follow `CONTENT.md`: three paragraphs, with the "Would a 15-minute call ... attached." ask as the third and the "I'm Aarav ... library." / "Your public roadmap ..." as the first two. Word count of the body is checked by test (60 to 90).
6. Names live only in `stage.ts`; `SAMPLE_NAMES` = Aarav, Priya, Fernway, Kite & Loom, Northwind Labs.

## 3. Tests

- Unit (vitest): email format; every screen renders the SAMPLE tag (render to static markup via `react-dom/server`); names come only from `SAMPLE_NAMES`; existing contrast test still passes.
- axe: extend the smoke test to `/styleguide` (device section included) at 375 and 1280, normal and reduced motion.
- One browser check: Tab never lands inside the device; inactive screens are `inert`.
- No visual or screenshot tests.

## 4. Risks

- Content fit in the 330x680 frame at the smallest height (520px): match cards plus intro/outro may exceed it; mitigation is tighter spacing.
- Bubble contrast: ink-2 captions only on surface, `--beat-1` or `--chat-bg`, never on pink or blue (the Specific fit pill uses ink text on pink).
- JS budget: server components only; the only client code is the styleguide-only beat control. Home JS must stay at 136.62 KB gzipped.

## 5. Order of work

Commit W01 on `site/w01`, branch `site/w02`, copy reference, content + schema, CSS, chat parts, screens, stacks, styleguide section, tests, README, verify, JS measurement, report.
