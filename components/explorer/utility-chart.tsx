import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  XAxis,
  YAxis,
} from 'recharts';

import type { AllocationResult } from '@/allocation/types';
import { utilityAtFunding } from '@/allocation/utility';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import {
  formatCompactResource,
  formatResource,
  type OrganizationViewModel,
  type ScenarioTemplate,
} from './scenario';

interface UtilityChartProps {
  organizations: OrganizationViewModel[];
  result: AllocationResult;
  template: ScenarioTemplate;
}

export function UtilityChart({
  organizations,
  result,
  template,
}: UtilityChartProps) {
  const config = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        organizations.map((organization) => [
          organization.id,
          { label: organization.name, color: organization.color },
        ]),
      ),
    [organizations],
  );

  const data = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const funding = (index / 20) * template.budget;
        return {
          funding,
          ...Object.fromEntries(
            organizations.map((organization) => [
              organization.id,
              utilityAtFunding(organization, funding, template.budget),
            ]),
          ),
        };
      }),
    [organizations, template],
  );

  return (
    <section
      aria-labelledby="utility-curves-title"
      className="rounded-2xl border border-slate-900/10 bg-white/75 p-4 shadow-sm shadow-slate-900/[0.03] backdrop-blur sm:p-6"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
            Utility curves
          </p>
          <h2
            id="utility-curves-title"
            className="mt-1 text-lg font-semibold text-slate-950"
          >
            {template.chartTitle}
          </h2>
        </div>
        <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-right">
          {template.chartDescription}
        </p>
      </div>

      <ChartContainer
        config={config}
        className="mt-4 h-[300px] w-full aspect-auto"
        aria-label={`Utility by allocated resource for all three ${template.optionNounPlural}`}
      >
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 2, left: 0 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} strokeDasharray="4 6" />
          <XAxis
            dataKey="funding"
            type="number"
            domain={[0, template.budget]}
            tickFormatter={(value: number) =>
              formatCompactResource(template, value)
            }
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            width={34}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: number) => value.toFixed(0)}
          />
          <ChartTooltip
            cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.funding !== undefined
                    ? formatResource(template, payload[0].payload.funding)
                    : ''
                }
                formatter={(value, name) => (
                  <div className="flex min-w-40 items-center justify-between gap-4">
                    <span className="text-slate-500">
                      {config[String(name)]?.label}
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {Number(value).toFixed(1)}
                    </span>
                  </div>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {organizations.map((organization) => (
            <Line
              key={organization.id}
              type="monotone"
              dataKey={organization.id}
              stroke={`var(--color-${organization.id})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
          {result.allocations.map((allocation, index) => (
            <ReferenceDot
              key={allocation.organizationId}
              x={allocation.dollars}
              y={allocation.utility}
              r={5}
              fill={organizations[index].color}
              stroke="#fff"
              strokeWidth={2}
              ifOverflow="extendDomain"
            />
          ))}
        </LineChart>
      </ChartContainer>
    </section>
  );
}
