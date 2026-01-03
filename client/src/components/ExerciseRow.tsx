import { useState, useEffect } from 'react'

import { Button } from 'components'
import type { DraftExercise, ExerciseMap, Equipment, BandResistance } from 'types'

export default function ExerciseRow({
  value,
  onChange,
  onRemove,
  exerciseMap,
}: {
  value: DraftExercise
  onChange: (next: DraftExercise) => void
  onRemove: () => void
  exerciseMap: ExerciseMap
}) {
  // Track selected category
  const meta = exerciseMap[value.exerciseKey]
  const defaultCategory = meta?.category ?? Object.values(exerciseMap)[0]?.category ?? ''
  const [category, setCategory] = useState(defaultCategory)

  // Exercises in this category
  const exercisesForCategory = Object.entries(exerciseMap).filter(
    ([_, e]) => e.category === category
  )

  // Ensure exerciseKey exists when category changes
  useEffect(() => {
    if (!value.exerciseKey || !exerciseMap[value.exerciseKey]) {
      const firstExercise = exercisesForCategory[0]
      if (firstExercise) {
        onChange({
          ...value,
          exerciseKey: firstExercise[0],
          equipment: exerciseMap[firstExercise[0]].equipment[0],
        })
      }
    }
  }, [category])

  const currentExerciseMeta = exerciseMap[value.exerciseKey]

  // Determine visible fields
  const getVisibleFields = () => {
    const eq = value.equipment ?? currentExerciseMeta?.equipment?.[0] ?? 'other'
    const key = value.exerciseKey
    const fields: Array<'sets' | 'reps' | 'weight' | 'bandResistance' | 'duration'> = ['sets']

    switch (eq) {
      case 'bodyweight':
        if (key.toLowerCase().includes('plank')) fields.push('duration')
        else fields.push('reps')
        break
      case 'barbell':
      case 'dumbbell':
      case 'kettlebell':
      case 'machine':
        fields.push('reps', 'weight')
        break
      case 'band':
        fields.push('reps', 'bandResistance')
        break
      default:
        fields.push('reps')
    }

    return fields
  }

  const visibleFields = getVisibleFields()

  return (
    <div className="border p-3 gap-3 flex flex-col md:flex-row flex-wrap items-start">
      {/* Category */}
      <div className="flex flex-col">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => {
            const newCat = e.target.value
            setCategory(newCat)
            const first = Object.entries(exerciseMap).find(([_, x]) => x.category === newCat)
            if (!first) return
            onChange({
              ...value,
              exerciseKey: first[0],
              equipment: exerciseMap[first[0]].equipment[0],
            })
          }}
        >
          {Array.from(new Set(Object.values(exerciseMap).map((e) => e.category))).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise */}
      <div className="flex flex-col">
        <label>Exercise</label>
        <select
          value={value.exerciseKey}
          onChange={(e) => {
            const key = e.target.value
            onChange({
              ...value,
              exerciseKey: key,
              equipment: exerciseMap[key].equipment[0],
            })
          }}
        >
          {exercisesForCategory.map(([key, e]) => (
            <option key={key} value={key}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* Equipment */}
      <div className="flex flex-col">
        <label>Equipment</label>
        <select
          value={value.equipment}
          onChange={(e) => onChange({ ...value, equipment: e.target.value as Equipment })}
        >
          {currentExerciseMeta?.equipment.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic fields */}
      {visibleFields.includes('sets') && (
        <div className="flex flex-col">
          <label>Sets</label>
          <input
            type="number"
            value={value.sets}
            onChange={(e) => onChange({ ...value, sets: Number(e.target.value) })}
            className="w-16"
          />
        </div>
      )}
      {visibleFields.includes('reps') && (
        <div className="flex flex-col">
          <label>Reps</label>
          <input
            type="number"
            value={value.reps ?? ''}
            onChange={(e) => onChange({ ...value, reps: Number(e.target.value) })}
            className="w-16"
          />
        </div>
      )}
      {visibleFields.includes('weight') && (
        <div className="flex flex-col">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={value.weight ?? ''}
            onChange={(e) => onChange({ ...value, weight: Number(e.target.value) })}
            className="w-16"
          />
        </div>
      )}
      {visibleFields.includes('bandResistance') && (
        <div className="flex flex-col">
          <label>Band</label>
          <input
            type="text"
            value={value.bandResistance ?? ''}
            onChange={(e) =>
              onChange({ ...value, bandResistance: e.target.value as BandResistance })
            }
            className="w-16"
          />
        </div>
      )}
      {visibleFields.includes('duration') && (
        <div className="flex flex-col">
          <label>Duration (sec)</label>
          <input
            type="number"
            value={value.duration ?? ''}
            onChange={(e) => onChange({ ...value, duration: Number(e.target.value) })}
            className="w-16"
          />
        </div>
      )}

      {/* Rest between sets */}
      <div className="flex flex-col">
        <label>Rest (sec)</label>
        <input
          type="number"
          value={value.restBetweenSets ?? 30}
          onChange={(e) => onChange({ ...value, restBetweenSets: Number(e.target.value) })}
          className="w-16"
        />
      </div>

      <div className="self-end">
        <Button onClick={onRemove}>Remove</Button>
      </div>
    </div>
  )
}
