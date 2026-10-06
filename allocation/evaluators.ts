import type {
  EvaluatorInput,
  OrganizationCurveInput,
  OrganizationInput,
} from './types';

export function combineEvaluatorPreferences(
  organizations: OrganizationCurveInput[],
  evaluators: EvaluatorInput[],
): OrganizationInput[] {
  if (evaluators.length === 0) {
    throw new RangeError('At least one evaluator is required.');
  }

  const totalInfluence = evaluators.reduce((total, evaluator) => {
    if (!Number.isFinite(evaluator.influence) || evaluator.influence < 0) {
      throw new RangeError(`Influence for ${evaluator.name} must be non-negative.`);
    }
    return total + evaluator.influence;
  }, 0);

  if (totalInfluence <= 0) {
    throw new RangeError('At least one evaluator must have positive influence.');
  }

  return organizations.map((organization) => {
    const weightedScore = evaluators.reduce((total, evaluator) => {
      const score = evaluator.organizationScores[organization.id];

      if (!Number.isFinite(score) || score < 0) {
        throw new RangeError(
          `${evaluator.name} must have a non-negative score for ${organization.name}.`,
        );
      }

      return total + evaluator.influence * score;
    }, 0);

    return {
      ...organization,
      weight: weightedScore / totalInfluence,
    };
  });
}
