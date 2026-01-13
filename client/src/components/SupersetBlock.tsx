import { Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

import { Button, ExerciseRow } from 'components'
import type { DraftSuperset, ExerciseMap } from 'types'

interface SupersetBlockProps {
  errors: string[]
  value: DraftSuperset
  onChange: (next: DraftSuperset) => void
  onRemove: () => void
  exerciseMap: ExerciseMap
}

export default function SupersetBlock({
  value,
  errors,
  onChange,
  onRemove,
  exerciseMap,
}: SupersetBlockProps) {
  const addExercise = () =>
    onChange({
      ...value,
      sets: 3,
      restAfter: 30,
      exercises: [
        ...value.exercises,
        {
          id: uuidv4(),
          type: 'single',
          exerciseKey: '',
          equipment: 'bodyweight',
        },
      ],
    })

  return (
    <div className="border p-3 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <p className="font-semibold text-lg">Superset</p>

        <Button variant="danger" onClick={onRemove} className="flex space-x-2">
          <Trash2 />
        </Button>
      </div>

      <div className="flex flex-row space-x-4 items-center">
        {/* Superset sets input */}
        <div className="flex flex-col items-start">
          <label className="text-sm font-medium text-gray-700">Sets</label>
          <input
            type="number"
            value={value.sets}
            onChange={(e) =>
              onChange({
                ...value,
                sets: Number(e.target.value),
              })
            }
            className="w-16 sm:w-20 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            min={1}
          />
        </div>

        {/* Superset rest input */}
        <div className="flex flex-col items-start">
          <label className="text-sm font-medium text-gray-700">Rest (sec)</label>
          <input
            type="number"
            value={value.restAfter ?? 30}
            onChange={(e) =>
              onChange({
                ...value,
                restAfter: Number(e.target.value),
              })
            }
            className="w-16 sm:w-20 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            min={0}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-2">
        {value.exercises.map((ex, idx) => (
          <ExerciseRow
            key={idx}
            value={{ ...ex }}
            exerciseMap={exerciseMap}
            hideRest
            hideSets
            errors={errors}
            onChange={(next) =>
              onChange({
                ...value,
                exercises: value.exercises.map((e, i) => (i === idx ? { ...next } : e)),
              })
            }
            onRemove={() => {
              const newExercises = value.exercises.filter((_, i) => i !== idx)
              if (newExercises.length === 0) onRemove()
              else onChange({ ...value, exercises: newExercises })
            }}
          />
        ))}
      </div>

      {/* Add exercise button */}
      <div className="flex justify-start">
        <Button onClick={addExercise} className="flex space-x-2">
          <Plus />
          <span>exercise</span>
        </Button>
      </div>
    </div>
  )
}
