import { Badge } from "@/components/ui/badge";

export function XPBadge({ xp }: { xp: number }) {
  return <Badge variant="secondary">{xp} XP</Badge>;
}
