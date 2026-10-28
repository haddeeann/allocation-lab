# Allocation Lab feedback log

Updated October 17, 2026.

This file is the durable record of product feedback, decisions, and what changed
as a result. The [roadmap](ROADMAP.md) describes direction; this log records what
we learned while following or changing it.

## Working rhythm

Each product increment follows the same lightweight loop:

1. **Prepare:** Codex builds or drafts a small, testable increment and checks
   everything that does not require Pat's judgment.
2. **Orient:** Codex explains what is ready, why it matters, how long the review
   may take, and which parts need Pat's attention.
3. **Try:** Pat uses a realistic decision. Codex gives one coherent testing
   script rather than a stream of disconnected requests.
4. **Respond:** Pat can provide feedback in whatever form is natural: notes,
   screenshots, corrections, questions, or a walkthrough conversation.
5. **Interpret:** Codex separates the observed problem from a proposed solution,
   identifies model and interface implications, and checks its interpretation
   with Pat when the choice would materially change the product.
6. **Decide:** Accepted, deferred, and rejected changes are recorded here with a
   reason.
7. **Implement and verify:** Codex makes the agreed changes, runs proportionate
   checks, and reports what is ready for the next cycle.
8. **Update the roadmap:** Evidence may advance a phase, keep it open, or change
   the plan.

Feedback gates are opportunities to redirect the work, not requests for
ceremonial approval. Independent engineering fixes can continue without making
Pat re-test everything; questions of usefulness, meaning, and personal workflow
require her judgment.

## How Pat can give feedback

No special format is required. Useful starting points include:

- “I expected this to recommend something different.”
- “I don't know how to answer this question.”
- “This factor matters to me, but the tool never asked about it.”
- “The recommendation is reasonable, but I still don't know what to do Monday.”
- “Changing this assumption should matter more or less than it does.”
- “I would not want to enter or store this information.”
- “This is solving the wrong decision.”

When possible, include what you were trying to decide and what you expected to
happen. A screenshot or spoken walkthrough is enough; Codex is responsible for
turning the raw feedback into a structured record.

## Evidence labels

Use these labels to prevent code completion from being mistaken for product
validation:

- **Drafted:** A concept or interface exists on paper.
- **Built:** The behavior exists in code.
- **Assistant-checked:** Automated or independent checks passed.
- **Pat-tried:** Pat used the increment in a realistic exercise.
- **Real-use evidence:** It affected or clarified an actual decision over time.

## Feedback entry template

Copy this section for each cycle and keep entries chronological.

```md
## Cycle N — Short name

**Date:**
**Roadmap phase:**
**Evidence before review:**
**Version/commit/preview:**
**Suggested review time:**

### What is ready

### What Pat should try

### Questions worth noticing

### Raw feedback

### Interpretation

### Decisions

- Accepted:
- Deferred:
- Rejected:

### Implementation and verification

### Roadmap change
```

## Cycle 0 — Product-direction split

**Date:** October 17, 2026  
**Roadmap phase:** Phase 0 — Frame the real decision  
**Evidence before review:** Existing Explorer is built and assistant-checked;
the solopreneur workflow is discussed but not yet drafted or tried.  
**Version/commit/preview:** Existing baseline at commit `5ad9320`; the new product
direction has no implementation yet.  
**Suggested review time:** 30–45 minutes once the Phase 0 questions and worked
example are ready.

### What is ready

- A working S-Process-inspired allocation demonstration for grants, team time,
  and risk reduction.
- A clear product-direction decision: retain that Explorer as a method demo and
  make personal solopreneur project allocation the main tool.
- An initial roadmap and feedback process.

### What Pat should try

For the next review, choose one upcoming week or month and three to five projects
that genuinely compete for attention. Projects may be anonymized if desired.
The goal will be to test whether the proposed questions describe the decision
accurately before we build the new interface.

### Questions worth noticing

- Is the actual problem choosing one project, dividing time, or deciding what to
  test first?
- Which constraints are truly fixed during the period?
- What kinds of value matter even when they are not immediate revenue?
- Which estimates are evidence-based, and which are guesses?
- What would make a recommendation feel useful rather than falsely authoritative?

### Raw feedback

Pat described the intended tool as something she would use as a small
entrepreneurial business owner to decide which project to work on. The
S-Process, mathematics, and relevant decision theory remain foundational, but
the Explorer becomes a side demonstration rather than the product's central
workflow. The goal is a real personal tool, not necessarily a commercial
business model.

### Interpretation

The product should move from fixed educational scenarios to a recurring,
personal project-portfolio decision. The first design task is to understand
Pat's real planning language and constraints. Building a comprehensive scoring
form before that review would prematurely fix the model.

### Decisions

- **Accepted:** Personal project allocation is the main product direction.
- **Accepted:** Keep the current Explorer as an accessible explanation and
  demonstration of the method.
- **Accepted:** Use planned feedback periods with clear testing instructions and
  implementation follow-through.
- **Deferred:** Monetization, collaboration, and general-market positioning.
- **Deferred:** Selecting the final inputs and formula until a worked personal
  decision has been reviewed.

### Implementation and verification

The roadmap and feedback record have been created. No product code changed in
this cycle.

### Roadmap change

Added Phase 0 so the project questions and mathematical model are reviewed
before the new application workflow is implemented.

## Cycle 1 — First worked-decision design

**Date:** October 17, 2026  
**Roadmap phase:** Phase 0 — Frame the real decision  
**Evidence before review:** Drafted; Pat has now challenged its central premise
before attempting the scoring exercise.  
**Version/commit/preview:** Documentation-only working tree; no product-code
version.  
**Suggested review time:** 20–30 minutes.

### What is ready

The [Phase 0 decision design](PHASE-0-DECISION-DESIGN.md) contains:

- the specific first planning decision;
- a plain-language question flow;
- the mapping from S-Process ideas to a personal tool;
- a candidate action-based mathematical model;
- the proposed result structure; and
- a fictional worked example.

### What Pat should try

Choose a real upcoming week or month and three to five active projects. For each
project, describe only its next meaningful action and estimated focused hours.
Then answer, in ordinary language:

1. How many hours are genuinely available for this decision?
2. How much buffer should remain protected?
3. Which work is already promised rather than optional?
4. What matters most in this period: income now, future leverage, personal
   sustainability, urgency, or learning?
5. For each action, which benefits feel strong and which are uncertain?

Pat can respond conversationally; she does not need to calculate scores or edit
this file. Codex will perform the paper calculation and show the proposed
decision.

### Questions worth noticing

- Does thinking in next actions feel natural, or should the tool allocate time
  directly to whole projects?
- Is any important kind of value missing?
- Which question is hard to answer for a useful reason, and which is merely
  confusing?
- Does reserving buffer make the plan feel more realistic?
- Would the proposed result help decide what to do next?

### Raw feedback

Pat said the proposed exercise did not match how the problem is experienced.
She has worked on several projects over multiple years, including marketing,
teaching, and worldbuilding projects represented in current chats. She does not
remember making explicit portfolio decisions with a stable list of alternatives.
What gets worked on is often what she remembers and what draws her attention.
That is the problem she is trying to improve; if it were merely a matter of
applying a known fix, she would already do so. Her calendar project is partly an
attempt to address this, and her other projects often exist to solve problems or
create tools she herself needs.

Pat then corrected the interpretation. The attention and continuity problem is
real, but she is already close to solving it with the tool set she is creating.
As current in-flight projects wrap over the next few months, the new problem is
what to pursue afterward: seriously monetize one of the projects (and which
one), return to school, finish her novels more seriously, or choose another
direction. She also sees a broader problem: AI expands what individuals can
plausibly make and pursue, creating more consequential tradeoffs. A genuinely
useful tool combining appropriate ideas from decision theory, game theory, the
S-Process, and other methods could therefore help people beyond her.

Pat also identified a research error: Codex asked a leading question and then
treated the resulting answer as independent discovery. Codex's claim that the
exchange scored 7/7 under the non-leading interview diagnostic was incorrect.

### Interpretation

The proposed model begins too late in the process. It assumes project awareness,
continuity, and a discrete choice moment that may not exist. A rational scoring
form could therefore produce a tidy answer without helping with the actual
failure mode.

The first action-allocation model began too late, but the initial correction
overreached in the other direction. Attention allocation is not the target this
project should assume merely because it is a real problem.

The more relevant target is strategic choice under abundance and uncertainty:
comparing futures with different time horizons, payoff types, identities,
reversibility, evidence, and opportunity costs. These choices should not be
forced into a single permanent winner. The method may recommend a commitment,
an option-preserving step, or an experiment that produces information before a
larger commitment.

The personal use case can ground the model, while broader usefulness remains a
hypothesis to test rather than a reason to design for everyone immediately.

### Decisions

- **Accepted:** Do not implement the drafted action-scoring interface as written.
- **Accepted:** Begin from Pat's existing projects and behavior rather than
  requiring her to invent a clean decision scenario.
- **Accepted:** Do not make project resurfacing or attention continuity the
  primary product; those needs are being addressed elsewhere.
- **Accepted:** Reframe the first real use case around Pat's upcoming choice
  among major future directions.
- **Deferred:** The discrete-action optimizer, the five proposed value
  perspectives, and any single favored mathematical method.
- **Pending confirmation:** Which combination of decision methods meaningfully
  improves the strategic choice and can generalize without becoming a generic
  scoring form.

### Implementation and verification

The initial design and the temporary attention-tool interpretation remain
documented as falsified or superseded hypotheses. The roadmap now targets the
strategic-choice problem. No application code changed.

### Roadmap change

Phase 0 now focuses on a manual strategic-choice process for the period after
the current projects wrap. The next exercise maps future options and selects the
decision methods before any scoring interface is built.
