import { useState, useEffect } from 'react'
import { /* Link,  */ Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

import { Button } from 'components'
import { getAllTemplates, getAllWorkouts } from 'api'
import type { Template, Workout } from 'types'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()

  const [, /* error */ setError] = useState<string | null>(null)
  const [, /* loading */ setLoading] = useState(true)

  const [templates, setTemplates] = useState<Template[] | null>(null)
  const [workouts, setWorkouts] = useState<Workout[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, workoutsData] = await Promise.all([
          getAllTemplates(),
          getAllWorkouts(),
        ])
        setTemplates(templatesData)
        setWorkouts(workoutsData)
      } catch (error) {
        setError('Failed to load data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-12">
        <section>
          {/* Recent Templates */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Templates</h2>
            {templates ? (
              <ul className="list-disc pl-5 space-y-1">
                {templates.map((t) => (
                  <li key={t.id}>
                    <Link
                      className="p-0 underline text-blue-400 hover:text-blue-800"
                      to={`/templates/${t.id}`}
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No templates to display</p>
            )}
          </div>
          <div>Number of Templates: {templates?.length ?? 'n/a'}</div>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/templates')} className="cursor-pointer">
              Templates
            </Button>
          </div>
        </section>

        <section>
          {/* Recent Workouts */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Workouts</h2>
            {workouts ? (
              <ul className="list-disc pl-5 space-y-1">
                {workouts.map((w) => (
                  <li key={w.id}>
                    {format(new Date(w.startTime), 'dd/MM/yy')} -
                    <Link
                      className="p-0 underline text-blue-400 hover:text-blue-800"
                      to={`/workouts/run/${w.id}`}
                    >
                      {' '}
                      {w.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No workouts to display</p>
            )}
            <div className="">Number of Workouts: {workouts?.length ?? 'n/a'}</div>
            <Button onClick={() => navigate('/workouts')} className="cursor-pointer">
              Workouts
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
