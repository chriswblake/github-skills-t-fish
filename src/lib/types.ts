export interface Exercise {
  slug: string;
  status: 'active' | 'scheduled' | 'tentative';
  name: string;
  icon: string;
  description: string;
  repositoryUrl: string;
  issueUrl: string;
}

export interface Path {
  slug: string;
  name: string;
  description: string;
  color: string;
}

export interface SkillTreeNode {
  exercise: Exercise;
  path: Path;
  position: { x: number; y: number };
  dependencies: string[]; // slugs of exercises this depends on
  dependents: string[]; // slugs of exercises that depend on this
}