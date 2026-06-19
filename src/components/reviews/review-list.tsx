import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { completeReviewAction } from "@/server/actions/student";

type ReviewListProps = {
  reviews: Array<{
    id: string;
    dueAt: Date;
    intervalDays: number;
    status: string;
    mission: {
      id: string;
      title: string;
      module: {
        title: string;
        track: {
          title: string;
          slug: string;
        };
      };
    };
    skill: {
      name: string;
    } | null;
  }>;
};

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-600">
          Não há revisões pendentes no momento.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={review.status === "OVERDUE" ? "warning" : "outline"}>
                  {review.status}
                </Badge>
                <Badge variant="secondary">{review.intervalDays} dia(s)</Badge>
              </div>
              <p className="font-semibold text-slate-950">{review.mission.title}</p>
              <p className="text-sm text-slate-600">
                {review.mission.module.track.title} · {review.mission.module.title}
              </p>
              {review.skill ? <p className="text-sm text-slate-500">{review.skill.name}</p> : null}
              <p className="text-xs font-medium text-slate-500">
                Vence em {review.dueAt.toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/app/missoes/${review.mission.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Revisar
              </Link>
              <form action={completeReviewAction}>
                <input type="hidden" name="reviewId" value={review.id} />
                <Button type="submit" variant="secondary">
                  Marcar feita
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
