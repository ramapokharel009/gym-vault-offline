import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, WorkoutExercise, WorkoutSet } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { ArrowLeft, Check, Plus, Timer } from 'lucide-react';
import { toast } from 'sonner';

const WorkoutSession = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const { seconds, formatTime } = useWorkoutTimer(isActive);
  
  const template = useLiveQuery(
    () => db.workoutTemplates.get(Number(templateId)),
    [templateId]
  );

  const [exercises, setExercises] = useState<Array<any>>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    if (template) {
      Promise.all(template.exercises.map(id => db.exercises.get(id))).then(setExercises);
      
      const initialData: WorkoutExercise[] = template.exercises.map(exerciseId => ({
        exerciseId,
        sets: [{ weight: 0, reps: 0, completed: false }]
      }));
      setWorkoutData(initialData);
    }
  }, [template]);

  const addSet = (exerciseIndex: number) => {
    const newData = [...workoutData];
    const lastSet = newData[exerciseIndex].sets[newData[exerciseIndex].sets.length - 1];
    newData[exerciseIndex].sets.push({
      weight: lastSet.weight,
      reps: lastSet.reps,
      completed: false
    });
    setWorkoutData(newData);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
    const newData = [...workoutData];
    newData[exerciseIndex].sets[setIndex][field] = value;
    setWorkoutData(newData);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newData = [...workoutData];
    newData[exerciseIndex].sets[setIndex].completed = !newData[exerciseIndex].sets[setIndex].completed;
    setWorkoutData(newData);
  };

  const finishWorkout = async () => {
    if (!template) return;

    const totalVolume = workoutData.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return set.completed ? setTotal + (set.weight * set.reps) : setTotal;
      }, 0);
    }, 0);

    await db.workouts.add({
      templateId: template.id,
      name: template.name,
      date: new Date(),
      duration: seconds,
      exercises: workoutData,
      totalVolume
    });

    toast.success('Workout completed! 💪');
    navigate('/history');
  };

  const cancelWorkout = () => {
    if (confirm('Are you sure you want to cancel this workout?')) {
      navigate('/');
    }
  };

  if (!template || exercises.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={cancelWorkout}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Cancel
          </Button>
          <div className="flex items-center gap-2 text-primary">
            <Timer className="h-5 w-5" />
            <span className="text-xl font-bold">{formatTime(seconds)}</span>
          </div>
          <Button onClick={finishWorkout} className="bg-gradient-success">
            <Check className="mr-2 h-5 w-5" />
            Finish
          </Button>
        </div>

        {/* Workout Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{template.name}</h1>
          <p className="text-muted-foreground mt-1">{exercises.length} exercises</p>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((exercise, exerciseIndex) => (
            <Card key={exercise.id} className="p-6 border-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-4">{exercise.name}</h3>
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground font-medium mb-2">
                  <div className="col-span-1">Set</div>
                  <div className="col-span-4">Weight (lbs)</div>
                  <div className="col-span-4">Reps</div>
                  <div className="col-span-3 text-center">Done</div>
                </div>
                
                {/* Sets */}
                {workoutData[exerciseIndex]?.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-muted-foreground">{setIndex + 1}</div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                        className="bg-secondary"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                        className="bg-secondary"
                      />
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <Checkbox
                        checked={set.completed}
                        onCheckedChange={() => toggleSetComplete(exerciseIndex, setIndex)}
                      />
                    </div>
                  </div>
                ))}
                
                {/* Add Set Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(exerciseIndex)}
                  className="w-full mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Set
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;
