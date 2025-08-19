import { useState, useEffect } from 'react';
import type { Exercise, Path } from '../lib/types';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExercises() {
      try {
        // List of all exercise files - in a real app this would be dynamic
        const exerciseFiles = [
          'hello-github', 'git-basics', 'markdown-portfolio', 'github-pages',
          'pull-requests', 'merge-conflicts', 'github-actions-intro', 'release-based-workflow',
          'github-issues', 'github-projects', 'code-security', 'dependabot',
          'codeql', 'github-copilot', 'codespaces', 'branch-protection',
          'organizations', 'fork-and-clone', 'github-cli', 'secret-scanning',
          'profile-readme', 'wiki-collaboration', 'repository-templates', 'continuous-integration',
          'package-publishing', 'docker-container-action', 'javascript-action', 'reusable-workflows',
          'copilot-chat', 'advanced-security', 'issue-templates', 'github-mobile',
          'api-integration', 'webhooks', 'github-apps', 'discussions',
          'license-compliance', 'code-review', 'advanced-git', 'enterprise-administration',
          'team-management', 'repository-insights', 'copilot-customization', 'deployment-strategies',
          'monitoring-observability', 'github-sponsors', 'migration-tools', 'project-automation',
          'community-standards', 'accessibility-testing'
        ];

        const exercisePromises = exerciseFiles.map(async (slug) => {
          const response = await fetch(`/exercises/${slug}.json`);
          if (!response.ok) throw new Error(`Failed to load exercise: ${slug}`);
          return response.json();
        });

        const loadedExercises = await Promise.all(exercisePromises);
        setExercises(loadedExercises);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  return { exercises, loading, error };
}

export function usePaths() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPaths() {
      try {
        const pathFiles = [
          'fundamentals', 'collaboration', 'automation',
          'security', 'ai-productivity', 'project-management'
        ];

        const pathPromises = pathFiles.map(async (slug) => {
          const response = await fetch(`/paths/${slug}.json`);
          if (!response.ok) throw new Error(`Failed to load path: ${slug}`);
          return response.json();
        });

        const loadedPaths = await Promise.all(pathPromises);
        setPaths(loadedPaths);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load paths');
      } finally {
        setLoading(false);
      }
    }

    loadPaths();
  }, []);

  return { paths, loading, error };
}