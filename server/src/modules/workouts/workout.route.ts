import { Router } from 'express'

import {
  createWorkout,
  getWorkoutById,
  getAllWorkouts,
  // updateWorkout,
  deleteWorkout,
} from './workout.controller'

const router = Router()

// create workout
router.post('/', async (req, res, next) => {
  try {
    const workout = await createWorkout(req.body)
    res.status(201).json(workout)
  } catch (error) {
    next(error)
  }
})

// fetch workout by id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const workout = await getWorkoutById(id)

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' })
    }

    res.json(workout)
  } catch (error) {
    next(error)
  }
})

// fetch all workouts
router.get('/', async (_req, res, next) => {
  try {
    const workouts = await getAllWorkouts()
    res.json(workouts)
  } catch (error) {
    next(error)
  }
})

// delete workout
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await deleteWorkout(id)

    if (!deleted) {
      return res.send(404).json({ message: 'Workout not found' })
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

export default router
