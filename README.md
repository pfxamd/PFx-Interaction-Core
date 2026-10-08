# PFx Interaction Core

[![CI](https://github.com/pfxamd/PFx-Interaction-Core/actions/workflows/ci.yml/badge.svg)](https://github.com/pfxamd/PFx-Interaction-Core/actions/workflows/ci.yml)
[![Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Headless, framework-independent interaction primitives for building responsive, accessible controls and motion.

> **Status:** v0.1.0-beta.2 (GitHub prerelease). Public APIs may change. Packages are **not published on npm** yet.

## Packages

| Package | Purpose |
| --- | --- |
| `@pfx/interaction-core` | Drag, press, hover, values, modifiers, constraints, motion and physics. No DOM or React dependencies. |
| `@pfx/interaction-dom` | Pointer events, keyboard, wheel, capture, coordinates and frame scheduling. |
| `@pfx/interaction-react` | Optional React 18/19 hooks wrapping the underlying input bindings. |
| `@pfx/interaction-testing` | Deterministic samples, sequences, and manual scheduling. |
| `@pfx/playground` | Local playground, not a distributable package. |

## From source

Requires Node.js 22+ and pnpm 12.9.1.

```bash
corepack enable
corepack prepare pnpm@12.9.1 --activate
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm api:extract
pnpm check:packages
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
pnpm --filter @pfx/playground dev
```

## Headless core example

```ts
import { DragRecognizer, createScalarValue, clamp, springStep } from '@pfx/interaction-core';

const recognizer = new DragRecognizer({ activationDistance: 4 });
const progress = createScalarValue(0.5);
progress.subscribe((next) => console.log(next));

progress.set(clamp(0.7, 0, 1), 100);
const nextMotion = springStep({ position: 0, velocity: 0 }, 1, 1 / 60);
console.log(nextMotion);

// Feed recognizer.handle(sample) with normalized PointerSample events from an adapter.
void recognizer;
```

## DOM interaction example

```ts
import { bindDrag } from '@pfx/interaction-dom';

const element = document.querySelector<HTMLElement>('[data-drag]');
if (element) {
  const binding = bindDrag(element, {
    activationDistance: 4,
    onChange(snapshot) {
      if (snapshot.phase === 'start' || snapshot.phase === 'update') {
        element.style.translate = `${snapshot.offset.x}px ${snapshot.offset.y}px`;
      }
    },
  });

  // In a real application, call binding.destroy() when removing the element.
  void binding;
}
```

## Downloadable GitHub release archives

The GitHub prerelease includes source downloads and four prebuilt `.tgz`
packages, accompanied by `SHA256SUMS.txt`. These are **not npm registry releases**.
For repository development, the pnpm workspace remains the recommended way
to run all examples. Applications outside the workspace must supply all
required local packages explicitly; optional DOM and React layers depend
on the core package.

## Design notes

- The core works without browser globals, React or runtime dependencies.
- DOM bindings use native Pointer Events, keyboard listeners, and requestAnimationFrame.
- Dispose event bindings on removal. Destroying a binding releases active pointer captures.
- Use correct focus and keyboard semantics for each UI widget. The core does not create fully accessible widgets automatically.
- Browser compatibility must be validated on real browser engines, not inferred.
- v0.1.0 is an experimental API; consult the changelog before updating.
- The prerelease is hosted on GitHub only; packages are not available to install from the public npm registry.

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), [CHANGELOG.md](./CHANGELOG.md) and [NOTICE](./NOTICE).

## License

Copyright 2026 PFxamd. [Apache License 2.0](./LICENSE).
