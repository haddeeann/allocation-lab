import { type CSSProperties } from 'react';

import { Slider } from '@/components/ui/slider';

import type { OrganizationViewModel } from './scenario';

type EditableField =
  | 'weight'
  | 'initialMarginalUtility'
  | 'diminishingReturns';

interface ParameterSliderProps {
  label: string;
  accessibleLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
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
  color,
  testId,
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-baseline justify-between gap-4 text-[13px]">
        <span className="font-medium text-slate-600">{label}</span>
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
        className="py-1 [&_[data-slot=slider-range]]:bg-[var(--slider-color)] [&_[data-slot=slider-thumb]]:size-3.5 [&_[data-slot=slider-thumb]]:border-[var(--slider-color)]"
      />
    </div>
  );
}

interface OrganizationEditorProps {
  organization: OrganizationViewModel;
  onChange: (field: EditableField, value: number) => void;
}

export function OrganizationEditor({
  organization,
  onChange,
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
            Organization {organization.shortName}
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        <ParameterSlider
          label="Evaluator weight"
          accessibleLabel={`${organization.name} evaluator weight`}
          testId={`${organization.id}-weight`}
          value={organization.weight}
          min={0.2}
          max={2}
          step={0.1}
          displayValue={`${organization.weight.toFixed(1)}×`}
          color={organization.color}
          onChange={(value) => onChange('weight', value)}
        />
        <ParameterSlider
          label="Starting marginal utility"
          accessibleLabel={`${organization.name} starting marginal utility`}
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
