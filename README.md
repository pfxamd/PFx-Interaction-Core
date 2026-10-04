# PFx Interaction Core

Headless interaction infrastructure for PFx projects.

## Packages

- `@pfx/interaction-core` — gestures, values, modifiers, constraints, sessions, scheduling contracts, and physics.
- `@pfx/interaction-dom` — Pointer Events, keyboard, wheel, pointer capture, DOM coordinates, and frame scheduling.
- `@pfx/interaction-react` — thin React bindings over the core and DOM layers.
- `@pfx/interaction-testing` — deterministic input builders, sequence helpers, and a manual scheduler.
- `@pfx/playground` — manual interaction lab for validating behavior and feel.

## v0.1 scope

- Mouse, touch, pen, keyboard, and wheel input.
- Drag 1D/2D, move, hover, press, cancel, and Escape cancellation.
- Normalization, mapping, clamp, wrap, sensitivity, precision, steps, detents, hard/soft bounds, and snapping.
- Velocity, inertia, spring, damping, friction, elastic bounds, and return-to-origin composition.
- High-frequency values outside React state.
- Core with zero runtime dependencies and no DOM or React coupling.

## Development

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm api:extract
pnpm check:packages
pnpm exec playwright install chromium
pnpm test:e2e
```

## Status

`v0.1` foundation.
