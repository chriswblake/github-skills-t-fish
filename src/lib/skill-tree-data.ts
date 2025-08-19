import type { Exercise, Path, SkillTreeNode } from '../lib/types';

// Define the skill tree structure with dependencies
export function createSkillTreeData(exercises: Exercise[], paths: Path[]): SkillTreeNode[] {
  const pathMap = new Map(paths.map(path => [path.slug, path]));
  
  // Define exercise-to-path mappings and dependencies
  const exerciseMapping: Record<string, { pathSlug: string; dependencies: string[]; position: { x: number; y: number } }> = {
    // Fundamentals path - starting point
    'hello-github': { pathSlug: 'fundamentals', dependencies: [], position: { x: 400, y: 100 } },
    'git-basics': { pathSlug: 'fundamentals', dependencies: ['hello-github'], position: { x: 400, y: 200 } },
    'markdown-portfolio': { pathSlug: 'fundamentals', dependencies: ['git-basics'], position: { x: 300, y: 300 } },
    'github-pages': { pathSlug: 'fundamentals', dependencies: ['markdown-portfolio'], position: { x: 500, y: 300 } },
    'profile-readme': { pathSlug: 'fundamentals', dependencies: ['markdown-portfolio'], position: { x: 200, y: 400 } },
    
    // Collaboration path
    'fork-and-clone': { pathSlug: 'collaboration', dependencies: ['git-basics'], position: { x: 600, y: 200 } },
    'pull-requests': { pathSlug: 'collaboration', dependencies: ['fork-and-clone'], position: { x: 700, y: 300 } },
    'merge-conflicts': { pathSlug: 'collaboration', dependencies: ['pull-requests'], position: { x: 800, y: 400 } },
    'code-review': { pathSlug: 'collaboration', dependencies: ['pull-requests'], position: { x: 600, y: 400 } },
    'team-management': { pathSlug: 'collaboration', dependencies: ['code-review'], position: { x: 700, y: 500 } },
    'organizations': { pathSlug: 'collaboration', dependencies: ['team-management'], position: { x: 800, y: 600 } },
    
    // Project Management path  
    'github-issues': { pathSlug: 'project-management', dependencies: ['git-basics'], position: { x: 100, y: 300 } },
    'issue-templates': { pathSlug: 'project-management', dependencies: ['github-issues'], position: { x: 100, y: 400 } },
    'github-projects': { pathSlug: 'project-management', dependencies: ['github-issues'], position: { x: 200, y: 500 } },
    'project-automation': { pathSlug: 'project-management', dependencies: ['github-projects'], position: { x: 300, y: 600 } },
    'discussions': { pathSlug: 'project-management', dependencies: ['github-issues'], position: { x: 100, y: 600 } },
    
    // Automation path
    'github-actions-intro': { pathSlug: 'automation', dependencies: ['pull-requests'], position: { x: 900, y: 300 } },
    'continuous-integration': { pathSlug: 'automation', dependencies: ['github-actions-intro'], position: { x: 1000, y: 400 } },
    'javascript-action': { pathSlug: 'automation', dependencies: ['continuous-integration'], position: { x: 900, y: 500 } },
    'docker-container-action': { pathSlug: 'automation', dependencies: ['continuous-integration'], position: { x: 1100, y: 500 } },
    'reusable-workflows': { pathSlug: 'automation', dependencies: ['javascript-action', 'docker-container-action'], position: { x: 1000, y: 600 } },
    'deployment-strategies': { pathSlug: 'automation', dependencies: ['reusable-workflows'], position: { x: 1100, y: 700 } },
    'release-based-workflow': { pathSlug: 'automation', dependencies: ['github-actions-intro'], position: { x: 800, y: 500 } },
    'package-publishing': { pathSlug: 'automation', dependencies: ['release-based-workflow'], position: { x: 700, y: 600 } },
    'monitoring-observability': { pathSlug: 'automation', dependencies: ['deployment-strategies'], position: { x: 1200, y: 800 } },
    
    // Security path
    'code-security': { pathSlug: 'security', dependencies: ['git-basics'], position: { x: 400, y: 500 } },
    'dependabot': { pathSlug: 'security', dependencies: ['code-security'], position: { x: 300, y: 700 } },
    'codeql': { pathSlug: 'security', dependencies: ['code-security'], position: { x: 500, y: 700 } },
    'secret-scanning': { pathSlug: 'security', dependencies: ['code-security'], position: { x: 400, y: 800 } },
    'advanced-security': { pathSlug: 'security', dependencies: ['codeql', 'secret-scanning'], position: { x: 500, y: 900 } },
    'branch-protection': { pathSlug: 'security', dependencies: ['pull-requests'], position: { x: 600, y: 600 } },
    'license-compliance': { pathSlug: 'security', dependencies: ['advanced-security'], position: { x: 400, y: 1000 } },
    
    // AI Productivity path
    'github-copilot': { pathSlug: 'ai-productivity', dependencies: ['git-basics'], position: { x: 200, y: 200 } },
    'copilot-chat': { pathSlug: 'ai-productivity', dependencies: ['github-copilot'], position: { x: 100, y: 300 } },
    'copilot-customization': { pathSlug: 'ai-productivity', dependencies: ['copilot-chat'], position: { x: 100, y: 400 } },
    'codespaces': { pathSlug: 'ai-productivity', dependencies: ['github-copilot'], position: { x: 300, y: 400 } },
    
    // Advanced/Integration exercises
    'advanced-git': { pathSlug: 'collaboration', dependencies: ['merge-conflicts'], position: { x: 900, y: 500 } },
    'github-cli': { pathSlug: 'fundamentals', dependencies: ['git-basics'], position: { x: 500, y: 400 } },
    'api-integration': { pathSlug: 'automation', dependencies: ['github-actions-intro'], position: { x: 800, y: 600 } },
    'webhooks': { pathSlug: 'automation', dependencies: ['api-integration'], position: { x: 900, y: 700 } },
    'github-apps': { pathSlug: 'automation', dependencies: ['webhooks'], position: { x: 1000, y: 800 } },
    'github-mobile': { pathSlug: 'fundamentals', dependencies: ['profile-readme'], position: { x: 200, y: 600 } },
    'repository-templates': { pathSlug: 'collaboration', dependencies: ['organizations'], position: { x: 900, y: 700 } },
    'repository-insights': { pathSlug: 'project-management', dependencies: ['github-projects'], position: { x: 400, y: 700 } },
    'wiki-collaboration': { pathSlug: 'collaboration', dependencies: ['markdown-portfolio'], position: { x: 200, y: 800 } },
    'community-standards': { pathSlug: 'collaboration', dependencies: ['organizations'], position: { x: 700, y: 700 } },
    'enterprise-administration': { pathSlug: 'security', dependencies: ['advanced-security', 'team-management'], position: { x: 600, y: 1000 } },
    'github-sponsors': { pathSlug: 'fundamentals', dependencies: ['profile-readme'], position: { x: 100, y: 500 } },
    'migration-tools': { pathSlug: 'fundamentals', dependencies: ['advanced-git'], position: { x: 1000, y: 600 } },
    'accessibility-testing': { pathSlug: 'automation', dependencies: ['continuous-integration'], position: { x: 1200, y: 500 } },
  };

  const nodes: SkillTreeNode[] = exercises.map(exercise => {
    const mapping = exerciseMapping[exercise.slug];
    if (!mapping) {
      // Fallback for exercises not explicitly mapped
      return {
        exercise,
        path: pathMap.get('fundamentals') || paths[0],
        position: { x: Math.random() * 800 + 100, y: Math.random() * 400 + 100 },
        dependencies: [],
        dependents: []
      };
    }

    const path = pathMap.get(mapping.pathSlug) || paths[0];
    return {
      exercise,
      path,
      position: mapping.position,
      dependencies: mapping.dependencies,
      dependents: []
    };
  });

  // Calculate dependents (reverse dependencies)
  nodes.forEach(node => {
    node.dependencies.forEach(depSlug => {
      const depNode = nodes.find(n => n.exercise.slug === depSlug);
      if (depNode) {
        depNode.dependents.push(node.exercise.slug);
      }
    });
  });

  return nodes;
}