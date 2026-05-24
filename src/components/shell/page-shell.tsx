import type { ReactNode } from "react";
import { DocsToc } from "@/components/docs/docs-toc";

interface Props {
  children: ReactNode;
  /**
   * When true, content shares the shell with a sticky right-side TOC at `xl:`
   * breakpoint (≥1280px). Content column shrinks to leave room; below `xl:` the
   * TOC is hidden and content fills the shell width.
   */
  withToc?: boolean;
}

const WRAPPER_CLASS = "relative px-6 py-8 lg:px-8";

export function PageShell({ children, withToc = false }: Props) {
  if (!withToc) {
    return <div className={WRAPPER_CLASS}>{children}</div>;
  }

  return (
    <div className={WRAPPER_CLASS}>
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-8">
        <div className="min-w-0">{children}</div>
        <aside
          role="complementary"
          aria-label="On this page"
          className="hidden xl:block"
        >
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pt-2">
            <DocsToc />
          </div>
        </aside>
      </div>
    </div>
  );
}
