import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { TrackMap } from "@/components/tracks/track-map";
import { requireRole } from "@/lib/auth/session";
import { startTrackAction } from "@/server/actions/student";
import { getTrackMap } from "@/server/queries/student";

export const dynamic = "force-dynamic";

export default async function TrackMapPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireRole(["STUDENT"]);
  const { slug } = await params;
  const trackMap = await getTrackMap(user.id, slug);

  if (!trackMap) {
    notFound();
  }

  const { enrollment, summary } = trackMap;

  return (
    <ProtectedShell user={user}>
      <div className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{summary.area}</Badge>
              <Badge variant="outline">{summary.isDemo ? "Demonstrativa" : "Conteúdo cadastrado"}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-black text-slate-950">{summary.title}</h1>
            <p className="mt-2 max-w-3xl leading-7 text-slate-600">{summary.description}</p>
          </div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Progresso da trilha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                value={summary.progressPercent}
                label={`${summary.completedMissions}/${summary.totalMissions} missões`}
              />
              {enrollment ? (
                <Badge>Matriculado</Badge>
              ) : (
                <form action={startTrackAction}>
                  <input type="hidden" name="trackId" value={summary.id} />
                  <Button type="submit">Iniciar jornada</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>

        {summary.nextMission ? (
          <Card className="border-emerald-100 bg-emerald-50">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-800">Próxima missão recomendada</p>
                <h2 className="mt-1 text-xl font-bold text-emerald-950">{summary.nextMission.title}</h2>
                <p className="mt-1 text-sm text-emerald-900">{summary.nextMission.moduleTitle}</p>
              </div>
              <Link
                href={`/app/missoes/${summary.nextMission.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition-colors hover:bg-emerald-800"
              >
                Continuar estudando
              </Link>
            </CardContent>
          </Card>
        ) : null}

        <TrackMap modules={summary.modules} />
      </div>
    </ProtectedShell>
  );
}
