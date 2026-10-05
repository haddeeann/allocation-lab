import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import type { AllocationResult } from '@/allocation/types';

import { currency, type OrganizationViewModel } from './scenario';

interface AllocationResultsProps {
  result: AllocationResult;
  baseline: AllocationResult;
  organizations: OrganizationViewModel[];
}

export function AllocationResults({
  result,
  baseline,
  organizations,
}: AllocationResultsProps) {
  return (
    <section
      aria-labelledby="allocation-title"
      className="rounded-2xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10 sm:p-6"
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
            Recommended portfolio
          </p>
          <h2 id="allocation-title" className="mt-1 text-xl font-semibold tracking-tight">
            Optimal allocation
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
            Combined utility
          </p>
          <p className="font-mono text-lg font-semibold">
            {result.totalUtility.toFixed(1)}
          </p>
        </div>
      </div>

      <div
        className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/10"
        aria-label="Recommended allocation by percentage"
      >
        {result.allocations.map((allocation, index) => (
          <span
            key={allocation.organizationId}
            title={`${organizations[index].name}: ${(allocation.share * 100).toFixed(1)}%`}
            className="transition-[width] duration-300 ease-out"
            style={{
              width: `${allocation.share * 100}%`,
              backgroundColor: organizations[index].color,
            }}
          />
        ))}
      </div>

      <div className="mt-5 divide-y divide-white/10">
        {result.allocations.map((allocation, index) => {
          const organization = organizations[index];
          const delta = allocation.dollars - baseline.allocations[index].dollars;
          const unchanged = Math.abs(delta) < 1;
          const DeltaIcon = unchanged ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={allocation.organizationId}
              className="grid grid-cols-[1fr_auto] items-center gap-5 py-4 first:pt-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: organization.color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {organization.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Utility {allocation.utility.toFixed(1)} · final margin{' '}
                    {allocation.marginalUtility.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  data-testid={`allocation-${organization.id}`}
                  data-dollars={allocation.dollars}
                  className="font-mono text-base font-semibold tracking-tight"
                >
                  {currency.format(allocation.dollars)}
                </p>
                <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-slate-400">
                  <span>{(allocation.share * 100).toFixed(1)}%</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      unchanged
                        ? 'text-slate-500'
                        : delta > 0
                          ? 'text-emerald-300'
                          : 'text-amber-300'
                    }
                  >
                    <DeltaIcon aria-hidden="true" className="mr-0.5 inline size-3" />
                    {unchanged ? 'baseline' : currency.format(Math.abs(delta))}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
            Portfolio cutoff
          </p>
          <p className="mt-1 font-mono font-semibold text-slate-200">
            {result.shadowPrice.toFixed(1)} utility
          </p>
        </div>
        <div className="border-l border-white/10 pl-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
            Budget used
          </p>
          <p className="mt-1 font-mono font-semibold text-slate-200">100.0%</p>
        </div>
      </div>
    </section>
  );
}
