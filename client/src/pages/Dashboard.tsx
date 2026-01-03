import { useState, useEffect } from 'react'
import { /* Link,  */ useNavigate } from 'react-router-dom'

import { Button } from 'components'
import { getAllTemplates, getAllWorkouts } from 'api'
import type { Template, Workout } from 'types'

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
      <div className="space-y-6">
        {/* Stats */}
        <div className="flex gap-6">
          <div className="">Templates: {templates?.length ?? 'n/a'}</div>
          <div className="">Completed Workouts: {workouts?.length ?? 'n/a'}</div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button onClick={() => navigate('/templates/create')} className="cursor-pointer">
            Create a Template
          </Button>
          <Button onClick={() => navigate('/templates')} className="cursor-pointer">
            View Templates
          </Button>
        </div>

        {/* Recent Templates */}
        {/* <div>
        <h2 className="text-lg font-semibold mb-2">Recent Templates</h2>
        <ul className="list-disc pl-5 space-y-1">
          {recentTemplates.map((t) => (
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
      </div> */}

        {/* Recent Workouts */}
        {/* <div>
        <h2 className="text-lg font-semibold mb-2">Recent Workouts</h2>
        <ul className="list-disc pl-5 space-y-1">
          {recentWorkouts.map((w) => (
            <li key={w.id}>
              <Link
                className="p-0 underline text-blue-400 hover:text-blue-800"
                to={`/workouts/run/${w.id}`}
              >
                {w.templateName} ({w.date})
              </Link>
            </li>
          ))}
        </ul>
      </div> */}
      </div>
    </>
  )
}
