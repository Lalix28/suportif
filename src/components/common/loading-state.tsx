import { Card, CardContent } from "@/components/ui/card";

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <Card className="border-emerald-100 bg-white">
      <CardContent className="p-6">
        <div className="h-2 w-36 animate-pulse rounded-full bg-emerald-200" />
        <p className="mt-4 text-sm text-slate-600">{label}</p>
      </CardContent>
    </Card>
  );
}
