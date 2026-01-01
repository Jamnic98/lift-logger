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
