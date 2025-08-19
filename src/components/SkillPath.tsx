import React from 'react';

interface SkillPathProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  isHighlighted: boolean;
}

export function SkillPath({ from, to, color, isHighlighted }: SkillPathProps) {
  // Create path using only vertical and horizontal lines
  const createPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Use L-shaped paths for clean, geometric connections
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal then vertical
      const midX = start.x + dx * 0.6;
      return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
    } else {
      // Vertical then horizontal  
      const midY = start.y + dy * 0.6;
      return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
    }
  };

  const pathData = createPath(from, to);
  const strokeWidth = isHighlighted ? 3 : 2;
  const opacity = isHighlighted ? 0.9 : 0.6;

  return (
    <g className="skill-path">
      {/* Background path for glow effect */}
      {isHighlighted && (
        <path
          d={pathData}
          stroke={color}
          strokeWidth={strokeWidth + 4}
          fill="none"
          opacity={0.3}
          style={{
            filter: `blur(2px)`
          }}
        />
      )}
      
      {/* Main path with arrow marker */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#arrow-${color.replace('#', '')})`}
        style={{
          transition: 'all 0.3s ease',
        }}
      />
    </g>
  );
}