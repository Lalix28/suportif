import { Badge } from "@/components/ui/badge";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { ReviewList } from "@/components/reviews/review-list";
import { requireRole } from "@/lib/auth/session";
import { getStudentReviews } from "@/server/queries/student";

export const dynamic = "force-dynamic";

export default async function StudentReviewsPage() {
  const user = await requireRole(["STUDENT"]);
  const reviews = await getStudentReviews(user.id);

  return (
    <ProtectedShell user={user}>
      <div className="space-y-6">
        <section>
          <Badge variant="secondary">Revisão espaçada simples</Badge>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Revisões que merecem atenção</h1>
          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            Retome missões no momento certo e mantenha seu progresso atualizado.
          </p>
        </section>
        <ReviewList reviews={reviews} />
      </div>
    </ProtectedShell>
  );
}
