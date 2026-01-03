import { getAllWorkouts } from 'api'
import { useEffect, useState } from 'react'
import type { Workout } from 'types/workout'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function WorkoutOverview() {
  const [, setError] = useState<string | null>(null)
  const [, setLoading] = useState(true)
  const [workouts, setWorkouts] = useState<Workout[] | null>(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workouts = await getAllWorkouts()
        workouts.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        setWorkouts(workouts)
      } catch (error) {
        setError('Failed to load workouts')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  // Group by year → month → optionally day if multiple workouts
  const groupedWorkouts = workouts?.reduce(
    (acc: Record<number, Record<string, Record<string, Workout[]>>>, workout) => {
      const date = new Date(workout.startTime)
      const year = date.getFullYear()
      const month = format(date, 'MMMM') // Only month name now
      const day = format(date, 'dd')

      if (!acc[year]) acc[year] = {}
      if (!acc[year][month]) acc[year][month] = {}
      if (!acc[year][month][day]) acc[year][month][day] = []

      acc[year][month][day].push(workout)
      return acc
    },
    {}
  )

  return (
    <>
      <h1 className="text-xl font-bold mb-4">WorkoutOverview</h1>
      {groupedWorkouts &&
        Object.entries(groupedWorkouts).map(([year, months]) => (
          <div key={year} className="mb-6">
            <h2 className="text-lg font-semibold">{year}</h2>
            {Object.entries(months).map(([month, days]: any) => (
              <div key={month} className="ml-4 mb-4">
                <h3 className="text-md font-medium">{month}</h3>
                {Object.entries(days).map(([day, dayWorkouts]: any) => (
                  <div key={day} className="ml-4 mb-2">
                    {dayWorkouts.length > 1 && <h4 className="font-normal">{day}</h4>}
                    {dayWorkouts.map((workout: Workout) => {
                      const date = new Date(workout.startTime)
                      return (
                        <div key={workout.id} className="ml-4">
                          <Link
                            to={`/workouts/${workout.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {format(date, 'd/M/yy')} {format(date, 'HH:mm')} -{' '}
                            {workout.name || 'Workout'}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
    </>
  )
}
