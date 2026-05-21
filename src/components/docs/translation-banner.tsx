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
      className="mb-6 border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-800"
    >
      {message}
    </div>
  );
}
