import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaudeKit Workflows",
  description: "Học ClaudeKit qua workflows trực quan, tương tác được",
};

export const viewport: Viewport = {
  // Project light-only hiện tại; dark mode out of scope. "only light" (strict
  // opt-out) ngăn Chrome force-dark / macOS auto-darken invert background mà
  // không invert shiki's inline foreground colors → dark bg + dark text issue.
  // Khi scope dark mode lại: colorScheme "light dark" + 2 themeColor entries.
  colorScheme: "only light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang attribute is generic; [locale]/layout.tsx sẽ wrap content với LanguageProvider
  // và truyền locale chính xác xuống. Trang root `/` chỉ redirect → /vi.
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
