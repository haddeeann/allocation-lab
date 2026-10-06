import { combineEvaluatorPreferences } from '@/allocation/evaluators';
import type {
  EvaluatorInput,
  OrganizationCurveInput,
  OrganizationInput,
} from '@/allocation/types';

export const BUDGET = 1_000_000;

export type EvaluatorViewModel = EvaluatorInput & {
  color: string;
  tint: string;
};

export type OrganizationScenario = OrganizationCurveInput & {
  shortName: string;
  color: string;
  tint: string;
};

export type OrganizationViewModel = OrganizationScenario & OrganizationInput;

export const DEFAULT_EVALUATORS: EvaluatorViewModel[] = [
  {
    id: 'alice',
    name: 'Alice',
    influence: 0.5,
    color: '#6941c6',
    tint: '#f1ecff',
    organizationScores: {
      harbor: 1.5,
      brightpath: 0.8,
      commonfield: 0.5,
    },
  },
  {
    id: 'bob',
    name: 'Bob',
    influence: 0.5,
    color: '#b54708',
    tint: '#fff3e8',
    organizationScores: {
      harbor: 0.9,
      brightpath: 1.2,
      commonfield: 1.1,
    },
  },
];

export const DEFAULT_ORGANIZATION_SCENARIOS: OrganizationScenario[] = [
  {
    id: 'harbor',
    name: 'Harbor Health',
    shortName: 'A',
    initialMarginalUtility: 90,
    diminishingReturns: 1.4,
    color: '#2756d8',
    tint: '#edf2ff',
  },
  {
    id: 'brightpath',
    name: 'BrightPath Learning',
    shortName: 'B',
    initialMarginalUtility: 110,
    diminishingReturns: 2.5,
    color: '#e15b38',
    tint: '#fff0eb',
  },
  {
    id: 'commonfield',
    name: 'Common Field',
    shortName: 'C',
    initialMarginalUtility: 80,
    diminishingReturns: 0.8,
    color: '#128278',
    tint: '#e8f7f4',
  },
];

export function resolveOrganizations(
  organizations: OrganizationScenario[],
  evaluators: EvaluatorViewModel[],
): OrganizationViewModel[] {
  const combined = combineEvaluatorPreferences(organizations, evaluators);

  return organizations.map((organization, index) => ({
    ...organization,
    weight: combined[index].weight,
  }));
}

export const DEFAULT_ORGANIZATIONS = resolveOrganizations(
  DEFAULT_ORGANIZATION_SCENARIOS,
  DEFAULT_EVALUATORS,
);

export function freshEvaluatorDefaults(): EvaluatorViewModel[] {
  return DEFAULT_EVALUATORS.map((evaluator) => ({
    ...evaluator,
    organizationScores: { ...evaluator.organizationScores },
  }));
}

export function freshOrganizationDefaults(): OrganizationScenario[] {
  return DEFAULT_ORGANIZATION_SCENARIOS.map((organization) => ({ ...organization }));
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 0,
});
