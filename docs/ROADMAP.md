# Allocation Lab product roadmap

Updated October 27, 2026.

## Current direction

Allocation Lab is becoming a personal decision-support tool for a solopreneur
deciding which projects deserve limited time, money, and energy.

The existing Mini S-Process Explorer remains part of the project as a working
demonstration of the underlying ideas: combining judgments, allocating a scarce
resource, and accounting for diminishing returns. It is not the primary product
workflow.

The original product question was:

> Given what I currently believe, what portfolio of actions should I take during
> the next planning period, and what evidence would change that recommendation?

The first feedback cycle exposed an earlier problem:

> How do I keep my real projects visible, remember where I left off, and direct
> attention intentionally when memory and whatever currently attracts attention
> otherwise determine what gets worked on?

That problem is real, but Pat is already addressing it through her calendar and
other tools. Allocation Lab should not duplicate that work. The more relevant
decision begins as the current project cycle ends:

> When several genuinely different futures are available—seriously monetizing a
> project, returning to school, finishing novels, or pursuing another direction—
> what should I commit to, what should I test, and which options should I preserve?

The personal decision is also a candidate instance of a broader problem: AI
increases the number of things an individual can plausibly attempt while time,
attention, money, and identity remain constrained. The project will test whether
a rigorous, understandable strategic-choice tool can help with those tradeoffs
without reducing them to a superficial weighted score.

This is a tool Pat intends to use herself. Monetization, team collaboration, and
turning it into a general-purpose business product are not current requirements.

## Product principles

- **Support judgment; do not impersonate certainty.** Recommendations must show
  their assumptions, uncertainty, and sensitivity.
- **Recommend a portfolio, not merely a winner.** A useful result can divide time
  between validation, delivery, maintenance, and deliberate deferral.
- **Use ordinary language first.** The interface should ask questions a business
  owner can answer. Mathematical controls and derivations belong in explanations
  or an advanced view.
- **Prefer the next informative action.** When evidence is weak, a small test may
  be more valuable than committing to a full project.
- **Keep estimates distinct from outcomes.** The tool should eventually help Pat
  compare what she expected with what actually happened.
- **Preserve agency.** The recommendation is an inspectable argument that Pat can
  challenge or override, not an automated command.
- **Stay local and lightweight until reality requires more.** The initial product
  should not require accounts, a backend, or external integrations.

## Candidate decision workflow

1. **Frame the choice.** Define the decision horizon, what must be decided now,
   and what can remain open.
2. **Name the futures.** Include serious options and meaningful combinations,
   not only current projects.
3. **Clarify what matters.** Separate terminal values such as meaning or
   security from instrumental goals such as credentials or revenue.
4. **Describe uncertainty.** Record evidence, plausible scenarios, and unknowns
   without forcing false probabilities.
5. **Identify strategic actors.** Include customers, schools, markets, or other
   actors only where their responses change the decision.
6. **Compare commitments.** Evaluate expected utility, reversibility, cost of
   delay, option value, regret, and resource constraints as appropriate.
7. **Prefer informative moves when warranted.** Recommend a test or
   option-preserving step when learning is more valuable than an early permanent
   commitment.
8. **Challenge and revisit.** Show which assumptions drive the result and when
   the decision should be reconsidered.

## Mathematical direction

The current logarithmic utility curves remain useful for allocation under
diminishing returns, but they are only one possible component. The strategic
model may combine:

- multi-attribute utility for unlike kinds of value;
- scenario analysis for uncertain futures;
- real-options reasoning for reversible and option-preserving moves;
- value of information for learning experiments;
- regret and robustness when probabilities are poorly known;
- portfolio allocation when multiple paths can coexist; and
- game theory only when another actor's strategic response materially matters.

These are working hypotheses, not a requirement to place every method in one
formula. The tool should select the simplest methods that illuminate the actual
decision and expose where different methods disagree.

## Delivery phases

### Phase 0 — Frame the strategic-choice problem

**Status:** Current; reframed after two rounds of feedback.

Define the upcoming choice among major future directions closely enough to run a
manual decision process before building a vertical slice.

Deliverables:

- A plain-language definition of the strategic decision and horizon.
  **Direction drafted; precise horizon pending.**
- A draft set of questions and result categories. **Earlier action-level draft
  superseded; strategic version pending.**
- Two or three real or realistically anonymized project examples.
- A paper-level walkthrough of the proposed recommendation. **Fictional example
  drafted; real-decision review pending.**
- A documented choice of the first mathematical model. **Candidate documented;
  challenged by feedback and not approved.**
- A map of the serious future options, including monetization candidates,
  education, and writing. **Pending.**
- A manual strategic-choice review that considers uncertainty, reversibility,
  option value, and what can be learned before committing. **Pending.**

See [the Phase 0 decision design](PHASE-0-DECISION-DESIGN.md).

Exit evidence:

- Pat can answer the proposed questions without needing to translate specialist
  terminology.
- The draft result would alter, clarify, or defend a real project decision.
- We can identify which parts are measured facts, estimates, and preferences.

**Feedback gate:** Run one manual strategic-choice review using Pat's real
options before changing the application architecture.

### Phase 1 — Personal portfolio vertical slice

**Status:** Planned.

Build the smallest complete workflow for planning one period.

Initial scope:

- One resource: available work hours.
- One planning horizon at a time, initially a week or month.
- Approximately three to eight candidate projects.
- Guided project assessment in plain language.
- A proposed allocation with pursue, test, maintain, defer, or stop guidance.
- A concise explanation of the most important reasons.
- Local browser persistence, with an explicit reset or export path before data
  is relied upon.
- A route back to the existing S-Process Explorer and mathematical explanation.

Exit evidence:

- Pat can enter a real decision without developer assistance.
- Allocations are feasible, deterministic, and mathematically traceable.
- The result states what to do next rather than only displaying scores.
- Reloading does not unexpectedly lose the working decision.

**Feedback gate:** Guided use on one real planning decision, followed by an
implementation pass on confusing inputs, missing factors, and unhelpful output.

### Phase 2 — Uncertainty and sensitivity

**Status:** Planned after Phase 1 evidence.

Help Pat understand when the recommendation is robust and when it depends on a
fragile assumption.

Candidate capabilities:

- Confidence ranges or simple low/base/high estimates.
- “What would change this recommendation?” explanations.
- Identification of the assumption with the highest decision leverage.
- Small validation experiments when learning is more valuable than committing.
- Explicit manual overrides with a recorded reason.

Exit evidence:

- The tool distinguishes a strong recommendation from a close call.
- At least one sensitivity explanation is understandable without reading the
  formula.
- Uncertainty does not create false numerical precision.

**Feedback gate:** Change uncertain assumptions in a real scenario and judge
whether the explanation helps Pat decide what to investigate.

### Phase 3 — Review and learning loop

**Status:** Planned after repeated planning use.

Connect decisions to outcomes without turning the product into project-management
software.

Candidate capabilities:

- Save a dated decision snapshot.
- Record actual time spent and the most important outcome or evidence.
- Compare estimates with outcomes.
- Carry forward revised beliefs into the next planning period.
- Show a compact decision history.

Exit evidence:

- Reviewing a prior period improves the next decision.
- The review takes only a few minutes.
- The history explains changed beliefs rather than merely accumulating data.

**Feedback gate:** Complete an end-of-period review and decide which history is
useful enough to retain.

### Phase 4 — Real-use hardening

**Status:** Conditional.

Improve reliability and convenience based on repeated personal use.

Possible work:

- Import/export and backup.
- Better keyboard and mobile use.
- Accessibility review.
- Model calibration and stronger property-based tests.
- Privacy and data-loss safeguards.

This phase is driven by observed friction, not a predetermined feature list.

### Phase 5 — Optional sharing or collaboration

**Status:** Deferred.

Only consider shareable decision records, multiple participants, accounts, or a
hosted data service if Pat's own use creates a concrete need. A desire to show
the method may be satisfied by the existing public Explorer without making
private decisions collaborative.

## Explicitly deferred

- Monetization and subscription design.
- A general-purpose tool for every kind of business decision.
- Project-management features such as task boards and time tracking.
- Automatic financial forecasts presented as facts.
- Multiple strategic actors or game-theoretic simulations without a real case.
- Team accounts, permissions, and cloud synchronization.
- More demonstration scenarios merely to make the product appear larger.

## Current next actions

1. Define the horizon and the actual decision that will arise as the current
   projects wrap up.
2. Map the serious option families: monetizing particular projects, school,
   novels, and any important alternatives or combinations.
3. Distinguish terminal values from instrumental goals, constraints from
   preferences, and evidence from speculation.
4. Compare candidate methods—multi-criteria utility, scenario analysis, real
   options, value of information, regret, and portfolio allocation—and use only
   those that improve the decision.
5. Run the method manually, identify where it clarifies or distorts the choice,
   and then lock the first product slice.

## How this roadmap changes

After each feedback cycle, update the phase status, decisions, and next actions.
Do not silently rewrite prior product decisions: record meaningful reversals in
the feedback log and link them here. A phase is complete when its exit evidence
exists, not merely when its code has been written.
