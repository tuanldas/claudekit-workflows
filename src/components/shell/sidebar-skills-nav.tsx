import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function SidebarSkillsNav({ locale }: { locale: Locale }) {
  return (
    <div className="px-4 text-sm text-gray-500" aria-label="Skills nav stub">
      {uiStrings.nav.skillsStub[locale]}
    </div>
  );
}
