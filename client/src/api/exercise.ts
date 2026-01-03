import { BASE_URL } from 'config/env'

const url = BASE_URL + '/exercises'

export const getExercises = async () => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  return data
}
