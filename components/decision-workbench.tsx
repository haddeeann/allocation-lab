'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Compass,
  FlaskConical,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { LabNav } from '@/components/lab-nav';
import { analyzeDecision } from '@/decision/analyze';
import type { DecisionModel, DecisionOption } from '@/decision/types';

const STORAGE_KEY = 'allocation-lab-decision-workbench-v1';
const SCALE_LABELS = ['—', 'Very low', 'Low', 'Medium', 'High', 'Very high'];

type TemplateId = 'blank' | 'make-or-source' | 'future-direction';

const TEMPLATE_COPY: Record<TemplateId, { name: string; description: string }> =
  {
    blank: {
      name: 'Start blank',
      description: 'Name your own decision, options, values, and scenarios.',
    },
    'make-or-source': {
      name: 'Buy, build, or borrow',
      description: 'Explore a common software and capability decision.',
    },
    'future-direction': {
      name: 'Choose a future direction',
      description:
        'Compare substantially different paths without declaring one permanent winner.',
    },
  };

function neutralOptions(names: string[]): DecisionOption[] {
  return names.map((name, index) => ({
    id: `option-${index + 1}`,
    name,
    description: '',
    criterionScores: {
      criterion1: 3,
      criterion2: 3,
      criterion3: 3,
      criterion4: 3,
    },
    scenarioScores: { scenario1: 3, scenario2: 3, scenario3: 3 },
    evidence: 3,
    reversibility: 3,
    learningValue: 3,
    experimentCost: 3,
  }));
}

function createTemplate(templateId: TemplateId): DecisionModel {
  if (templateId === 'make-or-source') {
    const options = neutralOptions(['Buy', 'Build', 'Borrow or partner']);
    options[0] = {
      ...options[0],
      description: 'Purchase an existing product or service.',
      criterionScores: {
        criterion1: 5,
        criterion2: 2,
        criterion3: 3,
        criterion4: 2,
      },
      scenarioScores: { scenario1: 4, scenario2: 4, scenario3: 3 },
      evidence: 4,
      reversibility: 4,
      learningValue: 2,
      experimentCost: 2,
    };
    options[1] = {
      ...options[1],
      description: 'Create and maintain the capability ourselves.',
      criterionScores: {
        criterion1: 1,
        criterion2: 5,
        criterion3: 2,
        criterion4: 5,
      },
      scenarioScores: { scenario1: 1, scenario2: 4, scenario3: 5 },
      evidence: 2,
      reversibility: 2,
      learningValue: 4,
      experimentCost: 5,
    };
    options[2] = {
      ...options[2],
      description: 'Use a partner, open-source project, or shared capability.',
      criterionScores: {
        criterion1: 4,
        criterion2: 1,
        criterion3: 5,
        criterion4: 1,
      },
      scenarioScores: { scenario1: 5, scenario2: 3, scenario3: 1 },
      evidence: 3,
      reversibility: 5,
      learningValue: 3,
      experimentCost: 1,
    };
    return {
      question: 'How should we obtain this capability?',
      horizon: 'The next 12 months',
      criteria: [
        { id: 'criterion1', name: 'Speed to usefulness', weight: 4 },
        { id: 'criterion2', name: 'Control', weight: 3 },
        { id: 'criterion3', name: 'Cost fit', weight: 4 },
        { id: 'criterion4', name: 'Long-term leverage', weight: 3 },
      ],
      scenarios: [
        { id: 'scenario1', name: 'Usage stays low' },
        { id: 'scenario2', name: 'Expected usage' },
        { id: 'scenario3', name: 'Usage grows quickly' },
      ],
      options,
    };
  }

  if (templateId === 'future-direction') {
    return {
      question: 'What should I seriously pursue after current projects wrap?',
      horizon: 'The next 1–3 years',
      criteria: [
        { id: 'criterion1', name: 'Financial sustainability', weight: 3 },
        { id: 'criterion2', name: 'Autonomy', weight: 3 },
        { id: 'criterion3', name: 'Growth and learning', weight: 3 },
        { id: 'criterion4', name: 'Meaning and craft', weight: 3 },
      ],
      scenarios: [
        { id: 'scenario1', name: 'Supportive conditions' },
        { id: 'scenario2', name: 'Expected conditions' },
        { id: 'scenario3', name: 'Difficult conditions' },
      ],
      options: neutralOptions([
        'Seriously monetize a project',
        'Return to school',
        'Focus on finishing novels',
      ]),
    };
  }

  return {
    question: 'What decision are you exploring?',
    horizon: 'The period this decision should cover',
    criteria: [
      { id: 'criterion1', name: 'Value created', weight: 3 },
      { id: 'criterion2', name: 'Feasibility', weight: 3 },
      { id: 'criterion3', name: 'Alignment', weight: 3 },
      { id: 'criterion4', name: 'Timing', weight: 3 },
    ],
    scenarios: [
      { id: 'scenario1', name: 'Favorable conditions' },
      { id: 'scenario2', name: 'Expected conditions' },
      { id: 'scenario3', name: 'Difficult conditions' },
    ],
    options: neutralOptions(['Option A', 'Option B', 'Option C']),
  };
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between gap-3 text-xs font-medium text-slate-700">
        <span>{label}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
          {SCALE_LABELS[value]}
        </span>
      </span>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-blue-700"
      />
    </label>
  );
}

function formatNumber(value: number) {
  return value.toFixed(1);
}

export function DecisionWorkbench() {
  const [model, setModel] = useState<DecisionModel>(() =>
    createTemplate('make-or-source'),
  );
  const [storageReady, setStorageReady] = useState(false);
  const analysis = useMemo(() => analyzeDecision(model), [model]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        // oxlint-disable-next-line react/react-compiler -- browser-local drafts hydrate after the server-safe initial render
        setModel(JSON.parse(saved) as DecisionModel);
      } catch {
        // A malformed local draft should not prevent the tool from opening.
      }
    }
    // oxlint-disable-next-line react/react-compiler -- persistence starts only after the browser draft has been read
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (storageReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
    }
  }, [model, storageReady]);

  function loadTemplate(templateId: TemplateId) {
    setModel(createTemplate(templateId));
  }

  function updateOption(
    optionId: string,
    updater: (option: DecisionOption) => DecisionOption,
  ) {
    setModel((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId ? updater(option) : option,
      ),
    }));
  }

  function optionName(optionId: string) {
    return model.options.find((option) => option.id === optionId)?.name ?? '';
  }

  const lensCards = [
    {
      id: 'preference',
      title: 'Tradeoff fit',
      eyebrow: 'Weighted utility',
      icon: Scale,
      leaders: analysis.leaders.preference,
      explanation:
        'Balances what matters to you, then discounts the result when the supporting evidence is weak.',
    },
    {
      id: 'robustness',
      title: 'Robust choice',
      eyebrow: 'Scenarios and regret',
      icon: ShieldCheck,
      leaders: analysis.leaders.robustness,
      explanation:
        'Looks for an option that holds up in its weakest scenario and avoids the largest regret.',
    },
    {
      id: 'preservation',
      title: 'Keep options open',
      eyebrow: 'Reversibility',
      icon: Compass,
      leaders: analysis.leaders.preservation,
      explanation:
        'Values moves that are easier to reverse and that create useful learning for later decisions.',
    },
    {
      id: 'learning',
      title: 'Best next experiment',
      eyebrow: 'Value of information',
      icon: FlaskConical,
      leaders: analysis.leaders.learning,
      explanation:
        'Favors inexpensive tests that could teach you something important where evidence is currently weak.',
    },
  ] as const;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1480px]">
        <LabNav active="workbench" />

        <header className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-900/10 pb-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Allocation Lab · Early workbench
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[42px] sm:leading-[1.05]">
              Explore a decision from more than one angle.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              Describe the same choice once, then see what changes when you ask
              about preferences, difficult scenarios, reversibility, and the
              value of learning before committing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadTemplate('make-or-source')}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-900/10 bg-white/75 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Reset example
          </button>
        </header>

        <section aria-labelledby="starter-title" className="mb-6">
          <div className="mb-3">
            <h2
              id="starter-title"
              className="text-sm font-semibold text-slate-950"
            >
              Choose a starting point
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Templates provide structure, not an answer. Every field remains
              editable.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(TEMPLATE_COPY) as TemplateId[]).map((templateId) => (
              <button
                key={templateId}
                type="button"
                onClick={() => loadTemplate(templateId)}
                className="rounded-2xl border border-slate-900/10 bg-white/75 p-4 text-left shadow-sm shadow-slate-900/[0.03] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md"
              >
                <span className="text-sm font-semibold text-slate-950">
                  {TEMPLATE_COPY[templateId].name}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {TEMPLATE_COPY[templateId].description}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(240px,0.5fr)]">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Decision
              </span>
              <input
                value={model.question}
                onChange={(event) =>
                  setModel((current) => ({
                    ...current,
                    question: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-950 shadow-inner outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Decision horizon
              </span>
              <input
                value={model.horizon}
                onChange={(event) =>
                  setModel((current) => ({
                    ...current,
                    horizon: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-inner outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(370px,0.75fr)]">
          <div className="grid gap-6">
            <OptionsSection model={model} updateOption={updateOption} />
            <TradeoffTool
              model={model}
              setModel={setModel}
              updateOption={updateOption}
            />
            <ScenarioTool
              model={model}
              setModel={setModel}
              updateOption={updateOption}
            />
            <FlexibilityTool model={model} updateOption={updateOption} />
          </div>

          <aside className="self-start xl:sticky xl:top-6">
            <div className="rounded-2xl border border-slate-900/10 bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
                What each tool sees
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {model.question}
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {model.horizon}
              </p>

              <div className="mt-5 grid gap-3">
                {lensCards.map((lens) => {
                  const Icon = lens.icon;
                  return (
                    <article
                      key={lens.id}
                      className="rounded-xl border border-white/10 bg-white/[0.06] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-blue-200">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            {lens.eyebrow}
                          </p>
                          <h3 className="mt-0.5 text-sm font-semibold text-white">
                            {lens.title}
                          </h3>
                          <p className="mt-2 text-base font-semibold text-blue-200">
                            {lens.leaders.map(optionName).join(' + ')}
                          </p>
                          <p className="mt-2 text-[11px] leading-5 text-slate-400">
                            {lens.explanation}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div
                className={`mt-4 rounded-xl border p-4 ${
                  analysis.hasDisagreement
                    ? 'border-amber-300/20 bg-amber-300/10'
                    : 'border-emerald-300/20 bg-emerald-300/10'
                }`}
              >
                <p className="text-xs font-semibold text-white">
                  {analysis.hasDisagreement
                    ? 'The tools disagree—and that is useful.'
                    : 'The tools currently point in the same direction.'}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-300">
                  {analysis.hasDisagreement
                    ? 'Inspect which assumptions create the disagreement instead of hiding it inside one master score.'
                    : 'Try changing a weak assumption to see whether the agreement is robust or accidental.'}
                </p>
              </div>

              <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <summary className="cursor-pointer text-xs font-semibold text-slate-200">
                  Show the numbers
                </summary>
                <div className="mt-3 grid gap-2 text-[10px] text-slate-400">
                  {analysis.options.map((option) => (
                    <div
                      key={option.optionId}
                      className="grid grid-cols-[1fr_auto] gap-3 border-t border-white/10 pt-2"
                    >
                      <span className="font-medium text-slate-200">
                        {optionName(option.optionId)}
                      </span>
                      <span className="font-mono text-right">
                        fit {formatNumber(option.evidenceAdjustedFit)} · worst{' '}
                        {formatNumber(option.worstCase)} · regret{' '}
                        {formatNumber(option.maximumRegret)}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
            <p className="mt-3 px-2 text-[10px] leading-4 text-slate-500">
              Early prototype. Scores are structured judgments, not objective
              facts. The workbench exposes assumptions and disagreement; it does
              not make the decision for you.
            </p>
          </aside>
        </div>

        <footer className="mt-8 border-t border-slate-900/10 py-6 text-[11px] leading-5 text-slate-500">
          Your draft is stored only in this browser. The method explorers in the
          navigation preserve the original S-Process-inspired allocation model.
        </footer>
      </div>
    </main>
  );
}

interface EditorProps {
  model: DecisionModel;
  updateOption: (
    optionId: string,
    updater: (option: DecisionOption) => DecisionOption,
  ) => void;
}

function OptionsSection({ model, updateOption }: EditorProps) {
  return (
    <section aria-labelledby="options-title">
      <div className="mb-3">
        <h2 id="options-title" className="text-sm font-semibold text-slate-950">
          Options under consideration
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          This prototype compares three options. A meaningful combination can be
          entered as its own option.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {model.options.map((option, index) => (
          <article
            key={option.id}
            className="rounded-2xl border border-slate-900/10 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.04]"
          >
            <span className="mb-3 grid size-7 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white">
              {index + 1}
            </span>
            <label className="grid gap-1">
              <span className="sr-only">Option {index + 1} name</span>
              <input
                value={option.name}
                onChange={(event) =>
                  updateOption(option.id, (current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm font-semibold text-slate-950 outline-none transition hover:border-slate-200 focus:border-blue-500 focus:bg-white"
              />
            </label>
            <label className="mt-1 grid gap-1">
              <span className="sr-only">Option {index + 1} description</span>
              <textarea
                rows={3}
                value={option.description}
                placeholder="What does this option actually involve?"
                onChange={(event) =>
                  updateOption(option.id, (current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="w-full resize-none rounded-lg border border-transparent bg-transparent px-1 py-1 text-xs leading-5 text-slate-600 outline-none transition hover:border-slate-200 focus:border-blue-500 focus:bg-white"
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolHeader({
  icon: Icon,
  title,
  description,
  tint,
}: {
  icon: typeof Scale;
  title: string;
  description: string;
  tint: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl ${tint}`}
      >
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function TradeoffTool({
  model,
  setModel,
  updateOption,
}: EditorProps & {
  setModel: React.Dispatch<React.SetStateAction<DecisionModel>>;
}) {
  return (
    <section className="rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
      <ToolHeader
        icon={Scale}
        title="Tool 1 · Tradeoff fit"
        description="Name what matters, set its influence, then rate how well each option serves it."
        tint="bg-blue-50 text-blue-700"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              <th className="border-b border-slate-200 pb-2 pr-3">
                What matters
              </th>
              <th className="border-b border-slate-200 px-3 pb-2 text-center">
                Weight
              </th>
              {model.options.map((option) => (
                <th
                  key={option.id}
                  className="border-b border-slate-200 px-3 pb-2 text-center"
                >
                  {option.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.criteria.map((criterion) => (
              <tr key={criterion.id}>
                <td className="border-b border-slate-100 py-3 pr-3">
                  <input
                    value={criterion.name}
                    aria-label={`${criterion.name} criterion name`}
                    onChange={(event) =>
                      setModel((current) => ({
                        ...current,
                        criteria: current.criteria.map((item) =>
                          item.id === criterion.id
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      }))
                    }
                    className="w-full rounded-md border border-transparent bg-transparent px-1 py-1 text-xs font-medium text-slate-800 outline-none hover:border-slate-200 focus:border-blue-500"
                  />
                </td>
                <td className="border-b border-slate-100 px-3 py-3 text-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={criterion.weight}
                    aria-label={`${criterion.name} weight`}
                    onChange={(event) =>
                      setModel((current) => ({
                        ...current,
                        criteria: current.criteria.map((item) =>
                          item.id === criterion.id
                            ? { ...item, weight: Number(event.target.value) }
                            : item,
                        ),
                      }))
                    }
                    className="h-2 w-24 cursor-pointer accent-blue-700"
                  />
                  <span className="mt-1 block text-[10px] font-bold text-slate-500">
                    {criterion.weight}
                  </span>
                </td>
                {model.options.map((option) => (
                  <td
                    key={option.id}
                    className="border-b border-slate-100 px-3 py-3 text-center"
                  >
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={option.criterionScores[criterion.id]}
                      aria-label={`${option.name} score for ${criterion.name}`}
                      onChange={(event) =>
                        updateOption(option.id, (current) => ({
                          ...current,
                          criterionScores: {
                            ...current.criterionScores,
                            [criterion.id]: Number(event.target.value),
                          },
                        }))
                      }
                      className="h-2 w-24 cursor-pointer accent-blue-700"
                    />
                    <span className="mt-1 block text-[10px] font-bold text-slate-500">
                      {SCALE_LABELS[option.criterionScores[criterion.id]]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScenarioTool({
  model,
  setModel,
  updateOption,
}: EditorProps & {
  setModel: React.Dispatch<React.SetStateAction<DecisionModel>>;
}) {
  return (
    <section className="rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
      <ToolHeader
        icon={ShieldCheck}
        title="Tool 2 · Scenarios and regret"
        description="Ask how each option performs if the future is more favorable or difficult than expected."
        tint="bg-emerald-50 text-emerald-700"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {model.scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <input
              value={scenario.name}
              aria-label={`${scenario.name} scenario name`}
              onChange={(event) =>
                setModel((current) => ({
                  ...current,
                  scenarios: current.scenarios.map((item) =>
                    item.id === scenario.id
                      ? { ...item, name: event.target.value }
                      : item,
                  ),
                }))
              }
              className="mb-4 w-full rounded-md border border-transparent bg-transparent px-1 py-1 text-xs font-semibold text-slate-900 outline-none hover:border-slate-200 focus:border-emerald-500 focus:bg-white"
            />
            <div className="grid gap-4">
              {model.options.map((option) => (
                <SliderField
                  key={option.id}
                  label={option.name}
                  value={option.scenarioScores[scenario.id]}
                  onChange={(value) =>
                    updateOption(option.id, (current) => ({
                      ...current,
                      scenarioScores: {
                        ...current.scenarioScores,
                        [scenario.id]: value,
                      },
                    }))
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlexibilityTool({ model, updateOption }: EditorProps) {
  return (
    <section className="rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
      <ToolHeader
        icon={Compass}
        title="Tools 3–4 · Flexibility and learning"
        description="Distinguish a strong commitment from a useful experiment that keeps options open."
        tint="bg-violet-50 text-violet-700"
      />
      <div className="grid gap-3 md:grid-cols-3">
        {model.options.map((option) => (
          <article
            key={option.id}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <h3 className="mb-4 text-xs font-semibold text-slate-950">
              {option.name}
            </h3>
            <div className="grid gap-4">
              <SliderField
                label="Strength of evidence"
                value={option.evidence}
                onChange={(value) =>
                  updateOption(option.id, (current) => ({
                    ...current,
                    evidence: value,
                  }))
                }
              />
              <SliderField
                label="Ease of reversing course"
                value={option.reversibility}
                onChange={(value) =>
                  updateOption(option.id, (current) => ({
                    ...current,
                    reversibility: value,
                  }))
                }
              />
              <SliderField
                label="Learning from a small test"
                value={option.learningValue}
                onChange={(value) =>
                  updateOption(option.id, (current) => ({
                    ...current,
                    learningValue: value,
                  }))
                }
              />
              <SliderField
                label="Cost of that test"
                value={option.experimentCost}
                onChange={(value) =>
                  updateOption(option.id, (current) => ({
                    ...current,
                    experimentCost: value,
                  }))
                }
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
