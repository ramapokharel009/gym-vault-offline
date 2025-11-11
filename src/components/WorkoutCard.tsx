import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dumbbell, Play } from 'lucide-react';

interface WorkoutCardProps {
  name: string;
  exerciseCount: number;
  onStart: () => void;
}

export const WorkoutCard = ({ name, exerciseCount, onStart }: WorkoutCardProps) => {
  return (
    <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{exerciseCount} exercises</p>
        </div>
      </div>
      <Button onClick={onStart} className="w-full" size="sm">
        <Play className="mr-2 h-4 w-4" />
        Start Workout
      </Button>
    </Card>
  );
};
