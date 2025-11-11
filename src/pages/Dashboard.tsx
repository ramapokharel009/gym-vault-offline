import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { StatCard } from '@/components/StatCard';
import { WorkoutCard } from '@/components/WorkoutCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity, TrendingUp, Award, Calendar, Clock, Weight } from 'lucide-react';
import { format } from 'date-fns';
import { Navigation } from '@/components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const templates = useLiveQuery(() => db.workoutTemplates.toArray());
  const workouts = useLiveQuery(() => db.workouts.orderBy('date').reverse().limit(5).toArray());
  const allWorkouts = useLiveQuery(() => db.workouts.toArray());
  const personalRecords = useLiveQuery(() => db.personalRecords.orderBy('date').reverse().limit(5).toArray());

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    personalRecords: 0
  });

  useEffect(() => {
    if (allWorkouts) {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisWeekWorkouts = allWorkouts.filter(w => new Date(w.date) >= weekAgo);

      setStats({
        totalWorkouts: allWorkouts.length,
        thisWeek: thisWeekWorkouts.length,
        personalRecords: personalRecords?.length || 0
      });
    }
  }, [allWorkouts, personalRecords]);

  const startWorkout = (templateId: number) => {
    navigate(`/workout/${templateId}`);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Track Your Fitness Journey
          </h1>
          <p className="text-muted-foreground">Your progress, your way</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            icon={Activity}
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek}
            icon={Calendar}
            subtitle="workouts completed"
          />
          <StatCard
            title="Personal Records"
            value={stats.personalRecords}
            icon={Award}
          />
        </div>

        {/* Quick Start Workouts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Quick Start</h2>
            <Button variant="outline" onClick={() => navigate('/templates')}>
              View All Templates
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Recent Workouts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Workouts</h2>
            <Button variant="outline" onClick={() => navigate('/history')}>
              View History
            </Button>
          </div>
          <div className="space-y-2">
            {workouts && workouts.length > 0 ? (
              workouts.map((workout) => (
                <Card key={workout.id} className="p-4 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{workout.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(workout.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {Math.floor(workout.duration / 60)}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Weight className="h-4 w-4" />
                          {workout.totalVolume.toLocaleString()} lbs
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
                      View
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center border-border/50">
                <p className="text-muted-foreground">No workouts yet. Start your first workout above!</p>
              </Card>
            )}
          </div>
        </div>

        {/* Personal Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Personal Records</h2>
            <Button variant="outline" onClick={() => navigate('/progress')}>
              View Progress
            </Button>
          </div>
          <Card className="p-4 border-border/50">
            {personalRecords && personalRecords.length > 0 ? (
              <div className="space-y-2">
                {personalRecords.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="text-foreground">Exercise {pr.exerciseId}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{pr.weight} lbs × {pr.reps}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(pr.date), 'MMM dd')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No personal records yet. Keep training!</p>
            )}
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
