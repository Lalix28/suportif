import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationScoreChart } from "@/components/simulations/simulation-score-chart";
import { SimulationSkillAnalysis } from "@/components/simulations/simulation-skill-analysis";
import { parseSkillResults } from "@/lib/simulations/presentation";

type SimulationResultSummaryProps = {
  score: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  weakSkillsJson: unknown;
  strongSkillsJson: unknown;
};

export function SimulationResultSummary({
  score,
  correctCount,
  wrongCount,
  totalQuestions,
  weakSkillsJson,
  strongSkillsJson
}: SimulationResultSummaryProps) {
  const weakSkills = parseSkillResults(weakSkillsJson);
  const strongSkills = parseSkillResults(strongSkillsJson);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle>Resultado geral</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-[1fr_220px] sm:items-center">
            <div>
              <p className="text-6xl font-bold text-emerald-800">{score}%</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {correctCount} acertos, {wrongCount} erros, {totalQuestions} questões no total.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric label="Acertos" value={correctCount} />
                <Metric label="Erros" value={wrongCount} />
                <Metric label="Total" value={totalQuestions} />
              </div>
            </div>
            <SimulationScoreChart correctCount={correctCount} wrongCount={wrongCount} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leitura rápida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-700">
            <p>
              Use os pontos fracos para escolher revisões antes de refazer o simulado.
            </p>
            <p>
              Pontos fortes indicam assuntos que já estão mais firmes nesta tentativa.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SimulationSkillAnalysis
          title="Pontos fortes"
          description="Habilidades ou assuntos com boa taxa de acerto neste envio."
          skills={strongSkills}
          tone="strong"
        />
        <SimulationSkillAnalysis
          title="Pontos fracos"
          description="Habilidades ou assuntos que merecem revisão antes de refazer."
          skills={weakSkills}
          tone="weak"
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
