import type { OrganizationInput } from './types';

export const DOLLARS_PER_FUNDING_UNIT = 1_000_000;

export function utilityAtFunding(
  organization: OrganizationInput,
  dollars: number,
  fundingScale = DOLLARS_PER_FUNDING_UNIT,
): number {
  const fundingUnits = dollars / fundingScale;
  const { weight, initialMarginalUtility, diminishingReturns } = organization;

  return (
    (weight *
      initialMarginalUtility *
      Math.log1p(diminishingReturns * fundingUnits)) /
    diminishingReturns
  );
}

export function marginalUtilityAtFunding(
  organization: OrganizationInput,
  dollars: number,
  fundingScale = DOLLARS_PER_FUNDING_UNIT,
): number {
  const fundingUnits = dollars / fundingScale;

  return (
    (organization.weight * organization.initialMarginalUtility) /
    (1 + organization.diminishingReturns * fundingUnits)
  );
}
