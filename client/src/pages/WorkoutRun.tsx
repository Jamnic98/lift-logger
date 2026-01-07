import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { WorkoutDetail } from 'components'
import { getTemplateById, getExercises, createWorkout } from 'api'
import type { ExerciseMap, TrackedExerciseOrGroupInput } from 'types'

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

      // Map template to workout-like structure
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

  const handleSave = async (payload: {
    name: string
    exercises: TrackedExerciseOrGroupInput[]
  }) => {
    await createWorkout({ ...payload, startTime: new Date() })
    navigate('/workouts')
  }

  if (loading) return <p>Loading…</p>

  return (
    <WorkoutDetail
      workout={workout}
      exerciseMap={exerciseMap}
      hideSubmitButton={false}
      variant="create"
      onComplete={handleSave}
    />
  )
}
