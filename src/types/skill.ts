export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  group: string;
  plugin?: string;
  path: string;
  excerpt: string;
}
