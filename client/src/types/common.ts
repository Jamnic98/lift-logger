export const BandResistanceEnum = ['xtra-light', 'light', 'medium', 'heavy', 'xtra-heavy'] as const
export type BandResistance = (typeof BandResistanceEnum)[number]

export const EquipmentEnum = [
  'bodyweight',
  'barbell',
  'dumbbell',
  'kettlebell',
  'band',
  'machine',
  'other',
] as const
export type Equipment = (typeof EquipmentEnum)[number]

type ExerciseMeta = {
  label: string
  category: string
  equipment: Equipment[]
}

export type ExerciseMap = Record<string, ExerciseMeta>

export type DraftExercise = {
  id: string
  type: 'single'
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

export type DraftSuperset = {
  id: string
  type: 'superset'
  exercises: DraftExercise[]
  sets: number
  restAfter?: number
}

export type DraftEntry = DraftExercise | DraftSuperset
