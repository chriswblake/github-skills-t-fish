import type { Exercise, Path, SkillTreeNode } from './types';
import type { FilterState } from '../components/FilterBar';

/**
 * Calculate the visibility level of an exercise based on active filters
 * @param exercise - The exercise to evaluate
 * @param path - The learning path the exercise belongs to  
 * @param filters - Current filter state
 * @returns A number from 0 (fully dimmed) to 1 (fully visible)
 */
export function calculateExerciseVisibility(
  exercise: Exercise,
  path: Path,
  filters: FilterState
): number {
  // If no filters are active, show everything at full visibility
  const totalActiveFilters = 
    filters.paths.length + 
    filters.products.length + 
    filters.difficulties.length + 
    filters.statuses.length;

  if (totalActiveFilters === 0) {
    return 1;
  }

  const activeFilters: { category: string; values: string[]; hasMatch: boolean }[] = [];

  // Check path filter
  if (filters.paths.length > 0) {
    activeFilters.push({
      category: 'path',
      values: filters.paths,
      hasMatch: filters.paths.includes(path.name)
    });
  }

  // Check product filter
  if (filters.products.length > 0) {
    activeFilters.push({
      category: 'product',
      values: filters.products,
      hasMatch: exercise.products ? 
        exercise.products.some(product => filters.products.includes(product)) : 
        false
    });
  }

  // Check difficulty filter
  if (filters.difficulties.length > 0) {
    activeFilters.push({
      category: 'difficulty',
      values: filters.difficulties,
      hasMatch: exercise.difficulty ? 
        filters.difficulties.includes(exercise.difficulty) : 
        false
    });
  }

  // Check status filter
  if (filters.statuses.length > 0) {
    activeFilters.push({
      category: 'status',
      values: filters.statuses,
      hasMatch: filters.statuses.includes(exercise.status)
    });
  }

  // Calculate visibility based on matching filters
  const matchingFilters = activeFilters.filter(filter => filter.hasMatch).length;
  const totalActiveFilterCount = activeFilters.length;

  if (totalActiveFilterCount === 0) {
    return 1; // No active filters
  }

  // Calculate percentage based on matching filters
  // 0 matches = 25% visibility (75% dimmed)
  // All matches = 100% visibility (0% dimmed)
  const baseVisibility = 0.25; // Minimum visibility when no filters match
  const visibilityRange = 1 - baseVisibility; // The range we can adjust
  const matchPercentage = matchingFilters / totalActiveFilterCount;
  
  return baseVisibility + (visibilityRange * matchPercentage);
}

/**
 * Apply visibility calculations to skill tree nodes
 */
export function applyVisibilityToNodes(
  nodes: SkillTreeNode[], 
  filters: FilterState
): (SkillTreeNode & { visibility: number })[] {
  return nodes.map(node => ({
    ...node,
    visibility: calculateExerciseVisibility(node.exercise, node.path, filters)
  }));
}