import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { WorkoutCard } from '@/components/WorkoutCard';
import { Plus } from 'lucide-react';

const Templates = () => {
  const navigate = useNavigate();
  const templates = useLiveQuery(() => db.workoutTemplates.toArray());

  const startWorkout = (templateId: number) => {
    navigate(`/workout/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workout Templates</h1>
            <p className="text-muted-foreground mt-1">Choose a template to start your workout</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.map((template) => (
            <WorkoutCard
              key={template.id}
              name={template.name}
              exerciseCount={template.exercises.length}
              onStart={() => startWorkout(template.id!)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
