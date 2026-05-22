import { notFound } from "next/navigation";
import { LanguageProvider } from "@/i18n/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AdminShell } from "@/components/shell/admin-shell";
import { LOCALES } from "@/lib/locale-routing";
import type { Locale } from "@/types/workflow";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();

  return (
    <LanguageProvider locale={locale as Locale}>
      <ThemeProvider>
        <AdminShell>{children}</AdminShell>
      </ThemeProvider>
    </LanguageProvider>
  );
}
