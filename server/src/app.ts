import express from 'express'

import { errorMiddleware } from 'middlewares/error.middleware'
import exercisesRouter from 'modules/exercises/exercise.router'
import templateRouter from 'modules/templates/template.route'
import workoutRouter from 'modules/workouts/workout.route'

const app = express()

app.use(express.json())

// Routers
app.use('/exercises', exercisesRouter)
app.use('/templates', templateRouter)
app.use('/workouts', workoutRouter)

// Middleware
app.use(errorMiddleware)

export default app
