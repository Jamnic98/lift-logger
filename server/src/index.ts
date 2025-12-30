import express from 'express'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lift-logger'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

try {
  await mongoose.connect(MONGO_URI)
  console.log('MongoDB connected')

  app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`)
  })
} catch (error) {
  console.error('MongoDB connection error:', error)
}
