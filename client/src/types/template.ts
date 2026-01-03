import type { BandResistance, Equipment } from './common'

export interface TemplateExerciseInput {
  exerciseKey: string
  sets: number
  equipment: Equipment
  reps?: number
  weight?: number
  bandResistance?: BandResistance
  duration?: number
  rest?: number
  notes?: string
}

export interface TemplateExerciseGroupInput {
  superset: TemplateExerciseInput[]
  restAfter?: number
}

export type TemplateExerciseOrGroupInput = TemplateExerciseInput | TemplateExerciseGroupInput

export interface TemplateInput {
  name: string
  exercises: TemplateExerciseOrGroupInput[]
}

export type Template = TemplateInput & {
  id: string
}
