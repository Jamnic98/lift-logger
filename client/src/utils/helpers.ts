export const formatDateTime = (date: string | Date, full = false) => {
  if (!date) return '-'
  let d = date
  if (typeof d === 'string') {
    d = new Date(d)
  }
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(-2)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  if (full) {
    // full date + time (view mode)
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } else {
    // time only (create mode)
    return `${hours}:${minutes}`
  }
}

export function getVisibleFields(exercise: { exerciseKey: string; equipment?: string }) {
  const equipment = exercise.equipment
  const exerciseKey = exercise.exerciseKey
  const fields: Array<
    'sets' | 'reps' | 'weight' | 'bandResistance' | 'duration' | 'rest' | 'equipment'
  > = ['sets']

  if (!equipment) return [...fields, 'reps', 'rest']

  switch (equipment) {
    case 'bodyweight':
      if (exerciseKey.toLowerCase().includes('plank')) fields.push('duration')
      else fields.push('reps')
      break
    case 'barbell':
    case 'dumbbell':
    case 'kettlebell':
      fields.push('reps', 'weight')
      break
    case 'band':
      fields.push('reps', 'bandResistance')
      break
    case 'machine':
      fields.push('reps', 'weight')
      break
    case 'other':
      fields.push('reps')
      break
  }

  fields.push('rest', 'equipment')
  return fields
}
