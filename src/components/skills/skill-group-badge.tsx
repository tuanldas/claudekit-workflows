import { Badge } from "@/components/ui";

export function SkillGroupBadge({ group }: { group: string }) {
  return (
    <Badge variant="outline" size="sm">
      {group}
    </Badge>
  );
}
