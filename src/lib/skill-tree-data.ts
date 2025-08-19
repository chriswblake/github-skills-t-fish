import type { Exercise, Path, SkillTreeNode } from '../lib/types';

// Create skill tree data directly from exercises and paths with embedded mapping
export function createSkillTreeData(exercises: Exercise[], paths: Path[]): SkillTreeNode[] {
  const pathMap = new Map(paths.map(path => [path.slug, path]));
  
  // First pass: create nodes without calculated positions
  const nodes: SkillTreeNode[] = exercises.map((exercise, index) => {
    const pathSlug = exercise.pathSlug || 'fundamentals';
    const dependencies = exercise.dependencies || [];
    
    const path = pathMap.get(pathSlug) || paths[0] || { 
      slug: 'fundamentals', 
      name: 'Fundamentals', 
      description: 'Basic skills',
      color: '#0969da'
    };
    
    return {
      exercise,
      path,
      position: { x: 0, y: 0 }, // Will be calculated below
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

  // Calculate positions relative to dependencies
  const positionedNodes = new Set<string>();
  const nodeMap = new Map(nodes.map(node => [node.exercise.slug, node]));

  const calculatePosition = (node: SkillTreeNode): void => {
    if (positionedNodes.has(node.exercise.slug)) return;

    // If exercise has explicit position, use it (backwards compatibility)
    if (node.exercise.position) {
      node.position = node.exercise.position;
      positionedNodes.add(node.exercise.slug);
      return;
    }

    // If no dependencies, position at origin (0, 0)
    if (node.dependencies.length === 0) {
      node.position = { x: 0, y: 0 };
      positionedNodes.add(node.exercise.slug);
      return;
    }

    // Ensure all dependencies are positioned first
    for (const depSlug of node.dependencies) {
      const depNode = nodeMap.get(depSlug);
      if (depNode && !positionedNodes.has(depSlug)) {
        calculatePosition(depNode);
      }
    }

    // Find the last dependency (rightmost/bottommost position)
    let lastDepPosition = { x: 0, y: 0 };
    for (const depSlug of node.dependencies) {
      const depNode = nodeMap.get(depSlug);
      if (depNode) {
        // Choose the dependency with the highest x + y value as the "last" one
        const depTotal = depNode.position.x + depNode.position.y;
        const lastTotal = lastDepPosition.x + lastDepPosition.y;
        if (depTotal > lastTotal) {
          lastDepPosition = depNode.position;
        }
      }
    }

    // Position relative to the last dependency
    // Add some offset to avoid overlapping
    const offsetX = 150; // Horizontal spacing between levels
    const offsetY = 100; // Vertical spacing for branching
    
    // Find which dependency is the "last" one we're positioning relative to
    let lastDepNode: SkillTreeNode | undefined;
    for (const depSlug of node.dependencies) {
      const depNode = nodeMap.get(depSlug);
      if (depNode && (depNode.position.x === lastDepPosition.x && depNode.position.y === lastDepPosition.y)) {
        lastDepNode = depNode;
        break;
      }
    }
    
    // Calculate vertical offset based on how many dependents the last dependency has
    const dependentIndex = lastDepNode ? lastDepNode.dependents.indexOf(node.exercise.slug) : 0;
    
    node.position = {
      x: lastDepPosition.x + offsetX,
      y: lastDepPosition.y + (dependentIndex * offsetY)
    };

    positionedNodes.add(node.exercise.slug);
  };

  // Calculate positions for all nodes
  nodes.forEach(calculatePosition);

  return nodes;
}