import { WorkoutSubmitForm } from 'components'
import type {
  ExerciseMap,
  SetEntryInput,
  TrackedExerciseOrGroupInput,
  Workout,
  WorkoutFormVariant,
} from 'types'

interface WorkoutDetailProps {
  workout: Workout
  exerciseMap: ExerciseMap
  hideSubmitButton?: boolean
  variant: WorkoutFormVariant
  onComplete?: (payload: { name: string; exercises: TrackedExerciseOrGroupInput[] }) => void
}

export default function WorkoutDetail({
  workout,
  exerciseMap,
  variant,
  onComplete,
}: WorkoutDetailProps) {
  const entries: TrackedExerciseOrGroupInput[] = workout.exercises.flat().map((e: any) => {
    if (e.superset && Array.isArray(e.superset)) {
      return {
        superset: e.superset.map((ex: SetEntryInput & { exerciseKey: 'string' }) => ({
          exerciseKey: ex.exerciseKey,
          equipment: ex.equipment,
          reps: ex.reps ?? 0,
          weight: ex.weight,
          duration: ex.duration,
          bandResistance: ex.bandResistance,
        })),
        restAfter: e.restAfter,
        sets: e.sets,
      }
    } else {
      return {
        exerciseKey: e.exerciseKey,
        equipment: e.equipment,
        sets: e.sets,
        reps: e.reps ?? 0,
        weight: e.weight,
        duration: e.duration,
        bandResistance: e.bandResistance,
        rest: e.rest,
      }
    }
  })

  return (
    <WorkoutSubmitForm
      name={workout.name ?? ''}
      exercises={entries}
      exerciseMap={exerciseMap}
      startTime={new Date(workout.startTime)}
      endTime={workout.endTime ? new Date(workout.endTime) : undefined}
      variant={variant}
      onComplete={() => onComplete?.({ name: workout.name ?? '', exercises: entries })}
    />
  )
}
