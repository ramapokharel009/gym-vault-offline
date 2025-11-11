import Dexie, { Table } from 'dexie';

export interface Exercise {
  id?: number;
  name: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Core';
  muscleGroup: string;
  equipment: string;
}

export interface WorkoutTemplate {
  id?: number;
  name: string;
  exercises: number[]; // Array of exercise IDs
  createdAt: Date;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: number;
  sets: WorkoutSet[];
}

export interface Workout {
  id?: number;
  templateId?: number;
  name: string;
  date: Date;
  duration: number; // in seconds
  exercises: WorkoutExercise[];
  totalVolume: number;
}

export interface PersonalRecord {
  id?: number;
  exerciseId: number;
  weight: number;
  reps: number;
  date: Date;
}

export interface BodyMetric {
  id?: number;
  date: Date;
  weight: number;
  bodyFat?: number;
}

export class GymTrackerDB extends Dexie {
  exercises!: Table<Exercise>;
  workoutTemplates!: Table<WorkoutTemplate>;
  workouts!: Table<Workout>;
  personalRecords!: Table<PersonalRecord>;
  bodyMetrics!: Table<BodyMetric>;

  constructor() {
    super('GymTrackerDB');
    this.version(1).stores({
      exercises: '++id, name, category',
      workoutTemplates: '++id, name, createdAt',
      workouts: '++id, date, templateId',
      personalRecords: '++id, exerciseId, date',
      bodyMetrics: '++id, date'
    });
  }
}

export const db = new GymTrackerDB();

// Seed default exercises
export async function seedDefaultData() {
  const exerciseCount = await db.exercises.count();
  
  if (exerciseCount === 0) {
    const defaultExercises: Exercise[] = [
      // Push exercises
      { name: 'Bench Press', category: 'Push', muscleGroup: 'Chest', equipment: 'Barbell' },
      { name: 'Incline Dumbbell Press', category: 'Push', muscleGroup: 'Chest', equipment: 'Dumbbell' },
      { name: 'Cable Flyes', category: 'Push', muscleGroup: 'Chest', equipment: 'Cable' },
      { name: 'Overhead Press', category: 'Push', muscleGroup: 'Shoulders', equipment: 'Barbell' },
      { name: 'Lateral Raises', category: 'Push', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
      { name: 'Tricep Pushdowns', category: 'Push', muscleGroup: 'Triceps', equipment: 'Cable' },
      { name: 'Dips', category: 'Push', muscleGroup: 'Triceps', equipment: 'Bodyweight' },
      
      // Pull exercises
      { name: 'Pull Ups', category: 'Pull', muscleGroup: 'Back', equipment: 'Bodyweight' },
      { name: 'Barbell Rows', category: 'Pull', muscleGroup: 'Back', equipment: 'Barbell' },
      { name: 'Lat Pulldowns', category: 'Pull', muscleGroup: 'Back', equipment: 'Cable' },
      { name: 'Face Pulls', category: 'Pull', muscleGroup: 'Back', equipment: 'Cable' },
      { name: 'Barbell Curls', category: 'Pull', muscleGroup: 'Biceps', equipment: 'Barbell' },
      { name: 'Hammer Curls', category: 'Pull', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
      
      // Leg exercises
      { name: 'Squat', category: 'Legs', muscleGroup: 'Quads', equipment: 'Barbell' },
      { name: 'Romanian Deadlift', category: 'Legs', muscleGroup: 'Hamstrings', equipment: 'Barbell' },
      { name: 'Leg Press', category: 'Legs', muscleGroup: 'Quads', equipment: 'Machine' },
      { name: 'Leg Curls', category: 'Legs', muscleGroup: 'Hamstrings', equipment: 'Machine' },
      { name: 'Calf Raises', category: 'Legs', muscleGroup: 'Calves', equipment: 'Machine' },
      
      // Core exercises
      { name: 'Plank', category: 'Core', muscleGroup: 'Abs', equipment: 'Bodyweight' },
      { name: 'Cable Crunches', category: 'Core', muscleGroup: 'Abs', equipment: 'Cable' },
    ];

    await db.exercises.bulkAdd(defaultExercises);

    // Create default templates
    const exercises = await db.exercises.toArray();
    
    const pushExercises = exercises.filter(e => e.category === 'Push').slice(0, 5).map(e => e.id!);
    const pullExercises = exercises.filter(e => e.category === 'Pull').slice(0, 5).map(e => e.id!);
    const legExercises = exercises.filter(e => e.category === 'Legs').slice(0, 5).map(e => e.id!);

    await db.workoutTemplates.bulkAdd([
      { name: 'Push Day', exercises: pushExercises, createdAt: new Date() },
      { name: 'Pull Day', exercises: pullExercises, createdAt: new Date() },
      { name: 'Leg Day', exercises: legExercises, createdAt: new Date() },
    ]);
  }
}
