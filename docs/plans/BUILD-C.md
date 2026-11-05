# BUILD C plan: Paper Plane Send

1. Study the reference recording and the 120 extracted frames (docs/prompts-reference).
2. `src/lib/paper-plane.ts`: pure `frame(t, params)` timeline (pointer, collapse, letter rise, fold, flight, dive, sent, note) plus `miniFlight`.
3. `PaperPlaneOverlay` (lazy, client): rAF driver, SVG letter/fold/plane/trail/pointer over the sticky stage, aria-hidden.
4. Stage wiring: `data-send` (idle, sending, sent) on `.stage-pin` drives the SEND label, status bar, draft and sent note in CSS.
5. Plays once 400 ms after beat 3 activates, cancelled on leaving, Replay button when finished.
6. Reduced motion and stacked layout: end state only (Sent, note shown).
7. Waitlist: mini plane hop on success.
8. Tests: unit for the timeline, e2e for the send flow, replay, reduced motion.
