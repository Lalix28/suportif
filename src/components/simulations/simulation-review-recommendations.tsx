import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatReviewDueText,
  getSkillDisplayName,
  type SkillResultView
} from "@/lib/simulations/presentation";

type SimulationReviewRecommendationsProps = {
  weakSkills: SkillResultView[];
  reviews: Array<{
    id: string;
    dueAt: Date;
    mission: {
      title: string;
      module: {
        title: string;
        track: {
          title: string;
        };
      };
    };
    skill: {
      name: string;
    } | null;
  }>;
};

export function SimulationReviewRecommendations({
  weakSkills,
  reviews
}: SimulationReviewRecommendationsProps) {
  return (
    <Card className="border-emerald-100 bg-emerald-50">
      <CardHeader>
        <CardTitle>Recomendações de revisão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length > 0 ? (
          <div className="space-y-2 text-sm leading-6 text-emerald-950">
            {reviews.slice(0, 4).map((review) => (
              <div key={review.id} className="rounded-md bg-white/70 px-3 py-2">
                <p className="font-semibold">{review.mission.title}</p>
                <p>
                  {review.mission.module.track.title} · {review.mission.module.title}
                  {review.skill ? ` · ${review.skill.name}` : ""}
                </p>
                <p className="text-emerald-800">{formatReviewDueText(review.dueAt)}</p>
              </div>
            ))}
          </div>
        ) : weakSkills.length > 0 ? (
          <div className="space-y-2 text-sm leading-6 text-emerald-950">
            {weakSkills.slice(0, 4).map((skill, index) => (
              <p key={`${getSkillDisplayName(skill)}-${index}`}>
                Revise <strong>{getSkillDisplayName(skill)}</strong> antes de refazer o simulado.
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-emerald-950">
            O resultado não gerou pontos fracos. Mantenha a revisão espaçada para consolidar.
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/app/revisoes"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Abrir revisões
          </Link>
          <Link
            href="/app/simulados"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            Voltar aos simulados
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
