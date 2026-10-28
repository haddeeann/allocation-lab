import { describe, expect, it } from 'vitest';

import { analyzeDecision } from './analyze';
import type { DecisionModel } from './types';

const model: DecisionModel = {
  question: 'How should we add this capability?',
  horizon: 'The next six months',
  criteria: [
    { id: 'speed', name: 'Speed', weight: 4 },
    { id: 'control', name: 'Control', weight: 2 },
  ],
  scenarios: [
    { id: 'low', name: 'Low use' },
    { id: 'high', name: 'High use' },
  ],
  options: [
    {
      id: 'buy',
      name: 'Buy',
      description: '',
      criterionScores: { speed: 5, control: 2 },
      scenarioScores: { low: 5, high: 2 },
      evidence: 5,
      reversibility: 4,
      learningValue: 2,
      experimentCost: 2,
    },
    {
      id: 'build',
      name: 'Build',
      description: '',
      criterionScores: { speed: 1, control: 5 },
      scenarioScores: { low: 1, high: 5 },
      evidence: 2,
      reversibility: 2,
      learningValue: 5,
      experimentCost: 4,
    },
  ],
};

describe('analyzeDecision', () => {
  it('keeps the lenses separate when they favor different options', () => {
    const result = analyzeDecision(model);

    expect(result.leaders.preference).toEqual(['buy']);
    expect(result.leaders.learning).toEqual(['build']);
    expect(result.hasDisagreement).toBe(true);
  });

  it('calculates weighted fit and maximum regret deterministically', () => {
    const result = analyzeDecision(model);
    const buy = result.options.find((option) => option.optionId === 'buy');

    expect(buy?.preferenceFit).toBe(4);
    expect(buy?.maximumRegret).toBe(3);
    expect(analyzeDecision(model)).toEqual(result);
  });

  it('rejects invalid scales instead of silently normalizing them', () => {
    const invalid = structuredClone(model);
    invalid.options[0].evidence = 8;

    expect(() => analyzeDecision(invalid)).toThrow(/between 1 and 5/i);
  });

  it('treats identical ties across every lens as agreement', () => {
    const tied = structuredClone(model);
    tied.options[1] = {
      ...structuredClone(tied.options[0]),
      id: 'build',
      name: 'Build',
    };

    expect(analyzeDecision(tied).hasDisagreement).toBe(false);
  });
});
