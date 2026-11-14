# GitHub Actions minutes policy (all Brightmade Studios repos)

The same file is in every Brightmade repo; the brightmate copy (`docs/ci-minutes.md`) is the original. Keep them in step.

All repos live in the Brightmade-Studios organization and share one pool of included Actions minutes (3,000 a month). Public repos are free; private repos draw from the pool. A macOS minute costs about 10x a Linux minute ($0.062 vs $0.006 at 2026 prices), so one Mac build of a few minutes uses as much as forty Linux checks. Every job is also rounded up to a whole minute.

November 2026 (Nov 1 to 14): about 2,780 pool minutes used. brightmate's `iOS build` (macOS) was about 2,100 of them: 59 runs of about 3.5 minutes, across 23 PR branches (one branch ran it 13 times). Everything on Linux across all repos was about 680.

## Rules for every workflow

1. **Linux by default.** `runs-on: ubuntu-latest` for everything except a job that truly needs Apple tools (compiling Swift for iOS/Mac). Lint, tests, rules tests and deploys never run on macOS.
2. **Every job has `timeout-minutes`** (10 for Linux checks and deploys, 20 for a Mac build). The default is 6 hours, and one hung job can eat the whole month.
3. **Cancel stale runs on PRs.** Each PR check workflow has
   ```yaml
   concurrency:
     group: <workflow>-${{ github.ref }}
     cancel-in-progress: true
   ```
   Deploy workflows keep `cancel-in-progress: false` so a deploy is never cut off halfway.
4. **One run per commit.** Checks run on `pull_request`; `push` runs only on `main` (for deploys). Never trigger the same check on both `push` to every branch and `pull_request`.
5. **Only when relevant files change.** Use `paths:` (or `paths-ignore:` for docs, `**.md`, images) so a README or design-file change runs nothing.
6. **Cache dependencies.** `actions/setup-node` with `cache: npm`; `actions/cache` for emulators, Playwright browsers, Swift packages and their build output.
7. **macOS jobs are extra strict:** no draft PRs (`if: github.event.pull_request.draft == false` with `ready_for_review` in the trigger types), cached Swift packages and DerivedData, `COMPILER_INDEX_STORE_ENABLE=NO`, and no informational steps.

## How Claude works in these repos

- Batch changes: push a PR's work in as few pushes as possible instead of one push per small tweak, because each push to an app PR is a Mac build.
- For long multi-step work on an Apple app, open the PR as a draft and mark it ready when it should be compiled. Each push after that is a check.
- Don't re-run a green build to "make sure", and don't trigger `workflow_dispatch` builds without a reason.

## Backstop

Org **Settings > Billing and licensing > Budgets and alerts**: keep an Actions budget with "stop usage when budget is reached" turned on, so running out means checks pause instead of a surprise bill. At the pace before these rules, the rest of a month cost roughly $45 to $50 in Mac overage; after them it should fit inside the included minutes.

If Mac builds still outgrow the pool, the next steps are moving the PR compile check to Xcode Cloud (25 compute hours a month come with the Apple Developer Program) or a self-hosted runner on a Mac (free GitHub minutes, but the Mac has to be awake).
