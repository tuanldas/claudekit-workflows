import { Badge, type BadgeProps } from "@/components/ui";

const PLUGIN_VARIANT: Record<string, BadgeProps["variant"]> = {
  ck: "accent",
  ckm: "accent",
  "anthropic-skills": "outline",
  gstack: "success",
};

export function SkillPluginBadge({ plugin }: { plugin: string }) {
  const variant = PLUGIN_VARIANT[plugin] ?? "default";
  return (
    <Badge variant={variant} size="sm" className="font-mono lowercase">
      {plugin}
    </Badge>
  );
}
