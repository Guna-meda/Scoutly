# Scoutly site: design system

Status: approved direction, palette 5 ("acid and pink"). Source of truth for tokens is `apps/site/src/styles/tokens.css`. If this file and the code disagree, fix the code to match this file or raise it.

## 1. Feel

Friendly, sharp, honest. "A smart friend who writes your emails and never sends anything without asking." Flat colour, 2 px ink outlines, big readable type, small playful moments. No gradients, no shadows, no glossy effects. Not corporate, not crypto, not a chatbot cliché.

## 2. Colour tokens

Define as CSS variables on `:root` by role, not by hue, so dark mode later is a token swap.

| Token | Value | Role | Notes |
|---|---|---|---|
| `--bg` | `#F3F0E8` | Page ground | Stone |
| `--surface` | `#FFFFFF` | Cards, device, incoming bubbles | Also the beat 3 card |
| `--ink` | `#141414` | Text, outlines, icons, primary buttons | |
| `--ink-2` | `#57524C` | Captions only | **Never on pink** (4.0:1 fails) |
| `--beat-1` | `#D7FF3F` | Card "Simple", outgoing bubbles, toggle on | Acid |
| `--beat-2` | `#FF9EC7` | Card "Specific" | Ink text only |
| `--beat-3` | `#FFFFFF` | Card "Yours" | Same as surface, kept as its own token |
| `--action` | `#141414` | Primary button fill | |
| `--action-text` | `#FFFFFF` | Text on primary button | |
| `--chat-bg` | `#E9E5DA` | Behind bubbles inside the device | |
| `--track` | `#DDD8CA` | Progress and toggle tracks | Decoration only, no text |
| `--ok` | `#1F7A4D` | Success | 5.3:1 on white |
| `--warn` | `#B3261E` | Error | 6.5:1 on white |
| `--line` | `#141414` | Outline colour | |

Verified contrast: ink on stone 16.2, on white 18.4, on acid 16.0, on pink 9.6, on chat-bg 14.6; ink-2 on stone 6.8, on white 7.7, on acid 6.7, on chat-bg 6.1; white on ink 18.4. A test in CI recomputes every pair listed in `src/styles/contrast-pairs.ts` and fails below 4.5 (3.0 for 24 px+ text and UI borders).

Rules:
- Never use text opacity to dim text. Use `--ink-2` on allowed surfaces only.
- No green near WhatsApp's green. Acid is a yellow-green, used as a fill only, never as an icon or logo colour that could read as WhatsApp.
- Colour is never the only signal (fit labels carry words, states carry icons).

## 3. Type

Bricolage Grotesque (OFL), variable, self-hosted through `next/font/google` with `display: swap`, weights 400 to 800, subset latin plus latin-ext. One family for everything. Fallback: `system-ui, sans-serif`. Size-adjust the fallback to stop layout shift.

| Style | Size / line / tracking / weight | Use |
|---|---|---|
| Display | `clamp(44px, 9vw, 96px)` / 0.96 / -0.035em / 700 | Hero, closing call |
| H2 | `clamp(32px, 5vw, 44px)` / 1.02 / -0.03em / 700 | Section titles |
| H3 | 28 / 1.1 / -0.02em / 650 | Card titles |
| Body L | 20 / 1.5 / 0 / 400 | Lead paragraphs |
| Body | 17 / 1.55 / 0 / 400 | Default (minimum 16 on phones) |
| UI | 15 / 1.2 / 0.04em / 700 | Buttons, quick replies (SEND, EDIT, DISCARD) |
| Label | 12 / 1.2 / 0.08em / 600, uppercase | Step counters, "SAMPLE" tags |

## 4. Shape

- Outline: `--outline: 2px solid var(--line)` on device, cards, buttons, pills, inputs.
- Radius: `--r-s 10px`, `--r-m 16px`, `--r-l 24px`, `--r-xl 40px`, `--r-full 999px`.
- Spacing: 4 px base; section padding 96 px desktop, 64 px phone. Side gutter 16 px phone, 48 px desktop. Max content width 1180 px.
- Tap targets: at least 44 x 44 px. Visible focus: `outline: 3px solid var(--ink); outline-offset: 3px`; on ink-filled elements use a white inner ring plus the ink outer ring.

## 5. Mark

An original "lens that sends": a ring with a gap in its top-right quarter and an arrow leaving through the gap. 32 px grid, stroke 3, round caps and joins.

```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="16" cy="16" r="11" stroke-dasharray="52 17.1"/>
  <path d="M14 18 L25 7 M17.5 7 H25 V14.5"/>
</svg>
```

Use ink on stone or acid, white on ink. Minimum size 20 px. Do not use WhatsApp's logo or icon in our mark. If the WhatsApp name or logo is shown for the call to action, follow WhatsApp's brand guidelines and keep it visibly separate from our mark.

Icons: one inline SVG set, 24 px grid, stroke 2.2, round caps, `aria-hidden` unless it carries meaning. Needed: bolt, target, check-circle, paperclip, plane, chevron-left, chevron-right, plus, menu, chat-bubble, doc.

## 6. Components

- **Button primary**: ink fill, white text, 2 px ink outline, `--r-full`, min height 44, 16/700. Hover lifts 2 px. Press scales to 0.97.
- **Floating pill** (`Start on WhatsApp`): primary button plus the mark at 28 px. Desktop: fixed bottom right, left of the help bubble, never over the stage zone. Phone: full-width bar, 16 px from the edges. Hides when the closing call to action is visible.
- **Help bubble**: 52 px ink circle, chat glyph, fixed bottom right.
- **Beat card**: height 528 (active) or 64 (collapsed) on the desktop reference; label pill (`--surface`, 2 px ink, 15/700) pinned bottom-left; icon bottom-right; headline top-left, 52 px / 1 / -0.035em.
- **Device frame**: 330 x 680 reference, 2 px ink outline, `--r-xl`, `--surface` inside.
- **Chat bubbles**: incoming `--surface`, outgoing `--beat-1`, 2 px ink outline, 16 px radius with one 4 px corner on the tail side. Quick replies are real buttons, 44 px high.
- **Fit label**: pill, 2 px ink, 11.5/700, fill `--beat-1`, `--beat-2` or `--surface`. Words always: "Strong fit", "Good fit", "Stretch".
- **Sample tag**: "SAMPLE" label pill on every device header and anywhere sample data appears.
- **FAQ row**: 2 px outlined card, 24 px radius, plus button 44 px turning 45 degrees when open.

## 7. Stage geometry (the centrepiece)

Desktop (>= 1024 px): container 1180 wide, grid `1fr 330px 1fr`, gap 56. All three columns share one top line and one bottom line.
- Device height `clamp(520px, calc(100svh - var(--header-h) - 120px), 680px)`. Never crop the device: if the viewport is short, the device shrinks, it does not overflow.
- Left cards: three, `gap 12`. Collapsed height 64. Active height = device height minus 2 x 64 minus 2 x 12.
- Right caption card: same height as the device. "Step N of 3" at top, one sentence at 34 px, fixed 150 x 110 reward slot bottom-left so the card never collapses.
- The site header is a normal sticky bar above the stage and is never overlapped by it. No full-width banners over the stage.

Phone (< 1024 px): device full width minus 16 px gutters, height `min(440px, 55svh)`, sticky under the top bar. Below it one step card (label, headline, caption, fixed height 168 so nothing shifts), then 44 px prev / dots / next, then the floating pill bar.

## 8. Do and don't

Do: show the real flow, keep sentences short, keep outlines at 2 px, label sample data. Don't: add gradients or shadows, dim text, use pink behind grey text, invent numbers, name the competitor, imitate WhatsApp's UI assets or the inspiration site's brand, copy, illustrations or layout.
