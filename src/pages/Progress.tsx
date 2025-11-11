import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, TrendingUp, Scale } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
  const navigate = useNavigate();
  const personalRecords = useLiveQuery(() => db.personalRecords.orderBy('date').reverse().toArray());
  const bodyMetrics = useLiveQuery(() => db.bodyMetrics.orderBy('date').reverse().toArray());
  const exercises = useLiveQuery(() => db.exercises.toArray());

  const getExerciseName = (exerciseId: number) => {
    return exercises?.find(e => e.id === exerciseId)?.name || 'Unknown Exercise';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="prs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prs">Personal Records</TabsTrigger>
            <TabsTrigger value="exercises">Exercise Progress</TabsTrigger>
            <TabsTrigger value="body">Body Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="prs" className="space-y-4">
            <Card className="p-6 border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Personal Records</h2>
                  <p className="text-sm text-muted-foreground">Your best lifts</p>
                </div>
              </div>
              
              {personalRecords && personalRecords.length > 0 ? (
                <div className="space-y-2">
                  {personalRecords.map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-semibold text-foreground">{getExerciseName(pr.exerciseId)}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(pr.date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-accent">{pr.weight} lbs</p>
                        <p className="text-sm text-muted-foreground">{pr.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No personal records yet. Keep training!</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <Card className="p-6 border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Exercise Progress</h2>
                  <p className="text-sm text-muted-foreground">Track your improvement</p>
                </div>
              </div>
              <p className="text-center text-muted-foreground py-8">
                Exercise progress charts coming soon!
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="body" className="space-y-4">
            <Card className="p-6 border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Body Metrics</h2>
                  <p className="text-sm text-muted-foreground">Track your body composition</p>
                </div>
              </div>

              {bodyMetrics && bodyMetrics.length > 0 ? (
                <div className="space-y-2">
                  {bodyMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">{format(new Date(metric.date), 'MMM dd, yyyy')}</p>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{metric.weight} lbs</p>
                        {metric.bodyFat && (
                          <p className="text-sm text-muted-foreground">{metric.bodyFat}% body fat</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No body metrics tracked yet.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;
