import type { Exercise, Path, SkillTreeNode } from '../lib/types';

// Create skill tree data directly from exercises and paths with embedded mapping
export function createSkillTreeData(exercises: Exercise[], paths: Path[]): SkillTreeNode[] {
  const pathMap = new Map(paths.map(path => [path.slug, path]));
  
  const nodes: SkillTreeNode[] = exercises.map((exercise, index) => {
    // Handle exercises that may not have been updated with the new fields yet
    const pathSlug = exercise.pathSlug || 'fundamentals';
    const dependencies = exercise.dependencies || [];
    const position = exercise.position || { 
      // Use a grid layout for exercises without positions
      x: 200 + (index % 6) * 150,
      y: 200 + Math.floor(index / 6) * 150
    };
    
    const path = pathMap.get(pathSlug) || paths[0] || { 
      slug: 'fundamentals', 
      name: 'Fundamentals', 
      description: 'Basic skills',
      color: '#0969da'
    };
    
    return {
      exercise,
      path,
      position,
      dependencies,
      dependents: [] // Will be calculated below
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