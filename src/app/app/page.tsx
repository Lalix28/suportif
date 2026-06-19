import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LevelBadge } from "@/components/dashboard/level-badge";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { XPBadge } from "@/components/dashboard/xp-badge";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { ReviewList } from "@/components/reviews/review-list";
import { requireRole } from "@/lib/auth/session";
import { parseSkillResults } from "@/lib/simulations/presentation";
import { getStudentDashboard } from "@/server/queries/student";

export const dynamic = "force-dynamic";

export default async function StudentAppPage() {
  const user = await requireRole(["STUDENT"]);
  const dashboard = await getStudentDashboard(user.id);
  const latestWeakSkills = parseSkillResults(dashboard.latestSimulationAttempt?.weakSkillsJson);

  return (
    <ProtectedShell user={user}>
      <div className="space-y-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Área do aluno</Badge>
              <XPBadge xp={user.profile?.totalXp ?? 0} />
              <LevelBadge level={user.profile?.level ?? 1} />
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Olá, {user.name}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Continue pelas trilhas demonstrativas e revise os pontos que merecem atenção.
            </p>
          </div>
          <Link
            href="/app/trilhas"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Ver trilhas
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <DashboardCard title="XP total" value={user.profile?.totalXp ?? 0} description="Perfil real." />
          <DashboardCard title="Nível" value={user.profile?.level ?? 1} description="Calculado por XP." />
          <DashboardCard
            title="Progresso geral"
            value={`${dashboard.progressPercent}%`}
            description={`${dashboard.completedMissions}/${dashboard.totalMissions} missões.`}
          />
          <DashboardCard
            title="Revisões"
            value={dashboard.pendingReviews.length}
            description="Pendentes ou atrasadas."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Próximo passo</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.nextStep ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      {dashboard.nextStep.trackTitle} · {dashboard.nextStep.moduleTitle}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950">{dashboard.nextStep.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {dashboard.nextStep.shortDescription}
                    </p>
                  </div>
                  <Link
                    href={`/app/missoes/${dashboard.nextStep.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                  >
                    Abrir missão
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  Nenhuma próxima missão encontrada. Inicie uma trilha pública para continuar.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges recentes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {dashboard.recentBadges.length > 0 ? (
                dashboard.recentBadges.map((userBadge) => (
                  <Badge key={userBadge.id} variant="outline">
                    {userBadge.badge.icon} {userBadge.badge.title}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-600">Nenhuma conquista registrada ainda.</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-emerald-100">
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Simulado recomendado</CardTitle>
                  <p className="mt-2 text-sm text-slate-600">
                    Pratique com resultado salvo e revisões geradas a partir dos erros.
                  </p>
                </div>
                <Link
                  href="/app/simulados"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                >
                  Ver simulados
                </Link>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-lg bg-emerald-50 p-4">
                {dashboard.recommendedSimulation ? (
                  <div className="space-y-3">
                    <Badge variant="secondary">{dashboard.recommendedSimulation.type}</Badge>
                    <h2 className="text-xl font-bold text-emerald-950">
                      {dashboard.recommendedSimulation.title}
                    </h2>
                    <p className="text-sm leading-6 text-emerald-900">
                      {dashboard.recommendedSimulation.description}
                    </p>
                    <Link
                      href={`/app/simulados/${dashboard.recommendedSimulation.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                    >
                      Iniciar prática
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-emerald-950">Nenhum simulado cadastrado no banco.</p>
                )}
              </div>
              <div className="rounded-lg border bg-white p-4">
                {dashboard.latestSimulationAttempt ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-500">Último resultado</p>
                    <p className="text-4xl font-bold text-slate-950">
                      {dashboard.latestSimulationAttempt.score}%
                    </p>
                    <p className="text-sm text-slate-600">
                      {dashboard.latestSimulationAttempt.simulation.title} ·{" "}
                      {dashboard.latestSimulationAttempt.correctCount} acertos e{" "}
                      {dashboard.latestSimulationAttempt.wrongCount} erros.
                    </p>
                    {latestWeakSkills.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-amber-700">Pontos fracos recentes</p>
                        {latestWeakSkills.slice(0, 3).map((skill) => (
                          <p key={skill.key} className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950">
                            {skill.label} · {skill.accuracy}%
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600">Sem ponto fraco registrado no último simulado.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    Faça seu primeiro simulado para ver pontos fortes e fracos aqui.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Trilhas em andamento</h2>
            <Link href="/app/trilhas" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Gerenciar trilhas
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.tracks.map(({ enrollment, summary }) => (
              <Card key={enrollment.id}>
                <CardHeader>
                  <CardTitle>{summary.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-slate-600">{summary.description}</p>
                  <ProgressBar
                    value={summary.progressPercent}
                    label={`${summary.completedMissions}/${summary.totalMissions} missões`}
                  />
                  <Link
                    href={`/app/trilhas/${summary.slug}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    Continuar
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Revisões pendentes</h2>
            <Link href="/app/revisoes" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Ver todas
            </Link>
          </div>
          <ReviewList reviews={dashboard.pendingReviews} />
        </section>
      </div>
    </ProtectedShell>
  );
}
