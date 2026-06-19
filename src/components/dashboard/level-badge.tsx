import { Badge } from "@/components/ui/badge";

export function LevelBadge({ level }: { level: number }) {
  return <Badge>Nível {level}</Badge>;
}
