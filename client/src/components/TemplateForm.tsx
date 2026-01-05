import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save } from 'lucide-react'

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
  const [entries, setEntries] = useState<DraftEntry[]>(
    initialEntries.map((e) => ({ ...e, id: uuidv4() }))
  )

  // Adds a single exercise with defaults
  const addExercise = () => {
    const firstKey = Object.keys(exerciseMap)[0]
    if (!firstKey) return

    setEntries((prev) => [
      ...prev,
      {
        id: uuidv4(), // unique ID
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
        id: uuidv4(),
        type: 'superset',
        sets: 3,
        exercises: [
          {
            id: uuidv4(), // optional for inner exercises
            type: 'single',
            exerciseKey: firstKey,
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
              const { type, id, ...rest } = e
              return { ...rest, restBetweenSets: e.restBetweenSets ?? 30 }
            })()
          : {
              superset: e.exercises.map(({ type, id, ...rest }) => ({
                ...rest,
              })),
              sets: e.sets ?? 3,
              restAfter: e.restAfter ?? 30,
            }
      ),
    }

    await onSave(payload)
  }

  return (
    <div className="p-6 space-y-8">
      <input
        className="border-b outline-none p-2 w-full mb-6"
        placeholder="Template name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Buttons container is just another item in the flex-col with the same gap */}
      <div className="flex flex-row justify-between">
        <div className="flex space-x-2">
          <Button onClick={addExercise} className="flex space-x-2">
            <Plus />
            <span>exercise</span>
          </Button>
          <Button onClick={addSuperset} className="flex space-x-2">
            <Plus />
            <span> superset</span>
          </Button>
        </div>
        <Button onClick={saveTemplate} variant="success" className="flex space-x-2">
          <Save />
          <span>Save template</span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id} // stable key
              layout // enables smooth vertical movement
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {entry.type === 'single' ? (
                <ExerciseRow
                  value={entry}
                  exerciseMap={exerciseMap}
                  onChange={(next) =>
                    setEntries((prev) => prev.map((e) => (e.id === entry.id ? next : e)))
                  }
                  onRemove={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                />
              ) : (
                <SupersetBlock
                  value={entry}
                  exerciseMap={exerciseMap}
                  onChange={(next) =>
                    setEntries((prev) => prev.map((e) => (e.id === entry.id ? next : e)))
                  }
                  onRemove={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
