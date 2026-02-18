# Contributing Guidelines

Contributions are welcome. We value contributions of all kinds, including bug reports, feature requests, code changes, and documentation improvements. This document gives you the essentials: what we expect, how to submit changes, and where to find detailed guidelines.

## Non-negotiables

For a contribution to be accepted, the following must hold:

- **Commit and PR title format**: Follow [Conventional Commits](docs/contributing/commit-conventions.md). Commits and PR titles MUST use the specified format.
- **CI must pass**: Tests, lint, and format checks must pass. See [Required checks](#required-checks) below.
- **Review response**: When addressing review comments, reply with the commit hash that addresses each comment and do not resolve the thread until the reviewer confirms. See [Documentation and PR guidelines](docs/contributing/docs-and-pr-policy.md#responding-to-review-comments).
- **Code quality and tests**: Follow the project’s [code quality guidelines](docs/contributing/code-quality.md). Business logic must be testable and covered by tests.
- **Action inputs**: When adding or changing Action inputs, follow the [GitHub Actions input handling guidelines](docs/contributing/github-actions-inputs.md) (e.g. `OPTIONAL: ` / `DEPRECATED: ` prefixes).

## Basic workflow

1. Open or find an issue (or confirm the change is wanted).
2. Create a branch from the default branch.
3. Make your changes, run required checks locally (see below).
4. Open a Pull Request.
5. Address review feedback (reply with commit hashes per comment).
6. After approval and passing CI, the PR can be merged.

## Required checks

Before pushing or requesting review, run:

- `npm run check:test` — unit tests and coverage
- `npm run check:lint` — ESLint
- `npm run check:format` — formatting (or `npm run fix:format` to fix)

CI runs these checks; they must pass for the PR to be mergeable.

## Definition of Done

A PR is ready to merge when:

- All required checks pass (tests, lint, format).
- At least one reviewer has approved (if required by the repository).
- All review conversations are addressed and the reviewer has confirmed.
- Commit messages and PR title follow [Conventional Commits](docs/contributing/commit-conventions.md).

## Where to ask questions

Open a [GitHub Issue](https://github.com/tomody-dev/nylbot/issues) for questions, bug reports, or feature discussions.

## Security

For security-sensitive issues, please report them privately (e.g. via GitHub Security Advisories or the repository’s preferred channel) rather than in a public issue.

## Detailed guidelines

- [Commit and PR title conventions](docs/contributing/commit-conventions.md) — Conventional Commits, types, dependency update policy
- [Documentation and PR guidelines](docs/contributing/docs-and-pr-policy.md) — Metrics in docs, PR descriptions, responding to review
- [Code quality guidelines](docs/contributing/code-quality.md) — Refactoring, naming, module organization, testing
- [GitHub Actions input handling](docs/contributing/github-actions-inputs.md) — Input `description` rules for this Action

For local setup and running the Action, see [Development](docs/development.md).
