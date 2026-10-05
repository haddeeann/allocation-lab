'use client';

import { useMemo, useState } from 'react';
import { RotateCcw, Sigma, Sparkles } from 'lucide-react';

import { optimizeAllocation } from '@/allocation/optimize';
import { AllocationResults } from '@/components/explorer/allocation-results';
import { ExplanationPanel } from '@/components/explorer/explanation-panel';
import { OrganizationEditor } from '@/components/explorer/organization-editor';
import {
  BUDGET,
  currency,
  DEFAULT_ORGANIZATIONS,
  type OrganizationViewModel,
} from '@/components/explorer/scenario';
import { UtilityChart } from '@/components/explorer/utility-chart';
import { Button } from '@/components/ui/button';

const BASELINE_RESULT = optimizeAllocation(DEFAULT_ORGANIZATIONS, BUDGET);

type EditableField =
  | 'weight'
  | 'initialMarginalUtility'
  | 'diminishingReturns';

function freshDefaults(): OrganizationViewModel[] {
  return DEFAULT_ORGANIZATIONS.map((organization) => ({ ...organization }));
}

export function MiniSProcessExplorer() {
  const [organizations, setOrganizations] = useState(freshDefaults);
  const result = useMemo(
    () => optimizeAllocation(organizations, BUDGET),
    [organizations],
  );

  function updateOrganization(id: string, field: EditableField, value: number) {
    setOrganizations((current) =>
      current.map((organization) =>
        organization.id === id ? { ...organization, [field]: value } : organization,
      ),
    );
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-900/10 pb-6 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Allocation Lab · decision model
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[42px] sm:leading-[1.05]">
              Allocate for the greatest combined value.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              Adjust the evaluator’s assumptions. The model continuously redistributes a
              $1 million budget toward the strongest remaining marginal impact.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl border border-slate-900/10 bg-white/70 px-4 py-2.5 shadow-sm shadow-slate-900/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Funding budget
              </p>
              <p className="mt-0.5 font-mono text-lg font-semibold tracking-tight text-slate-950">
                {currency.format(BUDGET)}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Reset all assumptions"
              title="Reset all assumptions"
              onClick={() => setOrganizations(freshDefaults())}
              className="size-11 rounded-xl bg-white/70"
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(370px,0.8fr)]">
          <section aria-labelledby="assumptions-title">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 id="assumptions-title" className="text-sm font-semibold text-slate-950">
                  Evaluator assumptions
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Change a setting to reshape an organization’s weighted utility curve.
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
                  onChange={(field, value) =>
                    updateOrganization(organization.id, field, value)
                  }
                />
              ))}
            </div>
          </section>

          <AllocationResults
            result={result}
            baseline={BASELINE_RESULT}
            organizations={organizations}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(370px,0.8fr)]">
          <UtilityChart organizations={organizations} result={result} />
          <ExplanationPanel
            result={result}
            baseline={BASELINE_RESULT}
            organizations={organizations}
          />
        </div>

        <section className="mt-6 grid gap-4 border-t border-slate-900/10 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Sigma aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">How the model works</h2>
              <p className="mt-1 max-w-4xl text-xs leading-5 text-slate-500">
                Each organization uses a weighted logarithmic utility curve. The optimizer
                chooses non-negative allocations that sum to the budget and equalizes
                marginal utility across every funded organization.
              </p>
            </div>
          </div>
          <code className="rounded-lg border border-slate-900/10 bg-white/70 px-3 py-2 font-mono text-[11px] text-slate-600">
            U(x) = w · m · log(1 + d · x / $1m) / d
          </code>
        </section>

        <footer className="pb-4 text-[11px] leading-5 text-slate-500">
          Illustrative organizations and utility values only. This explorer demonstrates a
          decision model; it does not recommend real-world grants.
        </footer>
      </div>
    </main>
  );
}
