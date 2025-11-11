import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/db';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(100),
  category: z.enum(['Push', 'Pull', 'Legs', 'Core']),
  muscleGroup: z.string().min(1, 'Muscle group is required').max(50),
  equipment: z.string().min(1, 'Equipment is required').max(50),
});

type ExerciseForm = z.infer<typeof exerciseSchema>;

export const AddExerciseDialog = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ExerciseForm>({
    resolver: zodResolver(exerciseSchema),
  });

  const category = watch('category');

  const onSubmit = async (data: ExerciseForm) => {
    try {
      await db.exercises.add({
        name: data.name,
        category: data.category,
        muscleGroup: data.muscleGroup,
        equipment: data.equipment,
      });
      toast.success('Exercise added successfully!');
      reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to add exercise');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              placeholder="e.g., Bench Press"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue('category', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Push">Push Day</SelectItem>
                <SelectItem value="Pull">Pull Day</SelectItem>
                <SelectItem value="Legs">Leg Day</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="muscleGroup">Muscle Group</Label>
            <Input
              id="muscleGroup"
              placeholder="e.g., Chest, Back, Quads"
              {...register('muscleGroup')}
            />
            {errors.muscleGroup && (
              <p className="text-sm text-destructive">{errors.muscleGroup.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Input
              id="equipment"
              placeholder="e.g., Barbell, Dumbbell, Machine"
              {...register('equipment')}
            />
            {errors.equipment && (
              <p className="text-sm text-destructive">{errors.equipment.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Exercise
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
