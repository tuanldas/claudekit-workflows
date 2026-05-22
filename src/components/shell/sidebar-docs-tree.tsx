import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function SidebarDocsTree({ locale }: { locale: Locale }) {
  return (
    <div className="px-4 text-sm text-gray-500" aria-label="Docs nav stub">
      {uiStrings.nav.docsStub[locale]}
    </div>
  );
}
