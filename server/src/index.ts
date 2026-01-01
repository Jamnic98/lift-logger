import { PORT } from 'config/env'
import { connectDB } from 'db'
import app from 'app'

const startServer = async () => {
  await connectDB()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port ${PORT}`)
  })
}

startServer()
