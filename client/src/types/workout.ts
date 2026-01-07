import type { Equipment, BandResistance } from './common'

// Single set in a tracked exercise
export interface SetEntryInput {
  rest: number
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
  sets: number
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

export type WorkoutFormVariant = 'create' | 'view' | 'track'
