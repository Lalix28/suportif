import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { SimulationResultSummary } from "@/components/simulations/simulation-result-summary";
import { SimulationReviewRecommendations } from "@/components/simulations/simulation-review-recommendations";
import { SimulationWrongAnswers } from "@/components/simulations/simulation-wrong-answers";
import { requireRole } from "@/lib/auth/session";
import { parseSkillResults } from "@/lib/simulations/presentation";
import {
  getSimulationReviewRecommendations,
  getStudentSimulationResult
} from "@/server/queries/simulations";

export const dynamic = "force-dynamic";

export default async function StudentSimulationResultPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const user = await requireRole(["STUDENT"]);
  const { id } = await params;
  const { attemptId } = await searchParams;
  const result = await getStudentSimulationResult(user.id, id, attemptId);

  if (!result) {
    notFound();
  }

  const wrongAnswers = result.answers.filter((answer) => !answer.isCorrect);
  const reviewPairs = wrongAnswers.map((answer) => ({
    missionId: answer.exercise.missionId,
    skillId: answer.exercise.skillId
  }));
  const reviews = await getSimulationReviewRecommendations(user.id, reviewPairs);
  const weakSkills = parseSkillResults(result.weakSkillsJson);
  const totalQuestions = result.simulation.questions.length || result.correctCount + result.wrongCount;

  return (
    <ProtectedShell user={user}>
      <div className="space-y-8">
        <section className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-end">
          <div className="space-y-3">
            <Link href="/app/simulados" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Voltar para simulados
            </Link>
            <Badge variant="secondary">Resultado do simulado</Badge>
            <h1 className="text-3xl font-bold text-slate-950">{result.simulation.title}</h1>
            <p className="text-sm text-slate-500">
              Tentativa registrada em {result.finishedAt?.toLocaleString("pt-BR") ?? "data não informada"}.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link
                href={`/app/simulados/${result.simulationId}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                Refazer simulado
              </Link>
              <Link
                href="/app/revisoes"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Abrir revisões
              </Link>
            </CardContent>
          </Card>
        </section>

        <SimulationResultSummary
          score={result.score}
          correctCount={result.correctCount}
          wrongCount={result.wrongCount}
          totalQuestions={totalQuestions}
          weakSkillsJson={result.weakSkillsJson}
          strongSkillsJson={result.strongSkillsJson}
        />

        <SimulationReviewRecommendations weakSkills={weakSkills} reviews={reviews} />

        <SimulationWrongAnswers answers={result.answers} />
      </div>
    </ProtectedShell>
  );
}
