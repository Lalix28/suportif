import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/dashboard/progress-bar";

type TrackCardProps = {
  title: string;
  description: string;
  area: string;
  icon: string;
  progressPercent: number;
  completedMissions: number;
  totalMissions: number;
  href?: string;
  action?: React.ReactNode;
};

export function TrackCard({
  title,
  description,
  area,
  icon,
  progressPercent,
  completedMissions,
  totalMissions,
  href,
  action
}: TrackCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-sm text-emerald-800">{icon}</span>
            {title}
          </CardTitle>
          <Badge variant="outline">{area}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <ProgressBar
          value={progressPercent}
          label={`${completedMissions}/${totalMissions} missões concluídas`}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          {href ? (
            <Link
              href={href}
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Continuar
            </Link>
          ) : null}
          {action}
        </div>
      </CardContent>
    </Card>
  );
}
