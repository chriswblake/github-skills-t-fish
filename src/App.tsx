import React from 'react';
import { SkillsTree } from './components/SkillsTree';
import { useExercises, usePaths } from './hooks/use-data';
import { Toaster } from './components/ui/sonner';

function App() {
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises();
  const { paths, loading: pathsLoading, error: pathsError } = usePaths();

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-4">
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
      <main className="relative">
        <SkillsTree exercises={exercises} paths={paths} />
      </main>

      {/* Legend */}
      <div className="fixed bottom-6 left-6 bg-card/95 backdrop-blur border border-border rounded-lg p-4 max-w-xs">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Status Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Active - Ready to start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Scheduled - In development</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Tentative - Under consideration</span>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;