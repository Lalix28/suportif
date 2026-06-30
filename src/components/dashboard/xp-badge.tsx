import { Zap } from "lucide-react";

export function XPBadge({ xp }: { xp: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
      <Zap className="h-3.5 w-3.5" aria-hidden="true" />
      {xp.toLocaleString("pt-BR")} XP
    </span>
  );
}
