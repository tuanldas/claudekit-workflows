import { FloatingToc } from "@/components/shell/floating-toc";
import { PageShell } from "@/components/shell/page-shell";

interface Props {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: Props) {
  return (
    <PageShell withToc>
      {children}
      <FloatingToc />
    </PageShell>
  );
}
