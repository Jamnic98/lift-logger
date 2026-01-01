import { Types } from 'mongoose'

import { BandResistance, Equipment } from './common'

export interface TemplateExercise {
  exerciseKey: string
  equipment: Equipment
  sets: number
  reps?: number
  weight?: number
  bandResistance?: BandResistance
  duration?: number
  rest?: number
  notes?: string
}

export interface TemplateExerciseGroup {
  superset: TemplateExercise[]
  restAfter?: number
}

export type TemplateEntry = TemplateExercise | TemplateExerciseGroup

export interface Template {
  _id: Types.ObjectId
  name: string
  exercises: TemplateEntry[]
}

export interface TemplateInput {
  name: string
  exercises: TemplateEntry[]
}
