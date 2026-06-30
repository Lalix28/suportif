import { Trophy } from "lucide-react";

export function LevelBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
      <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
      Nível {level}
    </span>
  );
}
