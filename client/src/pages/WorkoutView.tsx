import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { WorkoutDetail } from 'components'
import { getWorkoutById, getExercises } from 'api'
import type { ExerciseMap, Workout } from 'types'

export default function WorkoutView() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const [loading, setLoading] = useState(true)
  const [exerciseMap, setExerciseMap] = useState<ExerciseMap>({})
  const [workout, setWorkout] = useState<Workout | null>(null)

  useEffect(() => {
    if (!workoutId) return

    const load = async () => {
      try {
        const [exercises, workoutData] = await Promise.all([
          getExercises(),
          getWorkoutById(workoutId),
        ])

        setExerciseMap(exercises)
        setWorkout(workoutData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [workoutId])

  if (loading) return <p>Loading…</p>
  if (!workout) return <p>Workout not found</p>

  return <WorkoutDetail workout={workout} exerciseMap={exerciseMap} variant="view" />
}
