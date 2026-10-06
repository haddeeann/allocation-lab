export interface OrganizationInput {
  id: string;
  name: string;
  weight: number;
  initialMarginalUtility: number;
  diminishingReturns: number;
}

export interface OrganizationCurveInput {
  id: string;
  name: string;
  initialMarginalUtility: number;
  diminishingReturns: number;
}

export interface EvaluatorInput {
  id: string;
  name: string;
  influence: number;
  organizationScores: Record<string, number>;
}

export interface OrganizationAllocation {
  organizationId: string;
  dollars: number;
  share: number;
  utility: number;
  marginalUtility: number;
}

export interface AllocationResult {
  budget: number;
  totalUtility: number;
  shadowPrice: number;
  allocations: OrganizationAllocation[];
}
