import { useState, useEffect } from 'react'
import { Trash } from 'lucide-react'

import { Button } from 'components'
import {
  type DraftExercise,
  type ExerciseMap,
  type Equipment,
  type BandResistance,
  BandResistanceEnum,
} from 'types'

export default function ExerciseRow({
  value,
  hideSets = false,
  hideRest = false,
  onChange,
  onRemove,
  exerciseMap,
}: {
  value: DraftExercise
  hideSets?: boolean
  hideRest?: boolean
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
    <div className="flex w-full items-center gap-4 border p-3">
      <div className="flex flex-1 gap-3 flex-wrap">
        {/* Category */}
        <div className="flex flex-col w-37.5">
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
            className="w-full"
          >
            {Array.from(new Set(Object.values(exerciseMap).map((e) => e.category))).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise */}
        <div className="flex flex-col w-55">
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
            className="w-full"
          >
            {exercisesForCategory.map(([key, e]) => (
              <option key={key} value={key}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div className="flex flex-col w-35">
          <label>Equipment</label>
          <select
            value={value.equipment}
            onChange={(e) => onChange({ ...value, equipment: e.target.value as Equipment })}
            className="w-full"
          >
            {currentExerciseMeta?.equipment.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic numeric fields */}
        {!hideSets && visibleFields.includes('sets') && (
          <div className="flex flex-col w-20">
            <label>Sets</label>
            <input
              type="number"
              value={value.sets}
              min={1}
              onChange={(e) => onChange({ ...value, sets: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        )}

        {visibleFields.includes('reps') && (
          <div className="flex flex-col w-20">
            <label>Reps</label>
            <input
              type="number"
              value={value.reps ?? '8'}
              min={1}
              onChange={(e) => onChange({ ...value, reps: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        )}

        {visibleFields.includes('weight') && (
          <div className="flex flex-col w-25">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={value.weight ?? ''}
              min={0.5}
              step={0.5}
              onChange={(e) => onChange({ ...value, weight: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        )}

        {visibleFields.includes('bandResistance') && (
          <div className="flex flex-col w-30">
            <label>Band</label>
            <select
              value={value.bandResistance ?? ''}
              onChange={(e) =>
                onChange({ ...value, bandResistance: e.target.value as BandResistance })
              }
              className="w-full"
            >
              <option value="" disabled>
                Select
              </option>
              {BandResistanceEnum.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>
        )}

        {visibleFields.includes('duration') && (
          <div className="flex flex-col w-22">
            <label>Duration (s)</label>
            <input
              type="number"
              value={value.duration ?? ''}
              min={1}
              onChange={(e) => onChange({ ...value, duration: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        )}

        {!hideRest && (
          <div className="flex flex-col w-25">
            <label>Rest (sec)</label>
            <input
              type="number"
              value={value.rest ?? 30}
              min={5}
              step={5}
              onChange={(e) => onChange({ ...value, rest: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Remove button */}
      <div>
        <Button onClick={onRemove} variant="danger" className="p-2">
          <Trash />
        </Button>
      </div>
    </div>
  )
}
