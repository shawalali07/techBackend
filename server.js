import express from 'express' //ES Modules
const app = express()
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import pkg from 'express-fileupload'
const fileUpload = pkg
import cloudinary from 'cloudinary'

// Body parser
app.use(express.json())

// Load env vars
import { config } from 'dotenv'
config()

// Cloudinary configuration settings
// This will be fetched from the .env file in the root directory
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

// Db connectivity file
import connectDB from './config/db.js'
connectDB()

app.use(
  fileUpload({
    useTempFiles: true,
    // tempFileDir: '/tmp/',
    // createParentPath: true
  })
)

app.use(cors())

// Route files
import userRoute from './routes/userRoute.js'
import questionRoute from './routes/questionRoute.js'
import answerRoute from './routes/answerRoute.js'
import knowledgeRoute from './routes/knowledgeRoute.js'
import snippetRoute from './routes/snippetRoute.js'
import adminRoute from './routes/adminRoute.js'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  //it gives us the http methods and status
  app.use(morgan('dev'))
}

// Mount router
app.use('/api/users', userRoute)
app.use('/api/questions', questionRoute)
app.use('/api/answers', answerRoute)
app.use('/api/knowledge', knowledgeRoute)
app.use('/api/snippets', snippetRoute)
app.use('/api/admin', adminRoute)

//Custom Middleware
app.use(notFound)
app.use(errorHandler)

// Server connectivity

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
      .yellow.bold
  )
)
