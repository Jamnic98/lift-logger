import type { Workout, WorkoutInput } from 'types/workout'

import { BASE_URL } from 'config/env'

const url = BASE_URL + '/workouts'

export const getAllWorkouts = async (): Promise<Workout[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch workouts')
  return res.json()
}

export const getWorkoutById = async (id: string): Promise<Workout> => {
  const res = await fetch(`${url}/${id}`)
  if (!res.ok) throw new Error('Workout not found')
  return res.json()
}

export const createWorkout = async (data: WorkoutInput): Promise<Workout> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create workout')
  return res.json()
}

export const updateWorkout = async (id: string, data: Partial<WorkoutInput>): Promise<Workout> => {
  const res = await fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update workout')
  return res.json()
}

export const deleteWorkout = async (id: string): Promise<void> => {
  const res = await fetch(`${url}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete workout')
}
