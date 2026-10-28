# Phase 0 decision design

Updated October 27, 2026. Status: initial hypothesis challenged by first
feedback. Retained as a record, not approved for implementation.

> **Feedback note:** The design below assumes that Pat arrives at a distinct
> decision moment with a stable, remembered list of candidate projects and
> actions. Pat's first feedback indicates that this is not how the problem is
> experienced. Projects move in and out of awareness; what is remembered and
> what captures attention often determines what receives work. Before building
> the action optimizer, Phase 0 must investigate project visibility, continuity,
> resurfacing, and the relationship to calendar planning. See Cycle 1 in
> [FEEDBACK.md](FEEDBACK.md).

> **Second feedback note:** The attention problem is genuine but is already being
> addressed by Pat's calendar and related tools. Allocation Lab should instead
> focus on the upcoming strategic choice among substantially different futures,
> such as monetizing a project, returning to school, or concentrating on novels.
> The action model below is preserved as design history and may later contribute
> to an implementation, but it is not the current product definition.

## The first decision this tool should support

> For one upcoming week or month, which meaningful actions across my active
> projects deserve the work hours I can realistically choose, and which actions
> should I deliberately defer?

The first version should not attempt to predict the total lifetime value of a
business. It should help make one bounded planning decision using current
evidence and preferences.

The word **action** is important. “Work on Project A for 6.4 hours” is rarely a
useful commitment. “Spend six hours publishing the first consulting offer” is
observable, reviewable, and can produce either an outcome or new evidence.

## What the first version decides

The tool decides among the next meaningful actions attached to several projects.
It may recommend actions from more than one project. It may also leave time
unallocated rather than forcing every hour into a low-value action.

It does not initially decide:

- whether a project should exist forever;
- the precise order of every task;
- what Pat must do despite her own judgment;
- whether an estimate is objectively true; or
- how to manage the chosen work after the decision.

## How the S-Process ideas translate

| Explorer concept | Personal decision-tool interpretation |
| --- | --- |
| Shared budget | Work hours Pat can realistically choose during the period |
| Organizations | Candidate project actions |
| Evaluators | Values or decision perspectives that matter to Pat |
| Evaluator influence | How important each perspective is in this planning period |
| Utility | The expected usefulness of completing an action |
| Diminishing returns | Later actions on the same project often add less than the first useful action |
| Tranches | Discrete, meaningful blocks of work rather than arbitrary fractions of an hour |
| Allocation | The selected portfolio of actions under the available-hours constraint |

This keeps the intellectual lineage without pretending that a collaborative
funding process and an individual's weekly plan are identical.

## Proposed conversation with the tool

### Step 1 — Frame the planning period

The interface should ask:

1. **What period are you planning?**
   Example: October 19–25 or November 2026.
2. **How many hours can you genuinely choose during this period?**
   Exclude sleep, fixed appointments, committed client work, and other hours that
   are not part of this decision.
3. **How much breathing room do you want to protect?**
   Reserve a buffer before optimization so the result is not a fantasy schedule.
4. **Are there any actions you have already committed to?**
   Show these in the plan, subtract their time, and do not disguise them as an
   algorithmic recommendation.

The result of this step is a transparent capacity statement:

```text
Chooseable hours − protected buffer − prior commitments = decision capacity
```

### Step 2 — Say what matters in this period

Start with five perspectives. Pat distributes 100 points among them, with a
plain-language preset available so exact weighting is optional.

| Perspective | Question it answers |
| --- | --- |
| Income and stability now | Could this action improve near-term revenue, cash flow, or an existing obligation? |
| Future leverage | Could it create reusable assets, capabilities, audience, or future options? |
| Personal sustainability | Does it fit Pat's energy, interest, health, and desired way of working? |
| Urgency and cost of delay | Is there a real deadline, expiring opportunity, or consequence of waiting? |
| Learning | Could it resolve an important uncertainty or cheaply test an assumption? |

These are period-level preferences, not permanent values. A cash-sensitive month
may assign more weight to income; an exploratory week may assign more to
learning.

### Step 3 — Describe each candidate project action

For each project, ask only what the first calculation needs:

1. **Project:** What larger effort does this belong to?
2. **Next meaningful action:** What specific result could you finish or learn?
3. **Hours:** How many focused hours would this action realistically require?
4. **Value:** If completed, how helpful would it be from each perspective?
5. **Confidence:** What supports those estimates?
6. **Dependencies:** Must another action happen first?
7. **Commitment:** Is this optional, or already promised to someone?

Use five labeled choices for each value estimate instead of asking for invented
precision:

| Score | Label | Meaning |
| --- | --- | --- |
| 0 | None | This action does not meaningfully contribute here. |
| 1 | Small | A minor benefit. |
| 2 | Useful | A noticeable but not decisive benefit. |
| 3 | Strong | An important benefit for this period. |
| 4 | Exceptional | One of the strongest available actions on this dimension. |

Confidence should use evidence language:

| Level | Initial numeric mapping | Meaning |
| --- | ---: | --- |
| Guess | 0.25 | Mostly intuition; little direct evidence |
| Some evidence | 0.50 | Indirect evidence or a small relevant signal |
| Strong evidence | 0.75 | Direct evidence from similar work or actual users |
| Known obligation/outcome | 0.95 | The near-term result is unusually predictable |

The mapping is visible in the explanation and remains adjustable as we learn.
It is not a probability claim accurate to two decimal places.

### Step 4 — Receive a decision, not a score table

The primary result should say:

- **Do now:** the selected action portfolio and total hours;
- **Protect:** buffer and already committed work;
- **Defer deliberately:** feasible actions that did not make this period;
- **Blocked:** actions excluded because of unmet dependencies;
- **Why:** the two or three factors that most affected the result;
- **Close calls:** alternatives whose recommendation is sensitive to an estimate;
- **Next evidence:** the assumption most worth testing when uncertainty matters.

Detailed scores can be inspected, but they should not be the main product.

## Candidate Phase 1 mathematics

### 1. Separate facts, estimates, and preferences

- **Facts or constraints:** available hours, protected buffer, commitments,
  action-hour estimates, dependencies, and deadlines.
- **Estimates:** how much an action contributes to each perspective and the
  strength of evidence behind that estimate.
- **Preferences:** the period-level perspective weights and any explicit manual
  override.

Showing these categories should make disagreements with the recommendation more
productive: Pat can see whether she disputes a constraint, an estimate, or a
preference.

### 2. Calculate the value of each action

Let `w_k` be the period weight for perspective `k`, `s_jk` be action `j`'s
0–4 score on that perspective, and `c_j` be its confidence mapping.

For the first four outcome perspectives, confidence discounts estimated value.
Learning is not discounted in the same way because an experiment can be useful
precisely when the outcome is uncertain:

```text
V_j = (
  c_j × Σ(outcome perspective weight × score)
  + learning weight × learning score
) / Σ(all perspective weights)
```

This is an initial model to test, not a scientific measurement of business
value. It deliberately prevents an exciting but unsupported outcome claim from
counting exactly like an obligation with strong evidence. It also lets a small
experiment earn value for reducing uncertainty.

### 3. Choose a feasible action portfolio

The optimizer selects the set of optional actions with the greatest combined
value while:

- staying within decision capacity;
- including prior commitments separately;
- respecting dependencies; and
- selecting an action either completely or not at all.

This is a small, deterministic 0/1 knapsack problem with dependency constraints.
For three to eight projects it can be solved exactly in the browser without a
backend. Stable tie-breaking should prefer the lower-hour portfolio, then the
original action order, so repeated inputs produce repeated results.

Unlike the current continuous optimizer, this model can represent setup costs
and avoids recommending unusably small fragments of work.

### 4. Reintroduce diminishing returns carefully

Phase 1 can begin with one next meaningful action per project. If real use shows
that a single project needs multiple candidate blocks, represent them as ordered
tranches:

1. test the riskiest assumption;
2. build or deliver the first useful version;
3. improve, extend, or promote it.

Later tranches can have lower incremental value and depend on earlier ones. This
is the discrete counterpart of the Explorer's diminishing-return curves and is
more legible in an actual weekly plan.

## Worked example

This example is fictional and exists to make the proposed behavior concrete.

### Planning frame

- Planning period: one week
- Chooseable project time: 17 hours
- Protected buffer: 4 hours
- Decision capacity: 13 hours
- No prior commitments included in the optimizer

### Period preferences

| Perspective | Weight |
| --- | ---: |
| Income and stability now | 30 |
| Future leverage | 25 |
| Personal sustainability | 20 |
| Urgency and cost of delay | 15 |
| Learning | 10 |

### Candidate actions

| Project action | Hours | Income | Leverage | Sustainability | Urgency | Learning | Confidence |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Publish a consulting offer page | 6 | 3 | 3 | 2 | 3 | 1 | Strong evidence (0.75) |
| Run three interviews for a workshop idea | 4 | 2 | 4 | 4 | 3 | 4 | Some evidence (0.50) |
| Ship a promised client deliverable | 7 | 4 | 2 | 2 | 4 | 1 | Known outcome (0.95) |
| Prototype a self-paced course lesson | 8 | 1 | 4 | 4 | 1 | 3 | Some evidence (0.50) |

The resulting action values are approximately:

| Action | Value | Fits with client delivery? |
| --- | ---: | --- |
| Consulting offer page | 1.98 | Yes; total 13 hours |
| Workshop interviews | 1.83 | Yes; total 11 hours |
| Client deliverable | 2.67 | Selected anchor action |
| Course prototype | 1.43 | No; total would be 15 hours |

The proposed portfolio is:

1. Ship the client deliverable — 7 hours.
2. Publish the consulting offer page — 6 hours.

The explanation should also say that the workshop interviews are a close call:
they produce strong learning and future leverage with two fewer hours. A modest
change in period priorities, confidence, or protected buffer could replace the
offer page with the interviews. The course prototype is deliberately deferred
because it does not fit alongside the strongest action and its present value is
lower under this period's priorities.

This is more useful than claiming that the consulting project is universally
“better” than the workshop or course. It is only the proposed portfolio for this
week under these inputs.

## Questions the first review must answer

1. Is a planning period normally a week, a month, or something else?
2. Does choosing **next meaningful actions** match how Pat thinks, or does she
   need an allocation directly at the project level?
3. Are the five perspectives understandable and sufficient? Which feels
   redundant, missing, or uncomfortable to score?
4. Can Pat estimate focused hours for an action more naturally than minimum and
   maximum hours for a project?
5. Does the confidence language help, or does it create false precision?
6. Should personal sustainability combine energy and meaning, or should those be
   separate?
7. Is leaving some time deliberately unallocated acceptable and useful?
8. What should happen when Pat strongly disagrees with the result?

The model and Phase 1 interface should not be locked until this review uses at
least one real or realistically anonymized decision.
