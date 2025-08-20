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
          '1-introduction-to-github',
          '2-communicate-using-markdown',
          '3-github-pages',
          '4-review-pull-requests'
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