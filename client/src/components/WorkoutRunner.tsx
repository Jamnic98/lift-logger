import { useEffect, useState, useRef } from 'react'
import { Button } from 'components'
import type { ExerciseMap, TemplateExerciseInput, WorkoutInput } from 'types'
import { getVisibleFields } from 'utils/helpers'

interface Step {
  type: 'exercise' | 'rest'
  exercise?: TemplateExerciseInput | TemplateExerciseInput[]
  isSuperset?: boolean
  duration?: number // for rest
}

interface WorkoutRunnerProps {
  workout: WorkoutInput
  exerciseMap: ExerciseMap
  onComplete: () => Promise<void>
}

export default function WorkoutRunner({ workout, exerciseMap, onComplete }: WorkoutRunnerProps) {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [stopwatch, setStopwatch] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(0)
  const stopwatchRef = useRef<ReturnType<typeof setInterval>>(0)

  // Flatten template into steps
  useEffect(() => {
    const s: Step[] = []

    workout.exercises.forEach((e: any) => {
      if ('superset' in e && Array.isArray(e.superset)) {
        for (let i = 0; i < e.sets; i++) {
          s.push({ type: 'exercise', exercise: e.superset, isSuperset: true })
          if (e.restAfter) s.push({ type: 'rest', duration: e.restAfter })
        }
      } else {
        for (let i = 0; i < (e.sets ?? 1); i++) {
          s.push({ type: 'exercise', exercise: e, isSuperset: false })
          if (e.rest) s.push({ type: 'rest', duration: e.rest })
        }
      }
    })

    setSteps(s)
  }, [workout.exercises])

  // Start global stopwatch
  useEffect(() => {
    stopwatchRef.current = setInterval(() => setStopwatch((s) => s + 1), 1000)
    return () => clearInterval(stopwatchRef.current!)
  }, [])

  // Handle timers
  useEffect(() => {
    const step = steps[currentStep]
    if (!step) return

    clearInterval(timerRef.current!)

    if (
      step.type === 'rest' ||
      (step.type === 'exercise' &&
        step.exercise &&
        !Array.isArray(step.exercise) &&
        (step.exercise as any).duration)
    ) {
      const duration =
        step.type === 'rest'
          ? (step.duration ?? 30)
          : ((step.exercise as TemplateExerciseInput).duration ?? 30)
      setTimer(duration)

      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!)
            nextStep()
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      setTimer(0)
    }

    return () => clearInterval(timerRef.current!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, steps])

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
    else onComplete()
  }

  if (!steps.length) return <p>Loading workout…</p>

  const step = steps[currentStep]

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-4">
          <span className="font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="font-medium">Total: {stopwatch}s</span>
          {timer > 0 && (
            <span className="font-medium">
              {step.type === 'rest' ? `Rest: ${timer}s` : `Duration: ${timer}s`}
            </span>
          )}
        </div>
      </div>

      {/* Rest step */}
      {step.type === 'rest' && (
        <div className="border p-6 rounded-lg shadow bg-gray-50 text-center">
          <p className="text-lg font-semibold">Rest</p>
          <p className="text-3xl font-bold my-4">{timer}s</p>
          <Button onClick={nextStep} className="px-6 py-2">
            Skip Rest
          </Button>
        </div>
      )}

      {/* Exercise step */}
      {step.type === 'exercise' && step.exercise && (
        <div className="space-y-4">
          {step.isSuperset && <p className="font-semibold text-lg">Superset</p>}
          {(step.isSuperset
            ? (step.exercise as TemplateExerciseInput[])
            : [step.exercise as TemplateExerciseInput]
          ).map((ex: TemplateExerciseInput, i) => {
            const fields = getVisibleFields(ex).filter((f) => f !== 'sets' && f !== 'rest')
            return (
              <div key={i} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-lg font-medium">
                      {exerciseMap[ex.exerciseKey]?.label ?? ex.exerciseKey}
                    </p>
                    <p className="text-sm italic text-gray-500">{ex.equipment}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 font-semibold">
                  {fields.map((f) => {
                    const value = (ex as any)[f]
                    if (value === undefined || value === null) return null
                    switch (f) {
                      case 'reps':
                        return (
                          <span key={f} className="bg-blue-100 px-3 py-1 rounded">
                            Reps: {value}
                          </span>
                        )
                      case 'weight':
                        return (
                          <span key={f} className="bg-green-100 px-3 py-1 rounded">
                            Weight: {value}kg
                          </span>
                        )
                      case 'duration':
                        return (
                          <span key={f} className="bg-purple-100 px-3 py-1 rounded">
                            Duration: {value}s
                          </span>
                        )
                      case 'bandResistance':
                        return (
                          <span key={f} className="bg-yellow-100 px-3 py-1 rounded">
                            Band: {value}
                          </span>
                        )
                    }
                  })}
                </div>
              </div>
            )
          })}
          <div className="flex justify-end mt-4">
            <Button onClick={nextStep}>Complete</Button>
          </div>
        </div>
      )}
    </div>
  )
}
