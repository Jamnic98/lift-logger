import type { ExerciseMap, Workout } from 'types'
import { formatDateTime, getVisibleFields } from 'utils/helpers'

interface WorkoutDetailProps {
  workout: Workout
  exerciseMap: ExerciseMap
}

export default function WorkoutDetail({ workout, exerciseMap }: WorkoutDetailProps) {
  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      {/* Workout header */}
      <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
      <p className="text-gray-500 text-sm">
        Completed on: {formatDateTime(workout.startTime, true)}
        {workout.endTime && ` - ${formatDateTime(workout.endTime, false)}`}
      </p>

      <div className="space-y-6">
        {workout.exercises.map((entry, eIdx) => {
          const isSuperset = 'superset' in entry
          const items = isSuperset ? (entry.superset ?? []) : [entry]

          return (
            <div
              key={eIdx}
              className={`rounded-xl p-4 border ${
                isSuperset ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-gray-50'
              } shadow-sm`}
            >
              {/* Superset header */}
              {isSuperset && (
                <div className="mb-3 flex justify-between items-center">
                  <p className="font-semibold text-indigo-700">Superset</p>
                  <div className="flex gap-4 text-indigo-600 text-sm">
                    <span>Sets: {entry.sets ?? 1}</span>
                    <span>Rest: {entry.restAfter ?? 30}s</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {items.map((ex: any, exIdx) => {
                  let visibleFields = getVisibleFields(ex)
                  if (isSuperset)
                    visibleFields = visibleFields.filter((f) => f !== 'sets' && f !== 'rest')

                  // Single exercise: render directly
                  if (!isSuperset) {
                    return (
                      <div key={exIdx} className="flex flex-col gap-1">
                        <p className="font-medium text-gray-800">
                          {exerciseMap[ex.exerciseKey]?.label ?? ex.exerciseKey}
                        </p>
                        {ex.equipment && (
                          <p className="text-sm italic text-gray-500">{ex.equipment}</p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-1 text-sm font-medium">
                          {visibleFields.map((f) => {
                            const value = (ex as any)[f] ?? '-'
                            switch (f) {
                              case 'reps':
                                return (
                                  <span key={f} className="text-indigo-600">
                                    Reps: {value}
                                  </span>
                                )
                              case 'weight':
                                return (
                                  <span key={f} className="text-green-600">
                                    Weight: {value}kg
                                  </span>
                                )
                              case 'duration':
                                return (
                                  <span key={f} className="text-purple-600">
                                    Duration: {value}s
                                  </span>
                                )
                              case 'bandResistance':
                                return (
                                  <span key={f} className="text-pink-600">
                                    Band: {value}
                                  </span>
                                )
                              case 'sets':
                                return (
                                  <span key={f} className="text-gray-700">
                                    Sets: {value}
                                  </span>
                                )
                              case 'rest':
                                return (
                                  <span key={f} className="text-gray-500">
                                    Rest: {value}s
                                  </span>
                                )
                            }
                          })}
                        </div>
                      </div>
                    )
                  }

                  // Superset: keep the inner card
                  return (
                    <div
                      key={exIdx}
                      className="rounded-lg p-3 border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium text-gray-800">
                            {exerciseMap[ex.exerciseKey]?.label ?? ex.exerciseKey}
                          </p>
                          {ex.equipment && (
                            <p className="text-sm italic text-gray-500">{ex.equipment}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-1 text-sm font-medium">
                        {visibleFields.map((f) => {
                          const value = (ex as any)[f] ?? '-'
                          switch (f) {
                            case 'reps':
                              return (
                                <span key={f} className="text-indigo-600">
                                  Reps: {value}
                                </span>
                              )
                            case 'weight':
                              return (
                                <span key={f} className="text-green-600">
                                  Weight: {value}kg
                                </span>
                              )
                            case 'duration':
                              return (
                                <span key={f} className="text-purple-600">
                                  Duration: {value}s
                                </span>
                              )
                            case 'bandResistance':
                              return (
                                <span key={f} className="text-pink-600">
                                  Band: {value}
                                </span>
                              )
                            case 'sets':
                              return (
                                <span key={f} className="text-gray-700">
                                  Sets: {value}
                                </span>
                              )
                            case 'rest':
                              return (
                                <span key={f} className="text-gray-500">
                                  Rest: {value}s
                                </span>
                              )
                          }
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
