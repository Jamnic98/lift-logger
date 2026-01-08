import { model, Schema, Types } from 'mongoose'

import { EquipmentEnum, BandResistanceEnum } from 'types/common'
import { Template } from 'types/template'

// Single exercise
const TemplateExerciseSchema = new Schema(
  {
    exerciseKey: { type: String, required: true },
    sets: { type: Number },
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
    sets: { type: Number, required: true },
    superset: { type: [TemplateExerciseSchema], required: true },
    restAfter: { type: Number },
  },
  { _id: false }
)

const TemplateSchema = new Schema<Template>(
  {
    name: { type: String, required: true, trim: true },
    exercises: [],
  },
  { timestamps: true }
)

// --- Add toJSON transform ---
TemplateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = (ret._id as Types.ObjectId).toHexString()
    delete (ret as { _id?: unknown })._id
  },
})

export const TemplateModel = model<Template>('Template', TemplateSchema)
