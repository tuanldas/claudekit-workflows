import type { ReactNode } from "react";
import { PageShell } from "./page-shell";
import { PageHeader } from "./page-header";
import { PageToolbar } from "./page-toolbar";
import { CatalogGrid } from "./catalog-grid";
import { EmptyState } from "./empty-state";

interface Props {
  /** PageHeader props — required title + optional eyebrow/description/actions. */
  title: string;
  description?: string;
  eyebrow?: string;
  headerActions?: ReactNode;
  /** Toolbar slots. */
  search?: ReactNode;
  filter?: ReactNode;
  count?: ReactNode;
  /** Catalog grid contents — cards. Rendered when `isEmpty` is false. */
  children: ReactNode;
  /** When true, replace grid with EmptyState. */
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  /** Grid density — see CatalogGrid props. */
  gridDensity?: "cards" | "tight";
}

export function CatalogTemplate({
  title,
  description,
  eyebrow,
  headerActions,
  search,
  filter,
  count,
  children,
  isEmpty,
  emptyMessage,
  emptyAction,
  gridDensity = "cards",
}: Props) {
  return (
    <PageShell>
      <PageHeader
        title={title}
        description={description}
        eyebrow={eyebrow}
        actions={headerActions}
      />
      <PageToolbar search={search} filter={filter} count={count} />
      {isEmpty ? (
        <EmptyState message={emptyMessage ?? ""} action={emptyAction} />
      ) : (
        <CatalogGrid density={gridDensity}>{children}</CatalogGrid>
      )}
    </PageShell>
  );
}
