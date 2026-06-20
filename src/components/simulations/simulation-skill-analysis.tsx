import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSkillDisplayName, type SkillResultView } from "@/lib/simulations/presentation";

type SimulationSkillAnalysisProps = {
  title: string;
  description: string;
  skills: SkillResultView[];
  tone: "strong" | "weak";
};

export function SimulationSkillAnalysis({
  title,
  description,
  skills,
  tone
}: SimulationSkillAnalysisProps) {
  const colorClass =
    tone === "strong" ? "bg-emerald-50 text-emerald-950" : "bg-amber-50 text-amber-950";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div
              key={`${getSkillDisplayName(skill)}-${index}`}
              className={`rounded-md px-3 py-2 text-sm ${colorClass}`}
            >
              <p className="font-semibold">{getSkillDisplayName(skill)}</p>
              <p>
                {skill.correctCount}/{skill.total} acertos · {skill.accuracy}%
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">Nenhum item destacado neste resultado.</p>
        )}
      </CardContent>
    </Card>
  );
}
