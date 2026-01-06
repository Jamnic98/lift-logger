import { WorkoutSubmitForm } from 'components'
import type { ExerciseMap, TrackedExerciseOrGroupInput, Workout } from 'types'

interface WorkoutDetailProps {
  workout: Workout
  exerciseMap: ExerciseMap
  hideSubmitButton?: boolean
  onComplete?: (payload: { name: string; exercises: TrackedExerciseOrGroupInput[] }) => void
}

export default function WorkoutDetail({
  workout,
  exerciseMap,
  hideSubmitButton = false,
  onComplete,
}: WorkoutDetailProps) {
  // Flatten workout exercises for the form
  const entries: TrackedExerciseOrGroupInput[] = workout.exercises.flat().map((e: any) => {
    if (e.superset && Array.isArray(e.superset)) {
      return {
        superset: e.superset.map((ex: any) => ({
          exerciseKey: ex.exerciseKey,
          equipment: ex.equipment,
          sets: ex.sets,
          reps: ex.reps ?? 0,
          weight: ex.weight,
          duration: ex.duration,
          bandResistance: ex.bandResistance,
        })),
        restAfter: e.restAfter,
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
      hideSubmitButton={hideSubmitButton}
      onComplete={() => onComplete?.({ name: workout.name ?? '', exercises: entries })}
    />
  )
}
