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
  // Project light-only hiện tại; dark mode out of scope. Khi scope dark mode,
  // change colorScheme: "light dark" + add 2 themeColor entries.
  colorScheme: "light",
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
