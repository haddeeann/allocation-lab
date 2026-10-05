'use client';

import {
  ArrowRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface TutorialPanelProps {
  onRunExample: () => void;
  onReset: () => void;
}

const STEPS = [
  {
    icon: SlidersHorizontal,
    title: 'Change one assumption',
    description:
      'Weight sets evaluator preference, starting utility values the first dollar, and diminishing returns controls how quickly later dollars lose value.',
  },
  {
    icon: CircleDollarSign,
    title: 'Watch dollars move',
    description:
      'The recommendation updates instantly. The small +/− labels compare each allocation with the starting scenario.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Trace the reason',
    description:
      'The chart shows cumulative value. Each dot marks the recommended funding level; the explanation names the assumption driving the change.',
  },
] as const;

export function TutorialPanel({ onRunExample, onReset }: TutorialPanelProps) {
  return (
    <section
      id="tutorial-guide"
      aria-labelledby="tutorial-title"
      className="mb-6 overflow-hidden rounded-2xl border border-blue-900/10 bg-blue-50/70 shadow-sm shadow-blue-950/[0.03]"
    >
      <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(230px,0.72fr)_minmax(0,2fr)] xl:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
            A two-minute tour
          </p>
          <h2
            id="tutorial-title"
            className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950"
          >
            Follow the next best dollar.
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-slate-600">
            The model keeps assigning money wherever the next dollar creates the most
            weighted value.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onRunExample} className="bg-blue-700 hover:bg-blue-800">
              Try the example
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Button>
            <Button variant="outline" onClick={onReset} className="bg-white/70">
              <RotateCcw aria-hidden="true" data-icon="inline-start" />
              Restore baseline
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-slate-500">
            Example: doubles Common Field’s evaluator weight.
          </p>
        </div>

        <ol className="grid gap-3 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="rounded-xl border border-blue-900/10 bg-white/70 p-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-blue-100 text-blue-700">
                    <Icon aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="font-mono text-[10px] font-bold text-blue-700">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-[11px] leading-[1.55] text-slate-500">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
