# Scoutly site: motion

Goal: many smooth, small animations that feel precise, never heavy. Everything animates `transform`, `opacity` or `filter` only (no layout properties except the card `height` and FAQ `grid-template-rows`, both on single elements). Every animation has a reduced-motion alternative.

## 1. Tokens

```css
:root {
  --ease: cubic-bezier(.22, 1, .36, 1);          /* the only curve */
  --spring: linear(0, .62 18%, 1.08 40%, .98 65%, 1); /* toggles only */
  --dur-1: 120ms; /* press, focus */
  --dur-2: 200ms; /* hover, toggles */
  --dur-3: 320ms; /* text swaps, pills */
  --dur-4: 480ms; /* screen swap, card expand */
  --blur: 10px;   /* cross-fade blur */
  --rise: 18px;   /* cross-fade travel */
  --stagger: 60ms; /* steps of 60 to 90 ms */
}
@media (prefers-reduced-motion: reduce) {
  :root { --dur-1: 1ms; --dur-2: 1ms; --dur-3: 1ms; --dur-4: 1ms; --blur: 0px; --rise: 0px; }
}
```

Rules: `will-change` only while an animation runs. No animation longer than 600 ms except the one-off reward moments (up to 1.8 s, once per step). Pause every looping animation when off screen (IntersectionObserver) or when the tab is hidden.

## 2. The 11 animations

| # | Name | What happens | Reduced motion |
|---|---|---|---|
| 01 | Stage screen swap | Outgoing chat: opacity 1 to 0, blur 0 to 10 px, up 14 px. Incoming: opacity 0 to 1, blur 10 px to 0, up from 18 px. 480 ms. | Instant swap |
| 02 | Card accordion | Active card height grows, others collapse to 64 px. Headline fades and rises with a 120 to 160 ms delay. Label pill never moves. | No height animation |
| 03 | Reward moments | Beat 1: paperclip drops, dot pulses twice, progress fills, dot turns into a check. Beat 2: fit labels pop in at 260 ms steps. Beat 3: SEND presses, a paper plane leaves, a note rises. Caption card: matching small icon (paperclip and check; three pills; a toggle flipping on with `--spring`). | Final state |
| 04 | Hero chat loop | Sample messages type in, about 6 s loop. | Static final frame |
| 05 | Headline word rise | Words rise 14 px, 40 ms stagger, once per page view. | Plain text |
| 06 | Statement sweep | A big sentence; a yellow highlight sweeps behind each word as it enters. Text stays full ink the whole time. | Highlight fully drawn |
| 07 | Sticky finder steps | Heading sticks on the left, five steps scroll on the right; the active step grows and a line draws to the next. | Plain numbered list |
| 08 | Email compare | Good email types in; the weak one gets struck through on its problem phrases. | Both shown complete |
| 09 | FAQ accordion | Plus turns 45 degrees; answer opens via `grid-template-rows: 0fr to 1fr`, 320 ms. | Opens without animation |
| 10 | Floating pill | Lifts 2 px on hover, presses to 0.97, slides away when the closing call is on screen. | No lift or slide |
| 11 | Page change | View Transitions cross-fade, 200 ms. | None |

Contrast rule for motion: text never changes colour or opacity to a state below AA. Hidden elements leave via `opacity` + `visibility`, and inactive text is removed from the accessibility tree, not just faded.

## 3. The pinned stage: how it is built

State: one number `beat` in 0..2. It is the only source of truth. Scroll, buttons, dots, card labels and keyboard all just set it.

Structure: a tall wrapper `section.stage` whose height is `calc(100svh + 2 * var(--step-len))` with `--step-len: 70svh`. Inside it, a sticky child `top: var(--header-h)` holds the layout. Three invisible sentinel elements, one per beat, sit in the wrapper at 0, 1 and 2 step lengths. The height is bounded: no wheel listeners, no `preventDefault`, no scroll hijacking. Normal scrolling always works, including touch momentum and keyboard.

Driving the state:
1. **Preferred**: where `CSS.supports('animation-timeline: view()')` is true, use scroll-driven animations to drive visual progress, and a tiny observer to update `beat` for accessibility and button state.
2. **Fallback**: `IntersectionObserver` on the sentinels with `rootMargin` set so the active sentinel crosses the middle of the viewport. Same state, same visuals. No scroll listeners.
3. **Buttons and dots**: set `beat`, then `scrollTo` the matching sentinel (`behavior: 'smooth'` unless reduced motion) so scroll position and state stay in step. Card label buttons do the same.

Progressive enhancement: server-render the **stacked** version (three steps in a vertical sequence, each with its screen). On the client, if motion is allowed and the viewport is tall enough, upgrade to the pinned layout. This is also exactly the reduced-motion and no-JS layout.

Reduced motion: no pinning, no blur, no auto reward animations. Show the three steps in a vertical sequence, each with its card, caption and static screen.

Budget: stage JS under 60 KB gzipped, no long tasks over 50 ms during the first scroll through, no layout shift (fixed slots for every animated element).

## 4. Library choice

CSS first. Use the `motion` package (LazyMotion with `domAnimation`, or only `animate`) for the fallback progress and the springs. No GSAP. No smooth-scroll library (no Lenis). If something can be done in CSS, do it in CSS.

## 5. Testing motion

- No screenshot tests. Check the stage by eye at 375, 768 and 1280, with and without reduced motion.
- A test that scrolls through the stage and asserts the sticky element never leaves the viewport and no horizontal scroll appears.
- A test that Tab reaches every control in a logical order and a visible focus ring shows.