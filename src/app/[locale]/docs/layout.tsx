interface Props {
  children: React.ReactNode;
}

// Shell (PageShell + FloatingToc) is owned by DocsTemplate, applied per page so
// page-level data (e.g. TranslationBanner fallback) can flow into template slots.
export default function DocsLayout({ children }: Props) {
  return <>{children}</>;
}
