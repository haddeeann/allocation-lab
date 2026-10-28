# Allocation Lab

A decision workbench for examining the same difficult choice through several
mathematical and strategic lenses. It includes the original Mini S-Process
Explorer as a method demonstration for grant funding, team time, and risk
reduction.

![Allocation Lab social preview](public/og.png)

## What it demonstrates

- An editable workbench with templates for buy/build/borrow, future-direction,
  and blank decisions.
- Four deliberately separate lenses: weighted tradeoff fit, scenario robustness
  and regret, option preservation, and value of information.
- Visible disagreement between methods instead of a false master score.
- Browser-local draft persistence without accounts or a backend.
- A deterministic continuous optimizer, kept independent of React.
- Three focused decision scenarios: a $1 million grant portfolio, 40 weekly
  team-hours, and a $500,000 risk-mitigation portfolio.
- Two evaluator profiles with adjustable relative influence and
  organization-specific scores.
- Direct manipulation of starting marginal utility and diminishing returns.
- Explanations that compare the current recommendation with a known baseline.
- Utility-curve visualization with the recommended allocations marked.
- Invariant-focused unit tests and browser tests for the critical user flows.

The template values, organizations, and utility values are illustrative. The
application exposes structured judgments; it does not make decisions for the
user or produce objective forecasts.

## Product direction

The Decision Workbench is now the primary product surface. The S-Process
Explorer remains available as a focused method demonstration. Product
development proceeds through small, usable prototypes and feedback rather than
roadmap-only planning.

- [Product roadmap](docs/ROADMAP.md)
- [Feedback process and learning log](docs/FEEDBACK.md)
- [Phase 0 decision design and worked example](docs/PHASE-0-DECISION-DESIGN.md)

## Mathematical model

The model first combines evaluator scores into an influence-weighted score:

```text
w̄ᵢ = Σₑ αₑ sₑᵢ / Σₑ αₑ
```

For option `i`, allocated resource `xᵢ` then produces utility

```text
Uᵢ(xᵢ) = w̄ᵢ mᵢ log(1 + dᵢ xᵢ / S) / dᵢ
```

where `αₑ` is evaluator influence, `sₑᵢ` is that evaluator's score for the
option, `mᵢ` is initial marginal utility, `dᵢ > 0` controls diminishing
returns, and `S` is the scenario's total available resource. Normalizing by
the total makes the same model meaningful for both dollars and hours.

The objective is to maximize `Σ Uᵢ(xᵢ)` subject to a complete, non-negative
allocation of the resource. Because every curve is concave, selected options
are optimal when their final marginal utilities are equal. The engine solves
for that shared marginal value with deterministic bisection. See
[the mathematical model](docs/mathematical-model.md) for the derivation and
edge-case behavior.

## Architecture

```text
decision/
  analyze.ts           independent multi-lens decision analysis
  types.ts             framework-independent workbench contracts
  analyze.test.ts      lens separation, determinism, and validation

allocation/
  evaluators.ts         evaluator-preference aggregation
  optimize.ts           budget-constrained optimizer
  utility.ts            utility and marginal-utility functions
  types.ts              framework-independent contracts
  optimize.test.ts      numerical invariants and edge cases

components/explorer/
  organization-editor.tsx
  evaluator-mix.tsx
  allocation-results.tsx
  utility-chart.tsx
  explanation-panel.tsx
  scenario.ts

components/
  decision-workbench.tsx
  lab-nav.tsx

tests/e2e/
  explorer.spec.ts      interaction, reset, and result-completeness flows
```

Both analysis engines have no UI or framework dependencies. React owns state,
presentation, navigation, and explanation. `/` and `/workbench` open the
Decision Workbench; the original method scenarios remain at `/grants`,
`/team-time`, and `/risk-reduction`.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite (normally `http://localhost:5173`).

For the standalone static build used by Netlify:

```bash
npm run dev:static
npm run build:static
```

The production files are written to `dist-static/`. The included
`netlify.toml` supplies the matching build command and publish directory, so the
repository can be imported into Netlify without additional build settings.

## Quality checks

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

The workbench suite checks lens disagreement, tie agreement, determinism, regret,
and input validation. The allocation suite covers budget conservation,
non-negativity, determinism, zero
budget, equal curves, zero-value curves, extreme preferences, equalized final
marginals, invalid parameters, and allocation monotonicity when starting utility
increases. The evaluator suite checks weighted aggregation, influence extremes,
invalid profiles, and the resulting allocation direction. Playwright verifies
live preference changes, baseline reset, the guided evaluator example, the
complete analytical result, and the workbench's templates, local persistence,
and cross-tool navigation.

## Product and engineering choices

- **Several lenses, no master score:** disagreement can carry more information
  than an artificially precise winner.
- **Three workbench options:** the first prototype stays small enough to test;
  meaningful combinations can be entered as their own option.
- **Editable templates:** concrete examples reduce blank-page friction without
  fixing the user's criteria or scenarios.
- **Continuous allocation:** the model exposes the marginal-utility logic more
  clearly than a coarse dollar-by-dollar simulation.
- **Automatic recalculation:** every control change produces an immediate answer
  and explanation; a redundant submit step would slow comparison.
- **Baseline comparison:** dollar deltas and plain-language parameter effects
  make “why did this move?” answerable without reading the formula.
- **Local persistence, no accounts:** the current draft remains in the browser.
  Adding a backend would not improve the current feedback cycle.

The dependency set was upgraded from the generated scaffold to remediate direct
React, Vite, Cloudflare, and image-processing advisories. `npm audit` still
reports a transitive `braces` denial-of-service advisory in Vinext's build chain;
there is no patched upstream release at the time of this build. The application
does not accept glob patterns or untrusted build input.

## Natural next step

Use the workbench on a real decision and identify which lens clarifies the
choice, which repeats another lens, and which produces a misleading conclusion.
That feedback—not a speculative feature list—determines the next build.
