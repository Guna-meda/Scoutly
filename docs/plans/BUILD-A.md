# BUILD A plan (build mode)

1. Part 1 (device, chat parts, 3 screens, ScreenStack/Stacked, stage.ts, styleguide) already exists from W02 commits; verified, only small reward hooks added.
2. Branch `site/stage` from `site/w02`.
3. `src/lib/stage-mode.ts`: pure `decideMode` and `clampBeat` (+ unit tests).
4. `StageSection` (server) renders the stacked layout; `StageEnhancer` (client) upgrades to pinned when motion is allowed and the viewport fits.
5. `PinnedStage` (client): one `beat` state; three sentinel zones + IntersectionObserver; buttons/dots/labels set beat and scroll to the zone.
6. Desktop: cards | device | caption card (grid 1fr 330 1fr). Phone: device, fixed-height step card, controls.
7. CSS in `styles/stage.css`: screen swap (480 ms), card accordion, rewards keyed on `[data-state=active]` so they replay each time.
8. Reduced motion / no-JS / short viewport: stacked frames, final states.
9. Tests: unit (mode, beat), axe on home, one e2e (controls, stacked, no overflow).
10. Measure stage JS, report.
