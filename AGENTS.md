# Repository Instructions

## Commit messages

- Use Conventional Commits for every commit and squash-merge PR title: `<type>(optional-scope): <imperative summary>`.
- Use `feat:` for user-visible features, `fix:` for bug fixes, `perf:` for performance improvements, and `refactor:` for internal restructuring that belongs in release notes.
- Use `docs:`, `test:`, `build:`, `ci:`, `style:`, and `chore:` only when the change genuinely fits those maintenance categories. `changelogithub` may omit them from generated release notes.
- Do not use an untyped title for a user-visible change. Because PRs are squash-merged, the PR title must follow the same format and becomes the commit title on `main`.
- Mark breaking changes with `!` after the type or scope, for example `feat(api)!: remove the legacy encoder option`, and explain the migration in a `BREAKING CHANGE:` footer.
- Keep the summary concise, imperative, and specific. Do not end it with a period.

Examples:

- `feat(web): bundle the version-matched WASM asset`
- `fix(core): retry encoder initialization after load failure`
- `perf(core): size output buffers from input dimensions`
- `docs: document HDR encoding options`
- `chore: release v0.5.5`
