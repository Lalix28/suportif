import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { SimulationCard } from "@/components/simulations/simulation-card";
import { requireRole } from "@/lib/auth/session";
import { getStudentSimulations } from "@/server/queries/simulations";

export const dynamic = "force-dynamic";

function getRelationLabel(simulation: Awaited<ReturnType<typeof getStudentSimulations>>[number]) {
  if (simulation.module) {
    return `Módulo: ${simulation.module.title}`;
  }

  if (simulation.track) {
    return `Trilha: ${simulation.track.title}`;
  }

  return "Simulado misto";
}

export default async function StudentSimulationsPage() {
  const user = await requireRole(["STUDENT"]);
  const simulations = await getStudentSimulations(user.id);

  return (
    <ProtectedShell user={user}>
      <div className="space-y-8">
        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <Badge variant="secondary">Prática com resultado salvo</Badge>
            <h1 className="mt-3 text-3xl font-black text-slate-950">Simulados</h1>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Pratique com questões demonstrativas, veja seu resultado e use os pontos de dificuldade para orientar
              as próximas revisões.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm shadow-slate-950/[0.03]">
            <p className="text-sm font-semibold text-slate-950">{simulations.length} simulados disponíveis</p>
            <p className="mt-1 text-sm text-slate-600">
              {simulations.reduce((total, simulation) => total + simulation.attempts.length, 0)} tentativas suas
              registradas.
            </p>
          </div>
        </section>

        {simulations.length > 0 ? (
          <section className="grid gap-4 lg:grid-cols-2">
            {simulations.map((simulation) => (
              <SimulationCard
                key={simulation.id}
                id={simulation.id}
                title={simulation.title}
                description={simulation.description}
                type={simulation.type}
                relationLabel={getRelationLabel(simulation)}
                questionCount={simulation.questions.length}
                attempts={simulation.attempts}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            title="Novos simulados aparecerão aqui"
            description="Quando houver uma prática disponível para sua jornada, ela aparecerá nesta área."
          />
        )}
      </div>
    </ProtectedShell>
  );
}
