# Mathematical model

The explorer gives each evaluator `e` an influence `αₑ` and a score `sₑᵢ` for
option `i`. It combines those judgments with a normalized weighted mean:

```text
w̄ᵢ = Σₑ αₑ sₑᵢ / Σₑ αₑ
```

The influence values are non-negative and at least one must be positive. The UI
keeps the two evaluators' influence shares summing to 100%, while the engine accepts
any equivalent non-negative scale.

The explorer treats each option's resource allocation as a continuous quantity.
For option `i`, the utility produced by `xᵢ` dollars or hours is:

```text
Uᵢ(xᵢ) = w̄ᵢ mᵢ log(1 + dᵢ xᵢ / S) / dᵢ
```

where:

- `w̄ᵢ` is the combined evaluator score;
- `αₑ` is evaluator `e`'s relative influence;
- `sₑᵢ` is evaluator `e`'s score for option `i`;
- `mᵢ` is the starting marginal utility before evaluator weighting;
- `dᵢ > 0` controls how quickly returns diminish; and
- `S` is the scenario's total available resource. It is $1,000,000 for grants,
  40 hours for team time, and $500,000 for risk reduction.

This curve is increasing and concave. Its weighted marginal utility, measured
per resource unit, is:

```text
Uᵢ′(xᵢ) = w̄ᵢ mᵢ / (1 + dᵢ xᵢ / S)
```

The optimizer maximizes `Σ Uᵢ(xᵢ)` subject to `Σ xᵢ = budget` and `xᵢ ≥ 0`.
At the optimum, every selected option has the same marginal utility
`λ`; an unselected option has a starting marginal utility no greater than
`λ`. Rearranging that condition gives:

```text
xᵢ / S = max(0, (w̄ᵢ mᵢ / λ - 1) / dᵢ)
```

The engine finds `λ` with a deterministic bisection search, then applies a
tiny floating-point remainder to the first selected option so allocations
sum exactly to the budget. If every weighted utility is zero, the engine uses a
deterministic equal split because every feasible allocation is equally optimal.

This model is intentionally illustrative. The controls do not represent claims
about real organizations or operational priorities, and utility values are comparable only within the
scenario shown.
