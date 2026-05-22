import { uiStrings } from "@/i18n/translations";
import type { Locale } from "@/types/workflow";

interface Props {
  originalLocale: Locale;
  resolvedLocale: Locale;
}

export function TranslationBanner({ originalLocale, resolvedLocale }: Props) {
  if (originalLocale === resolvedLocale) return null;
  const key = resolvedLocale === "vi" ? "fromEn" : "fromVi";
  const message = uiStrings.translationBanner[key][originalLocale];
  return (
    <div
      role="status"
      className="mb-6 rounded-[var(--radius-md)] border border-warning/40 bg-warning-subtle p-4 text-sm text-warning"
    >
      {message}
    </div>
  );
}
