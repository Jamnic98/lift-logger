import { Button } from 'components'
import type { ExerciseMap, TrackedExerciseOrGroupInput } from 'types'

function getVisibleFields(exercise: { exerciseKey: string; equipment?: string }) {
  const equipment = exercise.equipment
  const exerciseKey = exercise.exerciseKey
  const fields: Array<'sets' | 'reps' | 'weight' | 'bandResistance' | 'duration' | 'rest'> = [
    'sets',
  ]

  if (!equipment) return [...fields, 'reps', 'rest'] // fallback

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

  fields.push('rest') // always show rest

  return fields
}

interface WorkoutSubmitFormProps {
  name: string
  exercises: TrackedExerciseOrGroupInput[]
  exerciseMap: ExerciseMap
  startTime: Date
  endTime?: Date
  onComplete: () => void
  hideSubmitButton: boolean
}

export default function WorkoutSubmitForm({
  name,
  exercises,
  exerciseMap,
  startTime,
  endTime,
  onComplete,
  hideSubmitButton,
}: WorkoutSubmitFormProps) {
  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="mb-4">
        Started at: {formatTime(startTime)} {endTime ? `- Ended at: ${formatTime(endTime)}` : ''}
      </p>

      <div className="space-y-4">
        {exercises.map((entry, eIdx) => {
          const isSuperset = 'superset' in entry
          const items = isSuperset ? (entry.superset ?? []) : [entry]

          return (
            <div key={eIdx} className="border p-3 space-y-3 rounded-md">
              {isSuperset && <p className="font-semibold text-lg">Superset</p>}
              {items.map((ex, exIdx) => {
                const visibleFields = getVisibleFields(ex)
                return (
                  <div key={exIdx} className="border p-2 rounded">
                    <p className="font-medium text-base">
                      {exerciseMap[ex.exerciseKey]?.label ?? ex.exerciseKey}
                    </p>

                    <div
                      className={`grid gap-2 font-semibold`}
                      style={{
                        gridTemplateColumns: `repeat(${visibleFields.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {visibleFields.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>

                    <div
                      className={`grid gap-2`}
                      style={{
                        gridTemplateColumns: `repeat(${visibleFields.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {visibleFields.map((f) => {
                        if (f === 'sets')
                          return (
                            <span key={f}>
                              {Array.isArray(ex.sets) ? ex.sets.length : (ex.sets ?? 1)}
                            </span>
                          )
                        if (f === 'rest') return <span key={f}>{ex.rest ?? '30s'}</span>
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

      {!hideSubmitButton && (
        <Button onClick={onComplete} className="mt-4">
          Complete & Submit
        </Button>
      )}
    </div>
  )
}
