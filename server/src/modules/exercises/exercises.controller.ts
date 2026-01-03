import { NextFunction, Request, Response } from 'express'

import { getExercises } from './exercises.service'

export const fetchExercises = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const exercises = await getExercises()
    res.json(exercises)
  } catch (error) {
    next(error)
  }
}
