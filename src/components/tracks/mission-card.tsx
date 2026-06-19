import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MissionCardProps = {
  id: string;
  title: string;
  description: string;
  masteryStatus: string;
  completed: boolean;
  attemptsCount: number;
  correctCount: number;
  exerciseCount: number;
};

export function MissionCard({
  id,
  title,
  description,
  masteryStatus,
  completed,
  attemptsCount,
  correctCount,
  exerciseCount
}: MissionCardProps) {
  return (
    <Card className={cn("border-l-4", completed ? "border-l-emerald-600" : "border-l-slate-200")}>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{title}</p>
            <Badge variant={completed ? "default" : "outline"}>{masteryStatus}</Badge>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
          <p className="text-xs font-medium text-slate-500">
            {correctCount}/{exerciseCount} acertos únicos · {attemptsCount} tentativas
          </p>
        </div>
        <Link
          href={`/app/missoes/${id}`}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
        >
          Abrir missão
        </Link>
      </CardContent>
    </Card>
  );
}
