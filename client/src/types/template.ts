import type { BandResistance, Equipment } from './common'

export interface TemplateExerciseInput {
  exerciseKey: string
  equipment: Equipment
  sets?: number
  reps?: number
  weight?: number
  bandResistance?: BandResistance
  duration?: number
  rest?: number
  notes?: string
}

export interface TemplateExerciseGroupInput {
  sets: number
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
