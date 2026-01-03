import type { Equipment, BandResistance } from './common'

// Single set in a tracked exercise
export interface SetEntryInput {
  reps: number
  bandResistance?: BandResistance
  equipment: Equipment
  weight?: number
  duration?: number
  rpe?: number
}

// Single exercise input
export interface TrackedExerciseInput {
  exerciseKey: string
  sets: SetEntryInput[]
  rest?: number
  notes?: string
}

// Superset input
export interface TrackedExerciseGroupInput {
  superset: TrackedExerciseInput[]
  restAfter?: number
}

export type TrackedExerciseOrGroupInput = TrackedExerciseInput | TrackedExerciseGroupInput

export interface WorkoutInput {
  name?: string
  exercises: TrackedExerciseOrGroupInput[]
  startTime: string | Date
  endTime?: string | Date
}

export interface Workout extends WorkoutInput {
  id: string
  startTime: string
  endTime?: string
}
