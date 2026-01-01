import fs from 'fs/promises'

import { EXERCISES_PATH } from 'config/constants'

export const getExercises = async () => {
  const data = await fs.readFile(EXERCISES_PATH, 'utf-8')
  return JSON.parse(data)
}
