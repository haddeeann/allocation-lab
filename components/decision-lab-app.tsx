'use client';

import { useEffect, useState } from 'react';

import {
  SCENARIOS,
  scenarioFromPath,
  type ScenarioId,
} from '@/components/explorer/scenario';
import { MiniSProcessExplorer } from '@/components/mini-s-process-explorer';

export function DecisionLabApp() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(() =>
    scenarioFromPath(window.location.pathname),
  );

  useEffect(() => {
    const handlePopState = () =>
      setScenarioId(scenarioFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(nextScenarioId: ScenarioId) {
    window.history.pushState({}, '', SCENARIOS[nextScenarioId].path);
    setScenarioId(nextScenarioId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <MiniSProcessExplorer
      key={scenarioId}
      scenarioId={scenarioId}
      onScenarioChange={navigate}
    />
  );
}
