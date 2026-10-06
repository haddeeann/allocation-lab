'use client';

import { Scale, UsersRound } from 'lucide-react';
import { type CSSProperties } from 'react';

import { Slider } from '@/components/ui/slider';

import type { EvaluatorViewModel } from './scenario';

interface EvaluatorMixProps {
  evaluators: EvaluatorViewModel[];
  onAliceShareChange: (percentage: number) => void;
}

export function EvaluatorMix({
  evaluators,
  onAliceShareChange,
}: EvaluatorMixProps) {
  const [alice, bob] = evaluators;
  const totalInfluence = alice.influence + bob.influence;
  const alicePercentage = Math.round((alice.influence / totalInfluence) * 100);
  const bobPercentage = 100 - alicePercentage;

  return (
    <section
      aria-labelledby="evaluator-mix-title"
      className="mb-6 grid gap-5 rounded-2xl border border-slate-900/10 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.04] sm:p-5 xl:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.8fr)] xl:items-center"
    >
      <div>
        <div className="flex items-center gap-2 text-blue-700">
          <UsersRound aria-hidden="true" className="size-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
            Collective viewpoint
          </p>
        </div>
        <h2
          id="evaluator-mix-title"
          className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950"
        >
          Whose judgment counts?
        </h2>
        <p className="mt-1.5 text-xs leading-5 text-slate-600">
          A single evaluator weight is now split into two ideas: each person’s influence
          and the score they give each organization.
        </p>
      </div>

      <div className="rounded-xl border border-slate-900/10 bg-slate-50/90 p-4">
        <div className="flex items-center justify-between gap-4">
          {[alice, bob].map((evaluator) => {
            const percentage = evaluator.id === alice.id ? alicePercentage : bobPercentage;

            return (
              <div
                key={evaluator.id}
                className="flex items-center gap-2.5"
                data-testid={`${evaluator.id}-influence`}
                data-percentage={percentage}
              >
                <span
                  aria-hidden="true"
                  className="grid size-8 place-items-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: evaluator.tint, color: evaluator.color }}
                >
                  {evaluator.name.slice(0, 1)}
                </span>
                <div className={evaluator.id === bob.id ? 'text-right' : undefined}>
                  <p className="text-xs font-semibold text-slate-900">{evaluator.name}</p>
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: evaluator.color }}
                  >
                    {percentage}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Slider
          aria-label="Alice evaluator influence"
          aria-valuetext={`Alice ${alicePercentage}%, Bob ${bobPercentage}%`}
          thumbAriaLabel="Alice evaluator influence"
          min={0}
          max={100}
          step={5}
          value={[alicePercentage]}
          onValueChange={(nextValue) =>
            onAliceShareChange(
              typeof nextValue === 'number' ? nextValue : nextValue[0],
            )
          }
          style={
            {
              '--alice-color': alice.color,
              '--bob-color': bob.color,
            } as CSSProperties
          }
          className="mt-3 [&_[data-slot=slider-range]]:bg-[var(--alice-color)] [&_[data-slot=slider-thumb]]:border-slate-950 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:bg-[var(--bob-color)]"
        />

        <div className="mt-3 flex items-start gap-2 text-[11px] leading-4 text-slate-500">
          <Scale aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-slate-600" />
          <p>
            Influence determines how much each person’s organization scores count. The
            two shares always add to 100%.
          </p>
        </div>
      </div>
    </section>
  );
}
