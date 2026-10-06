import { Equal, Lightbulb, MoveRight } from 'lucide-react';

import type { AllocationResult } from '@/allocation/types';

import {
  currency,
  DEFAULT_EVALUATORS,
  DEFAULT_ORGANIZATIONS,
  type EvaluatorViewModel,
  type OrganizationViewModel,
} from './scenario';

interface ExplanationPanelProps {
  result: AllocationResult;
  baseline: AllocationResult;
  organizations: OrganizationViewModel[];
  evaluators: EvaluatorViewModel[];
}

function describeParameterChanges(
  organization: OrganizationViewModel,
  baseline: OrganizationViewModel,
): string[] {
  const changes: string[] = [];

  if (organization.weight !== baseline.weight) {
    changes.push(
      `a ${organization.weight > baseline.weight ? 'higher' : 'lower'} combined evaluator score that ${
        organization.weight > baseline.weight ? 'lifts' : 'lowers'
      } its whole curve`,
    );
  }
  if (organization.initialMarginalUtility !== baseline.initialMarginalUtility) {
    changes.push(
      `${organization.initialMarginalUtility > baseline.initialMarginalUtility ? 'a stronger' : 'a weaker'} starting case`,
    );
  }
  if (organization.diminishingReturns !== baseline.diminishingReturns) {
    changes.push(
      `${organization.diminishingReturns > baseline.diminishingReturns ? 'faster' : 'slower'} diminishing returns ${
        organization.diminishingReturns > baseline.diminishingReturns
          ? 'make later dollars less competitive'
          : 'help later dollars hold their value'
      }`,
    );
  }

  return changes;
}

export function ExplanationPanel({
  result,
  baseline,
  organizations,
  evaluators,
}: ExplanationPanelProps) {
  const changedOrganizations = organizations
    .map((organization, index) => {
      const parameterChanges = describeParameterChanges(
        organization,
        DEFAULT_ORGANIZATIONS[index],
      );
      return {
        organization,
        parameterChanges,
        allocationDelta:
          result.allocations[index].dollars - baseline.allocations[index].dollars,
      };
    })
    .filter(({ parameterChanges }) => parameterChanges.length > 0)
    .sort((a, b) => Math.abs(b.allocationDelta) - Math.abs(a.allocationDelta));

  const influenceShift = evaluators
    .map((evaluator, index) => ({
      evaluator,
      delta: evaluator.influence - DEFAULT_EVALUATORS[index].influence,
    }))
    .sort((a, b) => b.delta - a.delta)[0];
  const evaluatorSettingsChanged = evaluators.some((evaluator, index) => {
    const original = DEFAULT_EVALUATORS[index];
    return (
      evaluator.influence !== original.influence ||
      Object.keys(evaluator.organizationScores).some(
        (organizationId) =>
          evaluator.organizationScores[organizationId] !==
          original.organizationScores[organizationId],
      )
    );
  });
  const isBaseline = changedOrganizations.length === 0 && !evaluatorSettingsChanged;
  const strongestStart = organizations.reduce((strongest, organization) =>
    organization.weight * organization.initialMarginalUtility >
    strongest.weight * strongest.initialMarginalUtility
      ? organization
      : strongest,
  );
  const slowestDecay = organizations.reduce((slowest, organization) =>
    organization.diminishingReturns < slowest.diminishingReturns
      ? organization
      : slowest,
  );

  return (
    <aside className="rounded-2xl border border-slate-900/10 bg-[#fffdf8] p-5 shadow-sm shadow-slate-900/[0.03] sm:p-6">
      <div className="flex items-center gap-2 text-blue-700">
        <Lightbulb aria-hidden="true" className="size-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
          Why this changed
        </p>
      </div>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
        The recommendation follows the next best dollar.
      </h2>

      {isBaseline ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <strong className="font-semibold text-slate-900">{strongestStart.name}</strong>{' '}
          starts with the strongest weighted case, while{' '}
          <strong className="font-semibold text-slate-900">{slowestDecay.name}</strong>{' '}
          retains value longest. The allocation balances that head start against how quickly
          each curve flattens.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {influenceShift.delta > 0 ? (
            <p className="rounded-xl border border-blue-900/10 bg-blue-50/70 p-3.5 text-xs leading-5 text-slate-600">
              <strong className="font-semibold text-slate-900">
                {influenceShift.evaluator.name} now has{' '}
                {(influenceShift.evaluator.influence * 100).toFixed(0)}% influence.
              </strong>{' '}
              Their organization scores now contribute more to each combined score.
            </p>
          ) : null}
          {changedOrganizations.slice(0, 2).map(
            ({ organization, parameterChanges, allocationDelta }) => (
              <div
                key={organization.id}
                className="rounded-xl border border-slate-900/8 bg-white p-3.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-950">
                    {organization.name}
                  </p>
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: organization.color }}
                  >
                    {allocationDelta >= 0 ? '+' : '−'}
                    {currency.format(Math.abs(allocationDelta))}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  You set {parameterChanges.join(' and ')}. Together, those assumptions make
                  this organization’s next dollars{' '}
                  {allocationDelta >= 0 ? 'more' : 'less'} competitive than at baseline.
                </p>
              </div>
            ),
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-xs text-slate-300">
        <Equal aria-hidden="true" className="size-4 shrink-0 text-blue-300" />
        <span>
          Funded organizations converge on a marginal value of{' '}
          <strong className="font-mono text-white">{result.shadowPrice.toFixed(1)}</strong>
        </span>
        <MoveRight aria-hidden="true" className="ml-auto hidden size-4 shrink-0 sm:block" />
      </div>
    </aside>
  );
}
