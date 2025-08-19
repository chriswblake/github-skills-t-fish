import type { Exercise, Path, SkillTreeNode } from '../lib/types';

// Create skill tree data directly from exercises and paths with embedded mapping
export function createSkillTreeData(exercises: Exercise[], paths: Path[]): SkillTreeNode[] {
  const pathMap = new Map(paths.map(path => [path.slug, path]));
  
  const nodes: SkillTreeNode[] = exercises.map(exercise => {
    // Handle exercises that may not have been updated with the new fields yet
    const pathSlug = exercise.pathSlug || 'fundamentals';
    const dependencies = exercise.dependencies || [];
    const position = exercise.position || { 
      x: Math.floor(Math.random() * 800) + 100, 
      y: Math.floor(Math.random() * 400) + 100 
    };
    
    const path = pathMap.get(pathSlug) || paths[0];
    
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