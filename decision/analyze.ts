import type { DecisionAnalysis, DecisionModel, OptionAnalysis } from './types';

const EPSILON = 1e-9;

function assertScale(value: number, label: string) {
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    throw new Error(`${label} must be between 1 and 5.`);
  }
}

function leadersBy(
  analyses: OptionAnalysis[],
  score: (analysis: OptionAnalysis) => number,
) {
  const best = Math.max(...analyses.map(score));
  return analyses
    .filter((analysis) => Math.abs(score(analysis) - best) < EPSILON)
    .map((analysis) => analysis.optionId);
}

export function analyzeDecision(model: DecisionModel): DecisionAnalysis {
  if (model.options.length < 2) {
    throw new Error('A decision needs at least two options.');
  }
  if (model.criteria.length === 0 || model.scenarios.length === 0) {
    throw new Error('A decision needs criteria and scenarios.');
  }

  const totalWeight = model.criteria.reduce((sum, criterion) => {
    if (!Number.isFinite(criterion.weight) || criterion.weight < 0) {
      throw new Error('Criterion weights must be non-negative.');
    }
    return sum + criterion.weight;
  }, 0);
  if (totalWeight <= 0) {
    throw new Error('At least one criterion must have positive weight.');
  }

  const bestByScenario = Object.fromEntries(
    model.scenarios.map((scenario) => {
      const scores = model.options.map((option) => {
        const value = option.scenarioScores[scenario.id];
        assertScale(value, `${option.name} scenario score`);
        return value;
      });
      return [scenario.id, Math.max(...scores)];
    }),
  );

  const options = model.options.map<OptionAnalysis>((option) => {
    const weightedTotal = model.criteria.reduce((sum, criterion) => {
      const score = option.criterionScores[criterion.id];
      assertScale(score, `${option.name} criterion score`);
      return sum + criterion.weight * score;
    }, 0);
    const preferenceFit = weightedTotal / totalWeight;

    assertScale(option.evidence, `${option.name} evidence`);
    assertScale(option.reversibility, `${option.name} reversibility`);
    assertScale(option.learningValue, `${option.name} learning value`);
    assertScale(option.experimentCost, `${option.name} experiment cost`);

    const scenarioScores = model.scenarios.map(
      (scenario) => option.scenarioScores[scenario.id],
    );
    const maximumRegret = Math.max(
      ...model.scenarios.map(
        (scenario) =>
          bestByScenario[scenario.id] - option.scenarioScores[scenario.id],
      ),
    );

    return {
      optionId: option.id,
      preferenceFit,
      evidenceAdjustedFit: preferenceFit * (0.5 + option.evidence / 10),
      worstCase: Math.min(...scenarioScores),
      maximumRegret,
      optionPreservation: (option.reversibility + option.learningValue) / 2,
      experimentPriority:
        (option.learningValue * (6 - option.evidence)) / option.experimentCost,
    };
  });

  const leaders = {
    preference: leadersBy(options, (option) => option.evidenceAdjustedFit),
    robustness: leadersBy(
      options,
      (option) => option.worstCase * 10 - option.maximumRegret,
    ),
    preservation: leadersBy(options, (option) => option.optionPreservation),
    learning: leadersBy(options, (option) => option.experimentPriority),
  };
  const leaderSignatures = new Set(
    Object.values(leaders).map((optionIds) => [...optionIds].sort().join('|')),
  );

  return {
    options,
    leaders,
    hasDisagreement: leaderSignatures.size > 1,
  };
}
