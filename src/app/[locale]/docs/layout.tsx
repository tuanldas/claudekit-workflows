import { FloatingToc } from "@/components/shell/floating-toc";

interface Props {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: Props) {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-8 2xl:mx-0 2xl:max-w-none 2xl:pr-72">
      {children}
      <FloatingToc />
    </div>
  );
}
