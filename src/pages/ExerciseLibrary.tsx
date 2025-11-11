import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Exercise } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Dumbbell } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { AddExerciseDialog } from '@/components/AddExerciseDialog';

type CategoryFilter = 'All' | 'Push' | 'Pull' | 'Legs' | 'Core';

const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  
  const exercises = useLiveQuery(() => db.exercises.toArray());

  const filteredExercises = exercises?.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || exercise.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories: CategoryFilter[] = ['All', 'Push', 'Pull', 'Legs', 'Core'];

  return (
    <>
      <Navigation />
      <div className="h-2" />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exercise Library</h1>
          </div>

          {/* Search and Add */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <AddExerciseDialog />
          </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              onClick={() => setCategoryFilter(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises?.map((exercise) => (
            <Card key={exercise.id} className="p-4 border-border/50 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">{exercise.category}</span> • {exercise.muscleGroup}
                    </p>
                    <p className="text-xs text-muted-foreground">{exercise.equipment}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

          {filteredExercises?.length === 0 && (
            <Card className="p-8 text-center border-border/50">
              <p className="text-muted-foreground">No exercises found.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ExerciseLibrary;
