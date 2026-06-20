import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { TrackCard } from "@/components/tracks/track-card";
import { requireRole } from "@/lib/auth/session";
import { startTrackAction } from "@/server/actions/student";
import { getStudentTracksPage } from "@/server/queries/student";

export const dynamic = "force-dynamic";

export default async function StudentTracksPage() {
  const user = await requireRole(["STUDENT"]);
  const { enrolledTracks, availableTracks } = await getStudentTracksPage(user.id);

  return (
    <ProtectedShell user={user}>
      <div className="space-y-8">
        <section>
          <Badge variant="secondary">Trilhas salvas no banco</Badge>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Minhas trilhas</h1>
          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            Continue o que já começou ou escolha uma nova trilha pública demonstrativa para estudar em etapas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950">Em andamento</h2>
          {enrolledTracks.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {enrolledTracks.map(({ enrollment, summary }) => (
                <TrackCard
                  key={enrollment.id}
                  title={summary.title}
                  description={summary.description}
                  area={summary.area}
                  icon={summary.coverIcon}
                  progressPercent={summary.progressPercent}
                  completedMissions={summary.completedMissions}
                  totalMissions={summary.totalMissions}
                  href={`/app/trilhas/${summary.slug}`}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-slate-600">
                Você ainda não iniciou nenhuma trilha. Escolha uma opção pública abaixo para começar.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950">Trilhas públicas disponíveis</h2>
          {availableTracks.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {availableTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  title={track.title}
                  description={track.description}
                  area={track.area}
                  icon={track.coverIcon}
                  progressPercent={track.progressPercent}
                  completedMissions={track.completedMissions}
                  totalMissions={track.totalMissions}
                  action={
                    <form action={startTrackAction}>
                      <input type="hidden" name="trackId" value={track.id} />
                      <Button type="submit" variant="secondary">
                        Iniciar jornada
                      </Button>
                    </form>
                  }
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-slate-600">
                Todas as trilhas públicas já estão vinculadas à sua conta.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </ProtectedShell>
  );
}
