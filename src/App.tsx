import React from 'react';
import { SkillsTree } from './components/SkillsTree';
import { useExercises, usePaths } from './hooks/use-data';
import { Toaster } from './components/ui/sonner';

function App() {
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises();
  const { paths, loading: pathsLoading, error: pathsError } = usePaths();
  const [filterBarCollapsed, setFilterBarCollapsed] = React.useState(false);

  const loading = exercisesLoading || pathsLoading;
  const error = exercisesError || pathsError;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading GitHub Skills Roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with adaptive left padding based on filter bar state */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className={`pr-6 py-4 transition-all duration-200 ${
          filterBarCollapsed ? 'pl-20' : 'pl-6'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">GitHub Skills Roadmap</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore the learning paths for GitHub mastery
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{exercises.length} exercises</span>
              <span>{paths.length} learning paths</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Skills Tree */}
      <main className="relative" style={{ marginTop: '-1px' }}>
        <SkillsTree 
          exercises={exercises} 
          paths={paths} 
          filterBarCollapsed={filterBarCollapsed}
          onFilterBarCollapsedChange={setFilterBarCollapsed}
        />
      </main>

      <Toaster />
    </div>
  );
}

export default App;