import { describe, expect, it } from 'vitest';

import { combineEvaluatorPreferences } from './evaluators';
import { optimizeAllocation } from './optimize';
import type { EvaluatorInput, OrganizationCurveInput } from './types';

const organizations: OrganizationCurveInput[] = [
  {
    id: 'a',
    name: 'Organization A',
    initialMarginalUtility: 100,
    diminishingReturns: 1,
  },
  {
    id: 'b',
    name: 'Organization B',
    initialMarginalUtility: 100,
    diminishingReturns: 1,
  },
];

const evaluators: EvaluatorInput[] = [
  {
    id: 'alice',
    name: 'Alice',
    influence: 0.5,
    organizationScores: { a: 1.6, b: 0.4 },
  },
  {
    id: 'bob',
    name: 'Bob',
    influence: 0.5,
    organizationScores: { a: 0.8, b: 1.2 },
  },
];

describe('combineEvaluatorPreferences', () => {
  it('uses an influence-weighted average of evaluator scores', () => {
    const combined = combineEvaluatorPreferences(organizations, evaluators);

    expect(combined[0].weight).toBeCloseTo(1.2, 12);
    expect(combined[1].weight).toBeCloseTo(0.8, 12);
  });

  it('reproduces one evaluator profile at an influence extreme', () => {
    const aliceOnly = evaluators.map((evaluator) => ({
      ...evaluator,
      influence: evaluator.id === 'alice' ? 1 : 0,
    }));
    const combined = combineEvaluatorPreferences(organizations, aliceOnly);

    expect(combined.map((organization) => organization.weight)).toEqual([1.6, 0.4]);
  });

  it('moves funding toward organizations preferred by a more influential evaluator', () => {
    const baselineOrganizations = combineEvaluatorPreferences(
      organizations,
      evaluators,
    );
    const bobLed = combineEvaluatorPreferences(
      organizations,
      evaluators.map((evaluator) => ({
        ...evaluator,
        influence: evaluator.id === 'bob' ? 0.8 : 0.2,
      })),
    );
    const baseline = optimizeAllocation(baselineOrganizations, 1_000_000);
    const changed = optimizeAllocation(bobLed, 1_000_000);

    expect(changed.allocations[1].dollars).toBeGreaterThan(
      baseline.allocations[1].dollars,
    );
  });

  it('rejects missing scores and an all-zero influence mix', () => {
    expect(() =>
      combineEvaluatorPreferences(organizations, [
        { ...evaluators[0], organizationScores: { a: 1 } },
      ]),
    ).toThrow(/score/);
    expect(() =>
      combineEvaluatorPreferences(
        organizations,
        evaluators.map((evaluator) => ({ ...evaluator, influence: 0 })),
      ),
    ).toThrow(/positive influence/);
  });
});
