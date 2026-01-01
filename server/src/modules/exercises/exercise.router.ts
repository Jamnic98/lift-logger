import { Router } from 'express'

import { fetchExercises } from './exercises.controller'

const router = Router()

router.get('/', fetchExercises)

export default router
