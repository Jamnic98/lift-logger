import { WorkoutModel } from './workout.model'
import type { Workout, WorkoutInput } from 'types/workout'

export const createWorkout = async (data: WorkoutInput): Promise<Workout> =>
  (await WorkoutModel.create(data)).toObject()

export const getWorkoutById = async (id: string): Promise<Workout | null> =>
  await WorkoutModel.findById(id)

export const getAllWorkouts = async (): Promise<Workout[]> => await WorkoutModel.find()

// export const updateWorkout = async (id: string, data: Partial<WorkoutInput>) => {}

export const deleteWorkout = async (id: string): Promise<boolean> =>
  (await WorkoutModel.findByIdAndDelete(id)) !== null
