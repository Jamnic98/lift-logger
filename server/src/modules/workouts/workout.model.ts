import { model, Schema } from 'mongoose'

import { EquipmentEnum, BandResistanceEnum } from 'types/common'
import { Workout } from 'types/workout'

// Each set in a tracked exercise
const SetEntrySchema = new Schema(
  {
    reps: { type: Number, required: true },
    bandResistance: { type: String, enum: BandResistanceEnum },
    equipment: { type: String, enum: EquipmentEnum, required: true },
    weight: { type: Number },
    duration: { type: Number },
    rpe: { type: Number, min: 0, max: 10 },
  },
  { _id: false }
)

// Single exercise
const TrackedExerciseSchema = new Schema(
  {
    exerciseKey: { type: String, required: true },
    sets: { type: [SetEntrySchema], required: true },
    rest: { type: Number },
    notes: { type: String },
  },
  { _id: false }
)

// Superset / back-to-back exercises
export const TrackedExerciseGroupSchema = new Schema(
  {
    superset: { type: [TrackedExerciseSchema], required: true },
    restAfter: { type: Number },
  },
  { _id: false }
)

const WorkoutSchema = new Schema<Workout>(
  {
    name: { type: String, required: true, trim: true },
    exercises: [
      {
        type: Schema.Types.Mixed,
        required: true,
      },
    ],
    startTime: { type: Date, required: true },
    endTime: { type: Date },
  },
  { timestamps: false }
)

export const WorkoutModel = model<Workout>('Workout', WorkoutSchema)
