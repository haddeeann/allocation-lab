import { type CSSProperties } from 'react';

import { Slider } from '@/components/ui/slider';

import type {
  EvaluatorViewModel,
  OrganizationViewModel,
  ScenarioTemplate,
} from './scenario';

type EditableField = 'initialMarginalUtility' | 'diminishingReturns';

interface ParameterSliderProps {
  label: string;
  accessibleLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  helpText?: string;
  color: string;
  testId: string;
  onChange: (value: number) => void;
}

function ParameterSlider({
  label,
  accessibleLabel,
  value,
  min,
  max,
  step,
  displayValue,
  helpText,
  color,
  testId,
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-start justify-between gap-4 text-[13px]">
        <span>
          <span className="block font-medium text-slate-700">{label}</span>
          {helpText ? (
            <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">
              {helpText}
            </span>
          ) : null}
        </span>
        <output
          aria-live="polite"
          className="font-mono text-xs font-semibold text-slate-900"
        >
          {displayValue}
        </output>
      </div>
      <Slider
        aria-label={accessibleLabel}
        thumbAriaLabel={accessibleLabel}
        data-testid={testId}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(nextValue) =>
          onChange(typeof nextValue === 'number' ? nextValue : nextValue[0])
        }
        style={{ '--slider-color': color } as CSSProperties}
        className="[&_[data-slot=slider-range]]:bg-[var(--slider-color)] [&_[data-slot=slider-thumb]]:border-[var(--slider-color)]"
      />
    </div>
  );
}

interface OrganizationEditorProps {
  organization: OrganizationViewModel;
  evaluators: EvaluatorViewModel[];
  template: ScenarioTemplate;
  onChange: (field: EditableField, value: number) => void;
  onEvaluatorScoreChange: (evaluatorId: string, value: number) => void;
}

export function OrganizationEditor({
  organization,
  evaluators,
  template,
  onChange,
  onEvaluatorScoreChange,
}: OrganizationEditorProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-900/10 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: organization.color }}
      />
      <div className="mb-6 flex items-center gap-3">
        <span
          className="grid size-9 place-items-center rounded-xl text-sm font-bold"
          style={{
            backgroundColor: organization.tint,
            color: organization.color,
          }}
        >
          {organization.shortName}
        </span>
        <div>
          <h3 className="font-semibold tracking-tight text-slate-950">
            {organization.name}
          </h3>
          <p className="text-[11px] text-slate-500">
            {template.optionNoun.charAt(0).toUpperCase() +
              template.optionNoun.slice(1)}{' '}
            {organization.shortName}
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-xl border border-slate-900/10 bg-slate-50/80 p-3">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Evaluator scores
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                Each person’s preference multiplier for this{' '}
                {template.optionNoun}.
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-white px-2 py-1 font-mono text-[10px] font-semibold text-slate-700 ring-1 ring-slate-900/10">
              Combined {organization.weight.toFixed(2)}×
            </span>
          </div>
          <div className="grid gap-4">
            {evaluators.map((evaluator) => (
              <ParameterSlider
                key={evaluator.id}
                label={`${evaluator.name}’s score`}
                accessibleLabel={`${evaluator.name} score for ${organization.name}`}
                testId={`${organization.id}-${evaluator.id}-score`}
                value={evaluator.organizationScores[organization.id]}
                min={0.2}
                max={2}
                step={0.1}
                displayValue={`${evaluator.organizationScores[organization.id].toFixed(1)}×`}
                color={evaluator.color}
                onChange={(value) =>
                  onEvaluatorScoreChange(evaluator.id, value)
                }
              />
            ))}
          </div>
        </div>
        <ParameterSlider
          label={template.startingUtilityLabel}
          helpText={template.startingUtilityHelp}
          accessibleLabel={`${organization.name} ${template.startingUtilityLabel.toLowerCase()}`}
          testId={`${organization.id}-marginal`}
          value={organization.initialMarginalUtility}
          min={20}
          max={180}
          step={5}
          displayValue={organization.initialMarginalUtility.toFixed(0)}
          color={organization.color}
          onChange={(value) => onChange('initialMarginalUtility', value)}
        />
        <ParameterSlider
          label="Diminishing returns"
          helpText={template.diminishingReturnsHelp}
          accessibleLabel={`${organization.name} diminishing returns`}
          testId={`${organization.id}-diminishing`}
          value={organization.diminishingReturns}
          min={0.2}
          max={4}
          step={0.1}
          displayValue={organization.diminishingReturns.toFixed(1)}
          color={organization.color}
          onChange={(value) => onChange('diminishingReturns', value)}
        />
      </div>
    </article>
  );
}
