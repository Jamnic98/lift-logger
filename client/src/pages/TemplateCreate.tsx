import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TemplateForm } from 'components'
import { createTemplate, getExercises } from 'api'
import type { ExerciseMap } from 'types'

export default function TemplateCreate() {
  const navigate = useNavigate()
  const [exerciseMap, setExerciseMap] = useState<ExerciseMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const exercises = await getExercises()
      setExerciseMap(exercises)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p>Loading…</p>

  return (
    <TemplateForm
      exerciseMap={exerciseMap}
      onSave={async (payload) => {
        await createTemplate(payload)
        navigate('/templates')
      }}
    />
  )
}
