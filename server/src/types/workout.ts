import { Types } from 'mongoose'

import { BandResistance, Equipment } from './common'

export interface SetEntry {
  equipment: Equipment
  reps?: number
  bandResistance?: BandResistance
  duration?: number
  weight?: number
  rpe?: number
}

export interface TrackedExercise {
  exerciseKey: string
  sets?: SetEntry[]
  rest?: number
  notes?: string
}

export interface TrackedExerciseGroup {
  superset: TrackedExercise[]
  sets: number
  restAfter?: number
}

export type WorkoutEntry = TrackedExercise | TrackedExerciseGroup

export interface Workout {
  id?: string
  _id?: Types.ObjectId
  name: string
  exercises: WorkoutEntry[]
  startTime: Date
  endTime?: Date
}

export interface WorkoutInput {
  name: string
  exercises: WorkoutEntry[]
  startTime: Date
  endTime?: Date
}
