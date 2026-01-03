import { Button, ExerciseRow } from 'components'
import type { DraftSuperset, ExerciseMap } from 'types'

export default function SupersetBlock({
  value,
  onChange,
  onRemove,
  exerciseMap,
}: {
  value: DraftSuperset
  onChange: (next: DraftSuperset) => void
  onRemove: () => void
  exerciseMap: ExerciseMap
}) {
  return (
    <div className="border p-3 space-y-2">
      <p className="font-semibold">Superset</p>

      {value.exercises.map((ex, idx) => (
        <ExerciseRow
          key={idx}
          value={ex}
          exerciseMap={exerciseMap}
          onChange={(next) =>
            onChange({
              ...value,
              exercises: value.exercises.map((e, i) => (i === idx ? next : e)),
            })
          }
          onRemove={() =>
            onChange({
              ...value,
              exercises: value.exercises.filter((_, i) => i !== idx),
            })
          }
        />
      ))}

      <Button
        onClick={() =>
          onChange({
            ...value,
            exercises: [
              ...value.exercises,
              {
                type: 'single',
                exerciseKey: '',
                sets: 3,
                equipment: 'bodyweight',
              },
            ],
          })
        }
      >
        Add exercise
      </Button>

      <Button onClick={onRemove}>Remove superset</Button>
    </div>
  )
}
