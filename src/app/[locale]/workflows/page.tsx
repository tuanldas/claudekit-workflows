import { Suspense } from "react";
import { WorkflowsPageContent } from "@/components/workflows/workflows-page-content";

export default function WorkflowsPage() {
  return (
    <Suspense fallback={null}>
      <WorkflowsPageContent />
    </Suspense>
  );
}
