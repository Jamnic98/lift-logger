import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { WorkoutRunner } from 'components'
import { getTemplateById, getExercises, createWorkout } from 'api'
import type { ExerciseMap } from 'types'

export default function WorkoutRunPage() {
  const navigate = useNavigate()
  const { templateId } = useParams()
  const [loading, setLoading] = useState(true)
  const [exerciseMap, setExerciseMap] = useState<ExerciseMap>({})
  const [workout, setWorkout] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const [exercises, template] = await Promise.all([
        getExercises(),
        getTemplateById(templateId!),
      ])

      setExerciseMap(exercises)

      setWorkout({
        name: template.name,
        exercises: template.exercises,
        startTime: new Date(),
        endTime: undefined,
      })

      setLoading(false)
    }

    load()
  }, [templateId])

  const handleSave = async () => {
    await createWorkout({
      name: workout.name,
      exercises: workout.exercises,
      startTime: workout.startTime,
      endTime: new Date(),
    })
    navigate('/workouts')
  }

  if (loading) return <p>Loading…</p>

  return <WorkoutRunner workout={workout} exerciseMap={exerciseMap} onComplete={handleSave} />
}
