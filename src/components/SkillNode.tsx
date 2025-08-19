import React from 'react';
import * as Octicons from '@primer/octicons-react';
import type { SkillTreeNode } from '../lib/types';

interface SkillNodeProps {
  node: SkillTreeNode;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Map exercise icons to Octicon components with fallbacks
const iconMap: Record<string, React.ComponentType<any>> = {
  'mark-github': Octicons.MarkGithubIcon,
  'git-branch': Octicons.GitBranchIcon,
  'markdown': Octicons.MarkdownIcon,
  'browser': Octicons.BrowserIcon,
  'git-pull-request': Octicons.GitPullRequestIcon,
  'git-merge': Octicons.GitMergeIcon,
  'workflow': Octicons.WorkflowIcon,
  'tag': Octicons.TagIcon,
  'issue-opened': Octicons.IssueOpenedIcon,
  'project': Octicons.ProjectIcon,
  'shield': Octicons.ShieldIcon,
  'dependabot': Octicons.DependabotIcon,
  'search': Octicons.SearchIcon,
  'copilot': Octicons.CopilotIcon,
  'codespaces': Octicons.CodespacesIcon,
  'shield-lock': Octicons.ShieldLockIcon,
  'organization': Octicons.OrganizationIcon,
  'repo-forked': Octicons.RepoForkedIcon,
  'terminal': Octicons.TerminalIcon,
  'key': Octicons.KeyIcon,
  'person': Octicons.PersonIcon,
  'book': Octicons.BookIcon,
  'repo-template': Octicons.RepoTemplateIcon,
  'check': Octicons.CheckIcon,
  'package': Octicons.PackageIcon,
  'container': Octicons.ContainerIcon,
  'code': Octicons.CodeIcon,
  'comment-discussion': Octicons.CommentDiscussionIcon,
  'shield-check': Octicons.ShieldCheckIcon,
  'issue-draft': Octicons.IssueDraftIcon,
  'device-mobile': Octicons.DeviceMobileIcon,
  'plug': Octicons.PlugIcon,
  'webhook': Octicons.WebhookIcon,
  'apps': Octicons.AppsIcon,
  'law': Octicons.LawIcon,
  'eye': Octicons.EyeIcon,
  'people': Octicons.PeopleIcon,
  'graph': Octicons.GraphIcon,
  'gear': Octicons.GearIcon,
  'rocket': Octicons.RocketIcon,
  'pulse': Octicons.PulseIcon,
  'heart': Octicons.HeartIcon,
  'arrow-switch': Octicons.ArrowSwitchIcon,
  'accessibility': Octicons.AccessibilityIcon,
  'checklist': Octicons.ChecklistIcon,
  'sync': Octicons.SyncIcon,
};

export function SkillNode({ 
  node, 
  isSelected, 
  isHighlighted, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: SkillNodeProps) {
  const { exercise, path, position } = node;
  
  // Get the appropriate icon component with fallback
  const IconComponent = iconMap[exercise.icon] || Octicons.MarkGithubIcon;
  
  // Calculate opacity based on status
  const getOpacity = (status: string) => {
    switch (status) {
      case 'active': return 1.0;
      case 'scheduled': return 0.7;
      case 'tentative': return 0.4;
      default: return 1.0;
    }
  };

  const opacity = getOpacity(exercise.status);
  const nodeRadius = isHighlighted || isSelected ? 32 : 28;
  const ringRadius = nodeRadius + 4;

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      className="skill-node cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ opacity }}
    >
      {/* Selection ring */}
      {(isSelected || isHighlighted) && (
        <circle
          r={ringRadius}
          fill="none"
          stroke={path.color}
          strokeWidth="2"
          opacity={isSelected ? 0.8 : 0.5}
        />
      )}
      
      {/* Node background */}
      <circle
        r={nodeRadius}
        fill="#21262d"
        stroke={path.color}
        strokeWidth="2"
        style={{
          filter: isHighlighted 
            ? `drop-shadow(0 0 12px ${path.color})` 
            : `drop-shadow(0 2px 8px rgba(0,0,0,0.3))`
        }}
      />
      
      {/* Icon */}
      <foreignObject
        x={-16}
        y={-16}
        width={32}
        height={32}
      >
        <div className="flex items-center justify-center w-full h-full">
          <IconComponent
            size={24}
            style={{ color: path.color }}
          />
        </div>
      </foreignObject>
      
      {/* Exercise name - only show on hover/selection */}
      {(isHighlighted || isSelected) && (
        <text
          y={nodeRadius + 20}
          textAnchor="middle"
          className="fill-foreground text-sm font-medium"
          style={{ userSelect: 'none' }}
        >
          {exercise.name}
        </text>
      )}
    </g>
  );
}