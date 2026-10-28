export interface DecisionCriterion {
  id: string;
  name: string;
  weight: number;
}

export interface DecisionScenario {
  id: string;
  name: string;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  criterionScores: Record<string, number>;
  scenarioScores: Record<string, number>;
  evidence: number;
  reversibility: number;
  learningValue: number;
  experimentCost: number;
}

export interface DecisionModel {
  question: string;
  horizon: string;
  criteria: DecisionCriterion[];
  scenarios: DecisionScenario[];
  options: DecisionOption[];
}

export interface OptionAnalysis {
  optionId: string;
  preferenceFit: number;
  evidenceAdjustedFit: number;
  worstCase: number;
  maximumRegret: number;
  optionPreservation: number;
  experimentPriority: number;
}

export interface DecisionAnalysis {
  options: OptionAnalysis[];
  leaders: {
    preference: string[];
    robustness: string[];
    preservation: string[];
    learning: string[];
  };
  hasDisagreement: boolean;
}
