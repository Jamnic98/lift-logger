import dotenv from 'dotenv'

dotenv.config({ path: '.env.development' })

export const PORT = Number(process.env.PORT) || 5000
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lift-logger'
