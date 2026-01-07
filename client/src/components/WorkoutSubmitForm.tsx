import { Button } from 'components'
import type {
  ExerciseMap,
  TrackedExerciseInput,
  TrackedExerciseOrGroupInput,
  WorkoutFormVariant,
} from 'types'

const formatDateTime = (date?: Date, full = false) => {
  if (!date) return '-'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  if (full) {
    // full date + time (view mode)
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } else {
    // time only (create mode)
    return `${hours}:${minutes}`
  }
}

function getVisibleFields(exercise: { exerciseKey: string; equipment?: string }) {
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

interface WorkoutSubmitFormProps {
  name: string
  exercises: TrackedExerciseOrGroupInput[]
  exerciseMap: ExerciseMap
  startTime: Date
  endTime?: Date
  variant?: WorkoutFormVariant
  onComplete: () => void
}

export default function WorkoutSubmitForm({
  name,
  exercises,
  exerciseMap,
  startTime,
  endTime,
  variant = 'view',
  onComplete,
}: WorkoutSubmitFormProps) {
  const isView = variant === 'view'

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="mb-4">
        {isView ? 'Completed on: ' : 'Started at: '}
        {formatDateTime(startTime, true)}
        {endTime && ` - ${formatDateTime(endTime, false)}`}
      </p>

      <div className="space-y-4">
        {exercises.map((entry, eIdx) => {
          const isSuperset = 'superset' in entry
          const items = isSuperset ? (entry.superset ?? []) : [entry]

          return (
            <div key={eIdx} className="border p-3 space-y-3 rounded-md">
              {isSuperset && (
                <div>
                  <p className="font-semibold text-lg">Superset</p>
                  <div>Sets: {entry.sets ?? 1}</div>
                  <div>Rest: {entry.restAfter ?? 30}s</div>
                </div>
              )}

              {items.map((ex, exIdx) => {
                let visibleFields = getVisibleFields(ex)
                const hideSupersetFields = isSuperset

                // hide 'sets' and 'rest' for sub-exercises
                if (hideSupersetFields) {
                  visibleFields = visibleFields.filter((f) => f !== 'sets' && f !== 'rest')
                }

                return (
                  <div key={exIdx} className="border p-2 rounded">
                    <p className="font-medium text-base">
                      {exerciseMap[ex.exerciseKey]?.label ?? ex.exerciseKey}
                    </p>

                    <div
                      className="grid gap-2 font-semibold"
                      style={{
                        gridTemplateColumns: `repeat(${visibleFields.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {visibleFields.map((f) => (
                        <span key={f}>{f === 'equipment' ? 'Equipment' : f}</span>
                      ))}
                    </div>

                    <div
                      className="grid gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${visibleFields.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {visibleFields.map((f) => {
                        if (hideSupersetFields && (f === 'sets' || f === 'rest')) return null

                        if (f === 'sets') {
                          const setsCount = Array.isArray(ex.sets) ? ex.sets.length : ex.sets
                          return <span key={f}>{setsCount}</span>
                        }

                        if (f === 'rest') return <span key={f}>{ex.rest ?? '30'}</span>

                        if (f === 'equipment')
                          return (
                            <span key={f}>
                              {(ex as TrackedExerciseInput & { equipment?: string }).equipment ??
                                '-'}
                            </span>
                          )

                        return <span key={f}>{(ex as any)[f] ?? '-'}</span>
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {variant === 'create' && (
        <Button onClick={onComplete} className="mt-4">
          Complete & Submit
        </Button>
      )}
    </div>
  )
}
