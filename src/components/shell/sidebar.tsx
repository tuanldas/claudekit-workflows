"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";
import { SidebarHeader } from "./sidebar-header";
import { SidebarWorkflowsNav } from "./sidebar-workflows-nav";
import { SidebarDocsTree } from "./sidebar-docs-tree";
import { SidebarSkillsNav } from "./sidebar-skills-nav";

interface Props {
  locale: Locale;
  variant?: "desktop" | "drawer";
}

export function Sidebar({ locale, variant = "desktop" }: Props) {
  const pathname = usePathname() ?? "";
  const onWorkflows = pathname.startsWith(`/${locale}/workflows`);
  const onDocs = pathname.startsWith(`/${locale}/docs`);
  const onSkills = pathname.startsWith(`/${locale}/skills`);

  const isDrawer = variant === "drawer";
  const containerClass = isDrawer
    ? "flex h-full w-full flex-col bg-white"
    : "hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex";

  return (
    <nav aria-label="Sidebar" className={containerClass}>
      <SidebarHeader locale={locale} />
      <div className="flex-1 overflow-y-auto py-4">
        {onWorkflows && <SidebarWorkflowsNav locale={locale} />}
        {onDocs && <SidebarDocsTree locale={locale} />}
        {onSkills && <SidebarSkillsNav locale={locale} />}
      </div>
    </nav>
  );
}
