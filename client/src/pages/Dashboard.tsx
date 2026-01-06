import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FileText, Activity } from 'lucide-react'

import { getAllTemplates, getAllWorkouts } from 'api'
import type { Template, Workout } from 'types'

export default function Dashboard() {
  const [, setError] = useState<string | null>(null)
  const [, setLoading] = useState(true)
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
      } catch (err) {
        setError('Failed to load data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-16">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Templates Section */}
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <Link
            to="/templates"
            className="flex items-center space-x-2 text-lg font-semibold text-blue-500 hover:text-blue-700"
          >
            <FileText className="w-5 h-5" />
            <span>Templates</span>
          </Link>
          <span className="text-gray-500 text-sm">Saved: {templates?.length ?? 0}</span>
        </header>

        <div>
          {templates && templates.length > 0 ? (
            <ul className="space-y-1">
              {templates.map((t) => (
                <li key={t.id} className="flex items-center space-x-2">
                  <Link
                    to={`/templates/${t.id}`}
                    className="text-gray-800 hover:text-blue-600 truncate"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent templates</p>
          )}
        </div>
      </section>

      {/* Workouts Section */}
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <Link
            to="/workouts"
            className="flex items-center space-x-2 text-lg font-semibold text-blue-500 hover:text-blue-700"
          >
            <Activity className="w-5 h-5" />
            <span>Workouts</span>
          </Link>
          <span className="text-gray-500 text-sm">Completed: {workouts?.length ?? 0}</span>
        </header>

        <div>
          {workouts && workouts.length > 0 ? (
            <ul className="space-y-1">
              {workouts.map((w) => (
                <li key={w.id} className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">
                    {format(new Date(w.startTime), 'dd/MM/yy')}
                  </span>
                  <Link
                    to={`/workouts/run/${w.id}`}
                    className="text-gray-800 hover:text-blue-600 truncate"
                  >
                    {w.name ?? 'Workout'}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent workouts</p>
          )}
        </div>
      </section>
    </div>
  )
}
