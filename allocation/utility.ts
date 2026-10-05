import type { OrganizationInput } from './types';

export const DOLLARS_PER_FUNDING_UNIT = 1_000_000;

export function utilityAtFunding(
  organization: OrganizationInput,
  dollars: number,
): number {
  const fundingUnits = dollars / DOLLARS_PER_FUNDING_UNIT;
  const { weight, initialMarginalUtility, diminishingReturns } = organization;

  return (
    (weight * initialMarginalUtility * Math.log1p(diminishingReturns * fundingUnits)) /
    diminishingReturns
  );
}

export function marginalUtilityAtFunding(
  organization: OrganizationInput,
  dollars: number,
): number {
  const fundingUnits = dollars / DOLLARS_PER_FUNDING_UNIT;

  return (
    (organization.weight * organization.initialMarginalUtility) /
    (1 + organization.diminishingReturns * fundingUnits)
  );
}
