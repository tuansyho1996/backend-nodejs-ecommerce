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

import './test/inventory.test.js'
import ProductServiceTest from './test/product.test.js'
ProductServiceTest.purchaseProduct('product:001', 10)
// init db
import './dbs/init.mongodb.js'
import { v4 as uuidv4 } from 'uuid';
import mylogger from './logger/mylogger.logger.js';

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//check logger

// app.use((req, res, next) => {
//   const requestId = req.header['x-request-id']
//   req.requestId = requestId ? requestId : uuidv4()
//   mylogger.log(`input params ::${req.method}`, [
//     req.path,
//     { requestId: req.requestId },
//     req.method === 'POST' ? req.body : req.query
//   ])
//   next()
// })

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
  const resMessage = `${error.status}::${Date.now()}ms - Response::${JSON.stringify(error)}`
  // mylogger.error(resMessage, [
  //   req.path,
  //   { requestId: req.requestId },
  //   {
  //     message: error.message
  //   }
  // ])
  return res.status(statusCode).json({
    status: 'error',
    stack: error.stack,
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

// handling error

export default app