import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/dashboard/progress-bar";

type ModuleNodeProps = {
  id: string;
  title: string;
  description: string;
  order: number;
  progressPercent: number;
  completedMissions: number;
  totalMissions: number;
  children: React.ReactNode;
};

export function ModuleNode({
  id,
  title,
  description,
  order,
  progressPercent,
  completedMissions,
  totalMissions,
  children
}: ModuleNodeProps) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-8 h-full w-px bg-emerald-100" />
      <div className="absolute left-[-11px] top-7 flex h-6 w-6 items-center justify-center rounded-full border-4 border-slate-50 bg-emerald-700 text-[11px] font-bold text-white shadow-sm">
        {order}
      </div>
      <Card className="overflow-hidden bg-white">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-emerald-700">Etapa {order}</p>
              <CardTitle className="mt-1">{title}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
            <Badge variant={progressPercent === 100 ? "default" : "outline"}>
              {completedMissions}/{totalMissions} missões
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar value={progressPercent} label="Progresso do módulo" />
          <Link
            href={`/app/modulos/${id}`}
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
          >
            Ver módulo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <div className="grid gap-3 pt-1">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}
