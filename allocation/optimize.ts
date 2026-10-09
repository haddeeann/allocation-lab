import type {
  AllocationResult,
  OrganizationAllocation,
  OrganizationInput,
} from './types';
import {
  DOLLARS_PER_FUNDING_UNIT,
  marginalUtilityAtFunding,
  utilityAtFunding,
} from './utility';

const BISECTION_STEPS = 120;

function assertValidInputs(
  organizations: OrganizationInput[],
  budget: number,
  fundingScale: number,
): void {
  if (!Number.isFinite(budget) || budget < 0) {
    throw new RangeError('Budget must be a finite, non-negative number.');
  }

  if (organizations.length === 0 && budget > 0) {
    throw new RangeError(
      'At least one organization is required for a positive budget.',
    );
  }
  if (!Number.isFinite(fundingScale) || fundingScale <= 0) {
    throw new RangeError(
      'Funding scale must be a finite number greater than zero.',
    );
  }

  for (const organization of organizations) {
    const values = [
      organization.weight,
      organization.initialMarginalUtility,
      organization.diminishingReturns,
    ];

    if (values.some((value) => !Number.isFinite(value))) {
      throw new RangeError(
        `All parameters for ${organization.name} must be finite.`,
      );
    }
    if (organization.weight < 0 || organization.initialMarginalUtility < 0) {
      throw new RangeError(
        `Utility inputs for ${organization.name} cannot be negative.`,
      );
    }
    if (organization.diminishingReturns <= 0) {
      throw new RangeError(
        `Diminishing returns for ${organization.name} must be greater than zero.`,
      );
    }
  }
}

export function optimizeAllocation(
  organizations: OrganizationInput[],
  budget: number,
  fundingScale = DOLLARS_PER_FUNDING_UNIT,
): AllocationResult {
  assertValidInputs(organizations, budget, fundingScale);

  if (budget === 0 || organizations.length === 0) {
    return {
      budget,
      totalUtility: 0,
      shadowPrice: 0,
      allocations: organizations.map((organization) => ({
        organizationId: organization.id,
        dollars: 0,
        share: 0,
        utility: 0,
        marginalUtility: marginalUtilityAtFunding(
          organization,
          0,
          fundingScale,
        ),
      })),
    };
  }

  const budgetInFundingUnits = budget / fundingScale;
  const startingMarginals = organizations.map(
    (organization) => organization.weight * organization.initialMarginalUtility,
  );
  let lowerPrice = 0;
  let upperPrice = Math.max(...startingMarginals);

  if (upperPrice === 0) {
    const equalDollars = budget / organizations.length;
    const allocations = organizations.map((organization, index) => {
      const dollars =
        index === organizations.length - 1
          ? budget - equalDollars * (organizations.length - 1)
          : equalDollars;

      return {
        organizationId: organization.id,
        dollars,
        share: dollars / budget,
        utility: 0,
        marginalUtility: 0,
      };
    });

    return {
      budget,
      totalUtility: 0,
      shadowPrice: 0,
      allocations,
    };
  }

  for (let step = 0; step < BISECTION_STEPS; step += 1) {
    const candidatePrice = (lowerPrice + upperPrice) / 2;
    const demandedFunding = organizations.reduce(
      (total, organization, index) => {
        const funding = Math.max(
          0,
          (startingMarginals[index] / candidatePrice - 1) /
            organization.diminishingReturns,
        );
        return total + funding;
      },
      0,
    );

    if (demandedFunding > budgetInFundingUnits) {
      lowerPrice = candidatePrice;
    } else {
      upperPrice = candidatePrice;
    }
  }

  const shadowPrice = (lowerPrice + upperPrice) / 2;
  const dollars = organizations.map((organization, index) =>
    Math.max(
      0,
      ((startingMarginals[index] / shadowPrice - 1) /
        organization.diminishingReturns) *
        fundingScale,
    ),
  );

  const allocated = dollars.reduce((sum, value) => sum + value, 0);
  const remainder = budget - allocated;
  if (dollars.length > 0) {
    const firstFundedIndex = dollars.findIndex((value) => value > 0);
    dollars[firstFundedIndex >= 0 ? firstFundedIndex : 0] += remainder;
  }

  const allocations: OrganizationAllocation[] = organizations.map(
    (organization, index) => ({
      organizationId: organization.id,
      dollars: dollars[index],
      share: dollars[index] / budget,
      utility: utilityAtFunding(organization, dollars[index], fundingScale),
      marginalUtility: marginalUtilityAtFunding(
        organization,
        dollars[index],
        fundingScale,
      ),
    }),
  );

  return {
    budget,
    shadowPrice,
    allocations,
    totalUtility: allocations.reduce(
      (sum, allocation) => sum + allocation.utility,
      0,
    ),
  };
}
