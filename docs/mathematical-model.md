# Mathematical model

The explorer treats each organization's funding as a continuous quantity. For
organization `i`, the weighted utility produced by `xᵢ` dollars is:

```text
Uᵢ(xᵢ) = wᵢ mᵢ log(1 + dᵢ xᵢ / S) / dᵢ
```

where:

- `wᵢ` is the evaluator weight;
- `mᵢ` is the starting marginal utility before evaluator weighting;
- `dᵢ > 0` controls how quickly returns diminish; and
- `S = $1,000,000` is a scaling constant that keeps the displayed parameters
  readable.

This curve is increasing and concave. Its weighted marginal utility, measured
per funding unit, is:

```text
Uᵢ′(xᵢ) = wᵢ mᵢ / (1 + dᵢ xᵢ / S)
```

The optimizer maximizes `Σ Uᵢ(xᵢ)` subject to `Σ xᵢ = budget` and `xᵢ ≥ 0`.
At the optimum, every funded organization has the same marginal utility
`λ`; an unfunded organization has a starting marginal utility no greater than
`λ`. Rearranging that condition gives:

```text
xᵢ / S = max(0, (wᵢ mᵢ / λ - 1) / dᵢ)
```

The engine finds `λ` with a deterministic bisection search, then applies a
tiny floating-point remainder to the first funded organization so allocations
sum exactly to the budget. If every weighted utility is zero, the engine uses a
deterministic equal split because every feasible allocation is equally optimal.

This model is intentionally illustrative. The controls do not represent claims
about real organizations, and utility values are comparable only within the
scenario shown.
