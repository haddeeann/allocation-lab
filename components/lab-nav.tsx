import type { ScenarioId } from '@/components/explorer/scenario';
import { SCENARIOS, SCENARIO_ORDER } from '@/components/explorer/scenario';

/* oxlint-disable next/no-html-link-for-pages -- shared navigation must also run in the standalone static build */

interface LabNavProps {
  active: 'workbench' | ScenarioId;
  onScenarioChange?: (scenarioId: ScenarioId) => void;
}

export function LabNav({ active, onScenarioChange }: LabNavProps) {
  return (
    <nav
      aria-label="Allocation Lab tools"
      className="mb-5 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-900/10 bg-white/75 p-1 shadow-sm shadow-slate-900/[0.04]"
    >
      <a
        href="/workbench"
        aria-current={active === 'workbench' ? 'page' : undefined}
        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active === 'workbench'
            ? 'bg-slate-950 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
        }`}
      >
        Decision workbench
      </a>
      {SCENARIO_ORDER.map((id) => {
        const scenario = SCENARIOS[id];
        const isActive = id === active;
        return (
          <a
            key={id}
            href={scenario.path}
            aria-current={isActive ? 'page' : undefined}
            onClick={
              onScenarioChange
                ? (event) => {
                    event.preventDefault();
                    onScenarioChange(id);
                  }
                : undefined
            }
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            {scenario.navLabel}
          </a>
        );
      })}
    </nav>
  );
}
