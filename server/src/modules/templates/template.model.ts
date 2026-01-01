import { model, Schema } from 'mongoose'

import { EquipmentEnum, BandResistanceEnum } from 'types/common'
import { Template } from 'types/template'

// Single exercise
const TemplateExerciseSchema = new Schema(
  {
    exerciseKey: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number },
    equipment: { type: String, enum: EquipmentEnum, required: true },
    weight: { type: Number },
    bandResistance: { type: String, enum: BandResistanceEnum },
    duration: { type: Number },
    rest: { type: Number },
    notes: { type: String },
  },
  { _id: false }
)

// Superset / back-to-back exercises
export const TemplateExerciseGroupSchema = new Schema(
  {
    superset: { type: [TemplateExerciseSchema], required: true },
    restAfter: { type: Number },
  },
  { _id: false }
)

const TemplateSchema = new Schema<Template>(
  {
    name: { type: String, required: true, trim: true },
    exercises: [
      {
        type: [Schema.Types.Mixed],
        default: [],
      },
    ],
  },
  { timestamps: false }
)

export const TemplateModel = model<Template>('Template', TemplateSchema)
