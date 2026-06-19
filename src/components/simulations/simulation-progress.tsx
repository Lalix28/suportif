"use client";

import { ProgressBar } from "@/components/dashboard/progress-bar";

type SimulationProgressProps = {
  answeredCount: number;
  totalCount: number;
};

export function SimulationProgress({ answeredCount, totalCount }: SimulationProgressProps) {
  const percent = totalCount === 0 ? 0 : Math.round((answeredCount / totalCount) * 100);
  const pending = totalCount - answeredCount;

  return (
    <div className="rounded-lg border bg-white p-4">
      <ProgressBar value={percent} label={`${answeredCount}/${totalCount} questões respondidas`} />
      <p className="mt-3 text-sm text-slate-600">
        {pending > 0 ? `${pending} questão(ões) pendente(s).` : "Todas as questões foram respondidas."}
      </p>
    </div>
  );
}
