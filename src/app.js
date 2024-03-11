import compression from 'compression';
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import { checkOverload } from './helpers/check.connect.js';
import routes from './routes/index.js'
const app = express();

// init middleware

app.use(morgan('combined'))

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
// init db
import './dbs/init.mongodb.js'

// checkOverload()
// init router
app.use('/', routes)

app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    stack: error.stack,
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

// handling error

export default app