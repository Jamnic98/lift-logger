import 'dotenv/config'

export const PORT = Number(process.env.PORT) || 5000
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lift-logger'
