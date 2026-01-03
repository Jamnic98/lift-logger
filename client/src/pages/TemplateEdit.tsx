import { useEffect, useState } from 'react'
import { /* useNavigate */ useParams } from 'react-router-dom'

// import { TemplateForm } from 'components'
import { getExercises, getTemplateById /* updateTemplate */ } from 'api'
import type { ExerciseMap /*DraftEntry, TemplateInput */ } from 'types'

export default function TemplateEdit() {
  // const navigate = useNavigate()
  const { templateId } = useParams()
  const [, /* exerciseMap */ setExerciseMap] = useState<ExerciseMap>({})
  // const [entries, setEntries] = useState<DraftEntry[]>([])
  const [, /* templateName */ setTemplateName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [exercises, templateData] = await Promise.all([
          getExercises(),
          getTemplateById(templateId!),
        ])
        setExerciseMap(exercises)

        // map backend TemplateEntry[] → frontend DraftEntry[]
        // const mappedEntries: DraftEntry[] = templateData.exercises.map((e) =>
        //   'superset' in e
        //     ? { type: 'superset', exercises: e.superset, restAfter: e.restAfter }
        //     : { type: 'single', ...e }
        // )

        // setEntries(mappedEntries)
        setTemplateName(templateData.name)
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [templateId])

  if (loading) return <p>Loading…</p>

  return null
  // <TemplateForm
  //   initialName={templateName}
  //   initialEntries={entries}
  //   exerciseMap={exerciseMap}
  //   onSave={async (draftEntries, name) => {
  //     // map DraftEntry[] → TemplateEntry[] for API
  //     const payload: TemplateInput = {
  //       name,
  //       exercises: draftEntries.map(
  //         (e) => (e.type === 'superset' ? { superset: e.exercises, restAfter: e.restAfter } : e) // single exercise
  //       ),
  //     }

  //     await updateTemplate(templateId!, payload)
  //     navigate('/templates')
  //   }}
  // />
}
