import React, { useState, useMemo } from 'react';
import { SkillNode } from './SkillNode';
import { SkillPath } from './SkillPath';
import { ExerciseDetails } from './ExerciseDetails';
import { createSkillTreeData } from '../lib/skill-tree-data';
import type { SkillTreeNode } from '../lib/types';

interface SkillsTreeProps {
  exercises: any[];
  paths: any[];
}

export function SkillsTree({ exercises, paths }: SkillsTreeProps) {
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SkillTreeNode | null>(null);

  const skillTreeNodes = useMemo(() => 
    createSkillTreeData(exercises, paths), 
    [exercises, paths]
  );

  const handleNodeClick = (node: SkillTreeNode) => {
    setSelectedNode(node === selectedNode ? null : node);
  };

  const handleNodeHover = (node: SkillTreeNode | null) => {
    setHoveredNode(node);
  };

  // Calculate SVG dimensions based on node positions
  const svgDimensions = useMemo(() => {
    const positions = skillTreeNodes.map(node => node.position);
    const maxX = Math.max(...positions.map(p => p.x)) + 100;
    const maxY = Math.max(...positions.map(p => p.y)) + 100;
    return { width: Math.max(maxX, 1400), height: Math.max(maxY, 1200) };
  }, [skillTreeNodes]);

  return (
    <div className="relative w-full h-screen overflow-auto bg-background">
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="absolute top-0 left-0"
        style={{ minWidth: '100%', minHeight: '100vh' }}
      >
        {/* Render skill paths */}
        <g className="skill-paths">
          {skillTreeNodes.map(node =>
            node.dependencies.map(depSlug => {
              const depNode = skillTreeNodes.find(n => n.exercise.slug === depSlug);
              if (!depNode) return null;
              
              return (
                <SkillPath
                  key={`${depSlug}-${node.exercise.slug}`}
                  from={depNode.position}
                  to={node.position}
                  color={node.path.color}
                  isHighlighted={hoveredNode === node || hoveredNode === depNode}
                />
              );
            })
          )}
        </g>

        {/* Render skill nodes */}
        <g className="skill-nodes">
          {skillTreeNodes.map(node => (
            <SkillNode
              key={node.exercise.slug}
              node={node}
              isSelected={selectedNode === node}
              isHighlighted={hoveredNode === node}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => handleNodeHover(node)}
              onMouseLeave={() => handleNodeHover(null)}
            />
          ))}
        </g>
      </svg>

      {/* Exercise details panel */}
      {(selectedNode || hoveredNode) && (
        <ExerciseDetails
          node={selectedNode || hoveredNode!}
          isSelected={!!selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}