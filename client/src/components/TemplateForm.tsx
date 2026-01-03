import { useState } from 'react'
import { Button, ExerciseRow, SupersetBlock } from 'components'
import type { DraftEntry, ExerciseMap } from 'types/common'
import type { TemplateInput } from 'types/template'

type TemplateFormProps = {
  initialName?: string
  initialEntries?: DraftEntry[]
  exerciseMap: ExerciseMap
  onSave: (payload: TemplateInput) => Promise<void>
}

export default function TemplateForm({
  initialName = '',
  initialEntries = [],
  exerciseMap,
  onSave,
}: TemplateFormProps) {
  const [name, setName] = useState(initialName)
  const [entries, setEntries] = useState<DraftEntry[]>(initialEntries)

  // Adds a single exercise with defaults
  const addExercise = () => {
    const firstKey = Object.keys(exerciseMap)[0]
    if (!firstKey) return

    setEntries((prev) => [
      ...prev,
      {
        type: 'single',
        exerciseKey: firstKey,
        sets: 3,
        equipment: exerciseMap[firstKey].equipment[0],
        restBetweenSets: 30,
      },
    ])
  }

  // Adds a superset with one exercise initially
  const addSuperset = () => {
    const firstKey = Object.keys(exerciseMap)[0]
    if (!firstKey) return

    setEntries((prev) => [
      ...prev,
      {
        type: 'superset',
        exercises: [
          {
            type: 'single',
            exerciseKey: firstKey,
            sets: 3,
            equipment: exerciseMap[firstKey].equipment[0],
            restBetweenSets: 30,
          },
        ],
      },
    ])
  }

  // Save template payload
  const saveTemplate = async () => {
    const payload: TemplateInput = {
      name,
      exercises: entries.map((e) =>
        e.type === 'single'
          ? (() => {
              const { type, ...rest } = e
              return { ...rest, restBetweenSets: e.restBetweenSets ?? 30 }
            })()
          : {
              superset: e.exercises.map(({ type, ...rest }) => ({
                ...rest,
                restBetweenSets: rest.restBetweenSets ?? 30,
              })),
              restAfter: e.restAfter,
            }
      ),
    }

    await onSave(payload)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <input
        className="border p-2 w-full"
        placeholder="Template name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="space-y-4">
        {entries.map((entry, idx) =>
          entry.type === 'single' ? (
            <ExerciseRow
              key={idx}
              value={entry}
              exerciseMap={exerciseMap}
              onChange={(next) => setEntries((prev) => prev.map((e, i) => (i === idx ? next : e)))}
              onRemove={() => setEntries((prev) => prev.filter((_, i) => i !== idx))}
            />
          ) : (
            <SupersetBlock
              key={idx}
              value={entry}
              exerciseMap={exerciseMap}
              onChange={(next) => setEntries((prev) => prev.map((e, i) => (i === idx ? next : e)))}
              onRemove={() => setEntries((prev) => prev.filter((_, i) => i !== idx))}
            />
          )
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={addExercise}>Add exercise</Button>
        <Button onClick={addSuperset}>Add superset</Button>
      </div>

      <Button onClick={saveTemplate}>Save template</Button>
    </div>
  )
}
