import { combineEvaluatorPreferences } from '@/allocation/evaluators';
import type {
  EvaluatorInput,
  OrganizationCurveInput,
  OrganizationInput,
} from '@/allocation/types';

export type ScenarioId = 'grants' | 'team-time' | 'risk-reduction';
export type ResourceKind = 'currency' | 'hours';

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

export interface ScenarioTemplate {
  id: ScenarioId;
  path: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  budget: number;
  budgetLabel: string;
  resourceKind: ResourceKind;
  optionNoun: string;
  optionNounPlural: string;
  assumptionsTitle: string;
  assumptionsDescription: string;
  startingUtilityLabel: string;
  startingUtilityHelp: string;
  diminishingReturnsHelp: string;
  chartTitle: string;
  chartDescription: string;
  resultEyebrow: string;
  resultTitle: string;
  cutoffLabel: string;
  tutorialTitle: string;
  tutorialIntro: string;
  tutorialOpportunity: string;
  tutorialChart: string;
  disclaimer: string;
  evaluators: EvaluatorViewModel[];
  organizations: OrganizationScenario[];
}

const EVALUATOR_COLORS = [
  { color: '#6941c6', tint: '#f1ecff' },
  { color: '#b54708', tint: '#fff3e8' },
] as const;
const OPTION_COLORS = [
  { color: '#2756d8', tint: '#edf2ff' },
  { color: '#e15b38', tint: '#fff0eb' },
  { color: '#128278', tint: '#e8f7f4' },
] as const;

export const SCENARIOS: Record<ScenarioId, ScenarioTemplate> = {
  grants: {
    id: 'grants',
    path: '/grants',
    navLabel: 'Grant funding',
    eyebrow: 'Funding portfolio',
    title: 'Allocate for the greatest combined value.',
    description:
      'Combine two evaluators’ judgments, adjust the funding assumptions, and see how a $1 million portfolio follows the strongest remaining marginal impact.',
    budget: 1_000_000,
    budgetLabel: 'Funding budget',
    resourceKind: 'currency',
    optionNoun: 'organization',
    optionNounPlural: 'organizations',
    assumptionsTitle: 'Organization assumptions',
    assumptionsDescription:
      'Compare evaluator scores, then shape how each funding opportunity behaves.',
    startingUtilityLabel: 'Starting marginal utility',
    startingUtilityHelp:
      'Base value of the first extra funding, before evaluator scores.',
    diminishingReturnsHelp:
      'Higher means the value of later dollars fades sooner.',
    chartTitle: 'Value produced as funding grows',
    chartDescription:
      'Dots mark the recommended allocation. Flatter curves signal stronger diminishing returns.',
    resultEyebrow: 'Recommended portfolio',
    resultTitle: 'Optimal allocation',
    cutoffLabel: 'Portfolio cutoff',
    tutorialTitle: 'Follow the next best dollar.',
    tutorialIntro:
      'The model keeps assigning money wherever the next dollar creates the most weighted value.',
    tutorialOpportunity:
      'Starting utility values the first extra funding; diminishing returns controls how quickly later dollars lose value.',
    tutorialChart:
      'The chart shows cumulative value. Each dot marks the recommended funding level; the explanation names the assumption driving the change.',
    disclaimer:
      'Illustrative organizations and utility values only. This explorer demonstrates a decision model; it does not recommend real-world grants.',
    evaluators: [
      {
        id: 'alice',
        name: 'Alice',
        influence: 0.5,
        ...EVALUATOR_COLORS[0],
        organizationScores: { harbor: 1.5, brightpath: 0.8, commonfield: 0.5 },
      },
      {
        id: 'bob',
        name: 'Bob',
        influence: 0.5,
        ...EVALUATOR_COLORS[1],
        organizationScores: { harbor: 0.9, brightpath: 1.2, commonfield: 1.1 },
      },
    ],
    organizations: [
      {
        id: 'harbor',
        name: 'Harbor Health',
        shortName: 'A',
        initialMarginalUtility: 90,
        diminishingReturns: 1.4,
        ...OPTION_COLORS[0],
      },
      {
        id: 'brightpath',
        name: 'BrightPath Learning',
        shortName: 'B',
        initialMarginalUtility: 110,
        diminishingReturns: 2.5,
        ...OPTION_COLORS[1],
      },
      {
        id: 'commonfield',
        name: 'Common Field',
        shortName: 'C',
        initialMarginalUtility: 80,
        diminishingReturns: 0.8,
        ...OPTION_COLORS[2],
      },
    ],
  },
  'team-time': {
    id: 'team-time',
    path: '/team-time',
    navLabel: 'Team time',
    eyebrow: 'Weekly capacity',
    title: 'Put the team’s next hour where it matters most.',
    description:
      'Balance product and engineering priorities, then allocate 40 team-hours across three initiatives as the value of additional time changes.',
    budget: 40,
    budgetLabel: 'Team capacity',
    resourceKind: 'hours',
    optionNoun: 'initiative',
    optionNounPlural: 'initiatives',
    assumptionsTitle: 'Initiative assumptions',
    assumptionsDescription:
      'Compare stakeholder scores, then describe the value and saturation of each initiative.',
    startingUtilityLabel: 'Starting value per hour',
    startingUtilityHelp:
      'Value of the first team-hour, before stakeholder scores are applied.',
    diminishingReturnsHelp:
      'Higher means additional hours become less useful sooner.',
    chartTitle: 'Value produced as team time grows',
    chartDescription:
      'Dots mark the recommended hours. Flatter curves show initiatives that saturate sooner.',
    resultEyebrow: 'Recommended work plan',
    resultTitle: 'Optimal time allocation',
    cutoffLabel: 'Work-plan cutoff',
    tutorialTitle: 'Follow the next best hour.',
    tutorialIntro:
      'The model keeps assigning time wherever the next hour creates the most weighted value.',
    tutorialOpportunity:
      'Starting value estimates the first useful hour; diminishing returns controls how quickly an initiative saturates.',
    tutorialChart:
      'The chart shows cumulative value. Each dot marks the recommended hours; the explanation names the assumption driving the change.',
    disclaimer:
      'Illustrative initiatives and values only. Use the result to expose tradeoffs, not as a substitute for delivery judgment.',
    evaluators: [
      {
        id: 'product',
        name: 'Product Lead',
        influence: 0.5,
        ...EVALUATOR_COLORS[0],
        organizationScores: { reliability: 0.9, onboarding: 1.4, sharing: 1.2 },
      },
      {
        id: 'engineering',
        name: 'Engineering Lead',
        influence: 0.5,
        ...EVALUATOR_COLORS[1],
        organizationScores: { reliability: 1.6, onboarding: 0.8, sharing: 1.0 },
      },
    ],
    organizations: [
      {
        id: 'reliability',
        name: 'Improve platform reliability',
        shortName: 'A',
        initialMarginalUtility: 105,
        diminishingReturns: 1.2,
        ...OPTION_COLORS[0],
      },
      {
        id: 'onboarding',
        name: 'Redesign evaluator onboarding',
        shortName: 'B',
        initialMarginalUtility: 95,
        diminishingReturns: 2,
        ...OPTION_COLORS[1],
      },
      {
        id: 'sharing',
        name: 'Build scenario sharing',
        shortName: 'C',
        initialMarginalUtility: 90,
        diminishingReturns: 1.5,
        ...OPTION_COLORS[2],
      },
    ],
  },
  'risk-reduction': {
    id: 'risk-reduction',
    path: '/risk-reduction',
    navLabel: 'Risk reduction',
    eyebrow: 'Mitigation portfolio',
    title: 'Invest where the next dollar reduces the most risk.',
    description:
      'Combine security and operations priorities, then allocate a $500,000 mitigation budget across interventions with different returns.',
    budget: 500_000,
    budgetLabel: 'Mitigation budget',
    resourceKind: 'currency',
    optionNoun: 'intervention',
    optionNounPlural: 'interventions',
    assumptionsTitle: 'Risk intervention assumptions',
    assumptionsDescription:
      'Compare expert scores, then describe the initial risk reduction and saturation of each intervention.',
    startingUtilityLabel: 'Initial risk reduction',
    startingUtilityHelp:
      'Expected value of the first extra investment, before expert scores.',
    diminishingReturnsHelp:
      'Higher means later mitigation spending becomes less effective sooner.',
    chartTitle: 'Risk reduction as investment grows',
    chartDescription:
      'Dots mark the recommended investment. Flatter curves show interventions that saturate sooner.',
    resultEyebrow: 'Recommended mitigation portfolio',
    resultTitle: 'Optimal risk allocation',
    cutoffLabel: 'Mitigation cutoff',
    tutorialTitle: 'Follow the next best mitigation dollar.',
    tutorialIntro:
      'The model keeps assigning money wherever the next dollar creates the most weighted risk reduction.',
    tutorialOpportunity:
      'Initial risk reduction values the first investment; diminishing returns controls how quickly an intervention saturates.',
    tutorialChart:
      'The chart shows cumulative risk reduction. Each dot marks the recommended investment; the explanation names the assumption driving the change.',
    disclaimer:
      'Illustrative interventions and values only. This model supports risk conversations; it does not replace a formal risk assessment.',
    evaluators: [
      {
        id: 'security',
        name: 'Security Lead',
        influence: 0.5,
        ...EVALUATOR_COLORS[0],
        organizationScores: { access: 1.6, response: 1.4, resilience: 0.9 },
      },
      {
        id: 'operations',
        name: 'Operations Lead',
        influence: 0.5,
        ...EVALUATOR_COLORS[1],
        organizationScores: { access: 1, response: 1.2, resilience: 1.5 },
      },
    ],
    organizations: [
      {
        id: 'access',
        name: 'Account and access security',
        shortName: 'A',
        initialMarginalUtility: 105,
        diminishingReturns: 2,
        ...OPTION_COLORS[0],
      },
      {
        id: 'response',
        name: 'Incident response readiness',
        shortName: 'B',
        initialMarginalUtility: 100,
        diminishingReturns: 1.4,
        ...OPTION_COLORS[1],
      },
      {
        id: 'resilience',
        name: 'Vendor and infrastructure resilience',
        shortName: 'C',
        initialMarginalUtility: 85,
        diminishingReturns: 0.9,
        ...OPTION_COLORS[2],
      },
    ],
  },
};

export const SCENARIO_ORDER: ScenarioId[] = [
  'grants',
  'team-time',
  'risk-reduction',
];

export function scenarioFromPath(pathname: string): ScenarioId {
  if (pathname.startsWith('/team-time')) return 'team-time';
  if (pathname.startsWith('/risk-reduction')) return 'risk-reduction';
  return 'grants';
}

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

export function baselineOrganizations(
  template: ScenarioTemplate,
): OrganizationViewModel[] {
  return resolveOrganizations(template.organizations, template.evaluators);
}

export function freshEvaluatorDefaults(
  template: ScenarioTemplate,
): EvaluatorViewModel[] {
  return template.evaluators.map((evaluator) => ({
    ...evaluator,
    organizationScores: { ...evaluator.organizationScores },
  }));
}

export function freshOrganizationDefaults(
  template: ScenarioTemplate,
): OrganizationScenario[] {
  return template.organizations.map((organization) => ({ ...organization }));
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 0,
});
const hours = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export function formatResource(
  template: ScenarioTemplate,
  value: number,
): string {
  return template.resourceKind === 'currency'
    ? currency.format(value)
    : `${hours.format(value)} hours`;
}

export function formatCompactResource(
  template: ScenarioTemplate,
  value: number,
): string {
  return template.resourceKind === 'currency'
    ? compactCurrency.format(value)
    : `${hours.format(value)}h`;
}
