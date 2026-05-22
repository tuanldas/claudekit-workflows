"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";
import type { DocsTree } from "@/types/docs";
import { SidebarHeader } from "./sidebar-header";
import { SidebarWorkflowsNav } from "./sidebar-workflows-nav";
import { SidebarDocsTree } from "./sidebar-docs-tree";
import { SidebarSkillsNav } from "./sidebar-skills-nav";

interface Props {
  locale: Locale;
  /** Pre-fetched docs tree (server-built). Null on non-docs routes. */
  docsTree?: DocsTree | null;
}

export function Sidebar({ locale, docsTree = null }: Props) {
  const pathname = usePathname() ?? "";
  const onWorkflows = pathname.startsWith(`/${locale}/workflows`);
  const onDocs = pathname.startsWith(`/${locale}/docs`);
  const onSkills = pathname.startsWith(`/${locale}/skills`);

  return (
    <nav
      aria-label="Sidebar"
      className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex"
    >
      <SidebarHeader locale={locale} />
      <div className="flex-1 overflow-y-auto py-4">
        {onWorkflows && <SidebarWorkflowsNav locale={locale} />}
        {onDocs && <SidebarDocsTree locale={locale} tree={docsTree} />}
        {onSkills && <SidebarSkillsNav locale={locale} />}
      </div>
    </nav>
  );
}
