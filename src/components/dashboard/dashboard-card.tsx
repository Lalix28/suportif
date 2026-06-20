import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
};

export function DashboardCard({ title, value, description, className }: DashboardCardProps) {
  return (
    <Card className={cn("h-full border-slate-200 bg-white/95", className)}>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-black text-emerald-800">{value}</p>
        {description ? <p className="mt-2 text-sm leading-5 text-slate-600">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
