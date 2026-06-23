import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBestSimulationScore,
  getSimulationDescriptionText,
  getSimulationRecommendationStatus,
  getSimulationTypeLabel,
  type SimulationAttemptView
} from "@/lib/simulations/presentation";

type SimulationCardProps = {
  id: string;
  title: string;
  description: string;
  type: string;
  relationLabel: string;
  questionCount: number;
  attempts: SimulationAttemptView[];
};

export function SimulationCard({
  id,
  title,
  description,
  type,
  relationLabel,
  questionCount,
  attempts
}: SimulationCardProps) {
  const lastAttempt = attempts[0];
  const bestScore = getBestSimulationScore(attempts);
  const status = getSimulationRecommendationStatus(attempts);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{getSimulationTypeLabel(type)}</Badge>
          <Badge variant={status === "Revisar e refazer" ? "warning" : "outline"}>{status}</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">{getSimulationDescriptionText(description)}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Questões" value={questionCount} />
          <Metric label="Tentativas" value={attempts.length} />
          <Metric label="Melhor" value={bestScore === null ? "-" : `${bestScore}%`} />
        </div>
        <div className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-slate-950">{relationLabel}</p>
          {lastAttempt ? (
            <p>Último resultado: {lastAttempt.score}%</p>
          ) : (
            <p>Você ainda não iniciou este simulado.</p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/app/simulados/${id}`}
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            {attempts.length > 0 ? "Refazer" : "Iniciar"}
          </Link>
          {lastAttempt ? (
            <Link
              href={`/app/simulados/${id}/resultado?attemptId=${lastAttempt.id}`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Ver resultado
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border bg-white p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
