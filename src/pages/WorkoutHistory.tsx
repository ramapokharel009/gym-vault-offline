import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { Activity, Clock, Weight, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type FilterType = 'all' | 'week' | 'month' | 'year';

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<number>>(new Set());
  
  const allWorkouts = useLiveQuery(() => db.workouts.orderBy('date').reverse().toArray());
  const exercises = useLiveQuery(() => db.exercises.toArray());

  const getFilteredWorkouts = () => {
    if (!allWorkouts) return [];
    
    const now = new Date();
    let filterDate: Date;
    
    switch (filter) {
      case 'week':
        filterDate = subWeeks(now, 1);
        break;
      case 'month':
        filterDate = subMonths(now, 1);
        break;
      case 'year':
        filterDate = subYears(now, 1);
        break;
      default:
        return allWorkouts;
    }
    
    return allWorkouts.filter(w => new Date(w.date) >= filterDate);
  };

  const filteredWorkouts = getFilteredWorkouts();

  const stats = {
    total: filteredWorkouts.length,
    totalVolume: filteredWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
    avgDuration: filteredWorkouts.length > 0
      ? Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / filteredWorkouts.length / 60)
      : 0
  };

  const toggleWorkout = (id: number) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedWorkouts(newExpanded);
  };

  const getExerciseName = (exerciseId: number) => {
    return exercises?.find(e => e.id === exerciseId)?.name || 'Unknown Exercise';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Workout History</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'week', 'month', 'year'] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              size="sm"
            >
              {f === 'all' ? 'All Time' : `This ${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Workouts"
            value={stats.total}
            icon={Activity}
          />
          <StatCard
            title="Total Volume"
            value={`${stats.totalVolume.toLocaleString()} lbs`}
            icon={Weight}
          />
          <StatCard
            title="Avg Duration"
            value={`${stats.avgDuration}m`}
            icon={Clock}
          />
        </div>

        {/* Workout List */}
        <div className="space-y-3">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="border-border/50 overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => toggleWorkout(workout.id!)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{workout.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(workout.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {Math.floor(workout.duration / 60)}m {workout.duration % 60}s
                        </span>
                        <span className="flex items-center gap-1">
                          <Weight className="h-4 w-4" />
                          {workout.totalVolume.toLocaleString()} lbs
                        </span>
                      </div>
                    </div>
                    {expandedWorkouts.has(workout.id!) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedWorkouts.has(workout.id!) && (
                  <div className="px-4 pb-4 border-t border-border/30">
                    <div className="mt-4 space-y-3">
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} className="bg-secondary/30 rounded-lg p-3">
                          <h4 className="font-medium text-foreground mb-2">
                            {getExerciseName(exercise.exerciseId)}
                          </h4>
                          <div className="space-y-1">
                            {exercise.sets.filter(s => s.completed).map((set, setIdx) => (
                              <div key={setIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="w-12">Set {setIdx + 1}:</span>
                                <span className="font-medium text-foreground">
                                  {set.weight} lbs × {set.reps} reps
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center border-border/50">
              <p className="text-muted-foreground">No workouts found for this time period.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistory;
