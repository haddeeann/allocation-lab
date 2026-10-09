'use client';

import { useMemo, useState } from 'react';
import { BookOpenCheck, RotateCcw, Sigma, Sparkles } from 'lucide-react';

import { optimizeAllocation } from '@/allocation/optimize';
import { AllocationResults } from '@/components/explorer/allocation-results';
import { EvaluatorMix } from '@/components/explorer/evaluator-mix';
import { ExplanationPanel } from '@/components/explorer/explanation-panel';
import { OrganizationEditor } from '@/components/explorer/organization-editor';
import {
  baselineOrganizations,
  formatResource,
  freshEvaluatorDefaults,
  freshOrganizationDefaults,
  resolveOrganizations,
  SCENARIOS,
  SCENARIO_ORDER,
  type ScenarioId,
} from '@/components/explorer/scenario';
import { UtilityChart } from '@/components/explorer/utility-chart';
import { TutorialPanel } from '@/components/explorer/tutorial-panel';
import { Button } from '@/components/ui/button';

type EditableField = 'initialMarginalUtility' | 'diminishingReturns';

interface MiniSProcessExplorerProps {
  scenarioId?: ScenarioId;
  onScenarioChange?: (scenarioId: ScenarioId) => void;
}

export function MiniSProcessExplorer({
  scenarioId = 'grants',
  onScenarioChange,
}: MiniSProcessExplorerProps) {
  const template = SCENARIOS[scenarioId];
  const baselineOrganizationsForScenario = useMemo(
    () => baselineOrganizations(template),
    [template],
  );
  const baselineResult = useMemo(
    () =>
      optimizeAllocation(
        baselineOrganizationsForScenario,
        template.budget,
        template.budget,
      ),
    [baselineOrganizationsForScenario, template],
  );
  const [organizationScenarios, setOrganizationScenarios] = useState(() =>
    freshOrganizationDefaults(template),
  );
  const [evaluators, setEvaluators] = useState(() =>
    freshEvaluatorDefaults(template),
  );
  const [showTutorial, setShowTutorial] = useState(false);
  const organizations = useMemo(
    () => resolveOrganizations(organizationScenarios, evaluators),
    [organizationScenarios, evaluators],
  );
  const result = useMemo(
    () => optimizeAllocation(organizations, template.budget, template.budget),
    [organizations, template],
  );

  function updateOrganization(id: string, field: EditableField, value: number) {
    setOrganizationScenarios((current) =>
      current.map((organization) =>
        organization.id === id
          ? { ...organization, [field]: value }
          : organization,
      ),
    );
  }

  function updateEvaluatorScore(
    evaluatorId: string,
    organizationId: string,
    value: number,
  ) {
    setEvaluators((current) =>
      current.map((evaluator) =>
        evaluator.id === evaluatorId
          ? {
              ...evaluator,
              organizationScores: {
                ...evaluator.organizationScores,
                [organizationId]: value,
              },
            }
          : evaluator,
      ),
    );
  }

  function updateFirstEvaluatorInfluence(percentage: number) {
    const firstEvaluatorId = template.evaluators[0].id;
    setEvaluators((current) =>
      current.map((evaluator) => ({
        ...evaluator,
        influence:
          evaluator.id === firstEvaluatorId
            ? percentage / 100
            : 1 - percentage / 100,
      })),
    );
  }

  function resetOrganizations() {
    setOrganizationScenarios(freshOrganizationDefaults(template));
    setEvaluators(freshEvaluatorDefaults(template));
  }

  function runTutorialExample() {
    setOrganizationScenarios(freshOrganizationDefaults(template));
    setEvaluators(
      freshEvaluatorDefaults(template).map((evaluator, index) => ({
        ...evaluator,
        influence: index === 1 ? 0.8 : 0.2,
      })),
    );
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1480px]">
        <nav
          aria-label="Decision scenarios"
          className="mb-5 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-900/10 bg-white/75 p-1 shadow-sm shadow-slate-900/[0.04]"
        >
          {SCENARIO_ORDER.map((id) => {
            const scenario = SCENARIOS[id];
            const active = id === scenarioId;
            return (
              <a
                key={id}
                href={scenario.path}
                aria-current={active ? 'page' : undefined}
                onClick={
                  onScenarioChange
                    ? (event) => {
                        event.preventDefault();
                        onScenarioChange(id);
                      }
                    : undefined
                }
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {scenario.navLabel}
              </a>
            );
          })}
        </nav>
        <header className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-900/10 pb-6 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Allocation Lab · {template.eyebrow}
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[42px] sm:leading-[1.05]">
              {template.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              {template.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl border border-slate-900/10 bg-white/70 px-4 py-2.5 shadow-sm shadow-slate-900/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {template.budgetLabel}
              </p>
              <p className="mt-0.5 font-mono text-lg font-semibold tracking-tight text-slate-950">
                {formatResource(template, template.budget)}
              </p>
            </div>
            <Button
              variant="outline"
              aria-expanded={showTutorial}
              aria-controls="tutorial-guide"
              onClick={() => setShowTutorial((current) => !current)}
              className="h-11 rounded-xl bg-white/70 px-3"
            >
              <BookOpenCheck aria-hidden="true" data-icon="inline-start" />
              {showTutorial ? 'Hide guide' : 'How to use'}
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Reset all assumptions"
              title="Reset all assumptions"
              onClick={resetOrganizations}
              className="size-11 rounded-xl bg-white/70"
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
        </header>

        {showTutorial ? (
          <TutorialPanel
            onRunExample={runTutorialExample}
            onReset={resetOrganizations}
            template={template}
            exampleEvaluatorName={template.evaluators[1].name}
            exampleOptionName={
              template.organizations.reduce((best, option) =>
                template.evaluators[1].organizationScores[option.id] >
                template.evaluators[1].organizationScores[best.id]
                  ? option
                  : best,
              ).name
            }
          />
        ) : null}

        <EvaluatorMix
          evaluators={evaluators}
          optionNounPlural={template.optionNounPlural}
          onFirstEvaluatorShareChange={updateFirstEvaluatorInfluence}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(370px,0.8fr)]">
          <section aria-labelledby="assumptions-title">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2
                  id="assumptions-title"
                  className="text-sm font-semibold text-slate-950"
                >
                  {template.assumptionsTitle}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {template.assumptionsDescription}
                </p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 sm:flex">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live calculation
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {organizations.map((organization) => (
                <OrganizationEditor
                  key={organization.id}
                  organization={organization}
                  evaluators={evaluators}
                  template={template}
                  onChange={(field, value) =>
                    updateOrganization(organization.id, field, value)
                  }
                  onEvaluatorScoreChange={(evaluatorId, value) =>
                    updateEvaluatorScore(evaluatorId, organization.id, value)
                  }
                />
              ))}
            </div>
          </section>

          <AllocationResults
            result={result}
            baseline={baselineResult}
            organizations={organizations}
            template={template}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(370px,0.8fr)]">
          <UtilityChart
            organizations={organizations}
            result={result}
            template={template}
          />
          <ExplanationPanel
            result={result}
            baseline={baselineResult}
            organizations={organizations}
            evaluators={evaluators}
            baselineOrganizations={baselineOrganizationsForScenario}
            baselineEvaluators={template.evaluators}
            template={template}
          />
        </div>

        <section className="mt-6 grid gap-4 border-t border-slate-900/10 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Sigma aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                How the model works
              </h2>
              <p className="mt-1 max-w-4xl text-xs leading-5 text-slate-500">
                The model first combines evaluator scores using their influence
                shares. Each resulting score scales a logarithmic utility curve,
                and the optimizer equalizes marginal utility across every
                selected {template.optionNoun}.
              </p>
            </div>
          </div>
          <div className="grid gap-1.5">
            <code className="rounded-lg border border-slate-900/10 bg-white/70 px-3 py-2 font-mono text-[11px] text-slate-600">
              w̄ᵢ = Σ influenceₑ · scoreₑᵢ
            </code>
            <code className="rounded-lg border border-slate-900/10 bg-white/70 px-3 py-2 font-mono text-[11px] text-slate-600">
              Uᵢ(x) = w̄ᵢ · mᵢ · log(1 + dᵢ · x / total resource) / dᵢ
            </code>
          </div>
        </section>

        <footer className="pb-4 text-[11px] leading-5 text-slate-500">
          {template.disclaimer}
        </footer>
      </div>
    </main>
  );
}
