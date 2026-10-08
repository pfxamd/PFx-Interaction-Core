# Contributing

PFx Interaction Core welcomes bug reports, reproducible test cases and improvements.

1. Discuss breaking public API changes in an issue before implementation.
2. Keep interaction-core framework-agnostic, with zero runtime dependencies.
3. Isolate browser concerns in interaction-dom and React adapters in interaction-react.
4. Accompany observable behavior changes with regression tests and a Changeset.
5. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm api:extract`, `pnpm check:packages`, and `pnpm test:e2e` before opening a PR.

By contributing you agree to license your contributions under Apache-2.0. Do not submit copyrighted third-party code without the rights and required notices.
