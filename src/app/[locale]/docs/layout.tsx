import { FloatingToc } from "@/components/shell/floating-toc";
import { PageShell } from "@/components/shell/page-shell";

interface Props {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: Props) {
  return (
    <PageShell withToc>
      <div className="max-w-3xl">{children}</div>
      <FloatingToc />
    </PageShell>
  );
}
