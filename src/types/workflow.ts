export type Locale = "vi" | "en";

export type LocalizedString = { vi: string; en: string };

export type WorkflowLevel = "beginner" | "intermediate" | "advanced";

export type WorkflowCategory =
  | "all"
  | "advanced-pipelines"
  | "getting-started"
  | "design-frontend"
  | "debugging-fixes"
  | "planning-review"
  | "research-docs"
  | "shipping"
  | "backend-infra"
  | "media-creative"
  | "marketing";

export interface WorkflowStep {
  command: string;
  label: LocalizedString;
}

export interface WorkflowPhase {
  name: LocalizedString;
  duration: string;
  steps: WorkflowPhaseStep[];
}

export interface WorkflowPhaseStep {
  command: string;
  description: LocalizedString;
  optional?: boolean;
  alternative?: LocalizedString;
}

export interface Workflow {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  level: WorkflowLevel;
  duration: string;
  category: WorkflowCategory;
  steps: WorkflowStep[];
  phases: WorkflowPhase[];
  tips?: LocalizedString[];
  shortcut?: LocalizedString;
}
