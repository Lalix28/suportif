import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { SimulationForm } from "@/components/simulations/simulation-form";
import { requireRole } from "@/lib/auth/session";
import { getBestSimulationScore, getSimulationTypeLabel } from "@/lib/simulations/presentation";
import { getStudentSimulation } from "@/server/queries/simulations";

export const dynamic = "force-dynamic";

export default async function StudentSimulationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["STUDENT"]);
  const { id } = await params;
  const simulation = await getStudentSimulation(user.id, id);

  if (!simulation) {
    notFound();
  }

  const bestScore = getBestSimulationScore(simulation.attempts);
  const lastAttempt = simulation.attempts[0];

  return (
    <ProtectedShell user={user}>
      <div className="space-y-8">
        <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            <Link href="/app/simulados" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Voltar para simulados
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{getSimulationTypeLabel(simulation.type)}</Badge>
              {simulation.isDemo ? <Badge variant="outline">Conteúdo demonstrativo</Badge> : null}
            </div>
            <h1 className="text-3xl font-bold text-slate-950">{simulation.title}</h1>
            <p className="max-w-3xl text-slate-600">{simulation.description}</p>
          </div>
          <Card>
            <CardContent className="grid gap-3 p-5">
              <Metric label="Questões" value={simulation.questions.length} />
              <Metric label="Tentativas" value={simulation.attempts.length} />
              <Metric label="Melhor nota" value={bestScore === null ? "-" : `${bestScore}%`} />
              {lastAttempt ? (
                <Link
                  href={`/app/simulados/${simulation.id}/resultado?attemptId=${lastAttempt.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Ver último resultado
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </section>

        {simulation.questions.length > 0 ? (
          <SimulationForm simulationId={simulation.id} questions={simulation.questions} />
        ) : (
          <EmptyState
            title="Simulado sem questões"
            description="Este simulado existe no banco, mas ainda não possui questões vinculadas."
          />
        )}
      </div>
    </ProtectedShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
