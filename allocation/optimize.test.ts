import { describe, expect, it } from 'vitest';

import { optimizeAllocation } from './optimize';
import type { OrganizationInput } from './types';

const BUDGET = 1_000_000;

const organizations: OrganizationInput[] = [
  {
    id: 'a',
    name: 'Organization A',
    weight: 1.2,
    initialMarginalUtility: 90,
    diminishingReturns: 1.4,
  },
  {
    id: 'b',
    name: 'Organization B',
    weight: 1,
    initialMarginalUtility: 110,
    diminishingReturns: 2.5,
  },
  {
    id: 'c',
    name: 'Organization C',
    weight: 0.8,
    initialMarginalUtility: 80,
    diminishingReturns: 0.8,
  },
];

describe('optimizeAllocation', () => {
  it('spends the complete budget without negative allocations', () => {
    const result = optimizeAllocation(organizations, BUDGET);
    const total = result.allocations.reduce(
      (sum, allocation) => sum + allocation.dollars,
      0,
    );

    expect(total).toBeCloseTo(BUDGET, 8);
    expect(result.allocations.every((allocation) => allocation.dollars >= 0)).toBe(
      true,
    );
  });

  it('is deterministic', () => {
    expect(optimizeAllocation(organizations, BUDGET)).toEqual(
      optimizeAllocation(organizations, BUDGET),
    );
  });

  it('returns zero allocations and utility for a zero budget', () => {
    const result = optimizeAllocation(organizations, 0);

    expect(result.totalUtility).toBe(0);
    expect(result.allocations.map((allocation) => allocation.dollars)).toEqual([
      0, 0, 0,
    ]);
  });

  it('splits funding equally when utility curves are equal', () => {
    const identical = organizations.map((organization) => ({
      ...organization,
      weight: 1,
      initialMarginalUtility: 100,
      diminishingReturns: 2,
    }));
    const result = optimizeAllocation(identical, BUDGET);

    for (const allocation of result.allocations) {
      expect(allocation.dollars).toBeCloseTo(BUDGET / 3, 7);
    }
  });

  it('uses a deterministic equal split when every utility is zero', () => {
    const noValue = organizations.map((organization) => ({
      ...organization,
      weight: 0,
    }));
    const result = optimizeAllocation(noValue, BUDGET);

    for (const allocation of result.allocations) {
      expect(allocation.dollars).toBeCloseTo(BUDGET / 3, 7);
      expect(allocation.utility).toBe(0);
    }
  });

  it('does not reduce an organization allocation when its starting utility rises', () => {
    const baseline = optimizeAllocation(organizations, BUDGET).allocations[0].dollars;

    for (const initialMarginalUtility of [100, 120, 150, 220]) {
      const changed = organizations.map((organization, index) =>
        index === 0 ? { ...organization, initialMarginalUtility } : organization,
      );
      const allocation = optimizeAllocation(changed, BUDGET).allocations[0].dollars;

      expect(allocation).toBeGreaterThanOrEqual(baseline);
    }
  });

  it('can allocate the full budget to an overwhelmingly preferred organization', () => {
    const extreme = organizations.map((organization, index) =>
      index === 0
        ? { ...organization, weight: 100, initialMarginalUtility: 1_000 }
        : organization,
    );
    const result = optimizeAllocation(extreme, BUDGET);

    expect(result.allocations[0].dollars).toBeCloseTo(BUDGET, 8);
    expect(result.allocations[1].dollars).toBe(0);
    expect(result.allocations[2].dollars).toBe(0);
  });

  it('equalizes marginal utility across funded organizations', () => {
    const result = optimizeAllocation(organizations, BUDGET);
    const funded = result.allocations.filter((allocation) => allocation.dollars > 0);

    for (const allocation of funded) {
      expect(allocation.marginalUtility).toBeCloseTo(result.shadowPrice, 10);
    }
  });

  it('rejects invalid budgets and curve parameters', () => {
    expect(() => optimizeAllocation(organizations, -1)).toThrow(/Budget/);
    expect(() =>
      optimizeAllocation(
        [{ ...organizations[0], diminishingReturns: 0 }],
        BUDGET,
      ),
    ).toThrow(/Diminishing returns/);
  });
});
