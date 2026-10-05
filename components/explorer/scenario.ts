import type { OrganizationInput } from '@/allocation/types';

export const BUDGET = 1_000_000;

export type OrganizationViewModel = OrganizationInput & {
  shortName: string;
  color: string;
  tint: string;
};

export const DEFAULT_ORGANIZATIONS: OrganizationViewModel[] = [
  {
    id: 'harbor',
    name: 'Harbor Health',
    shortName: 'A',
    weight: 1.2,
    initialMarginalUtility: 90,
    diminishingReturns: 1.4,
    color: '#2756d8',
    tint: '#edf2ff',
  },
  {
    id: 'brightpath',
    name: 'BrightPath Learning',
    shortName: 'B',
    weight: 1,
    initialMarginalUtility: 110,
    diminishingReturns: 2.5,
    color: '#e15b38',
    tint: '#fff0eb',
  },
  {
    id: 'commonfield',
    name: 'Common Field',
    shortName: 'C',
    weight: 0.8,
    initialMarginalUtility: 80,
    diminishingReturns: 0.8,
    color: '#128278',
    tint: '#e8f7f4',
  },
];

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
