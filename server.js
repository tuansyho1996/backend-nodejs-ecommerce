import app from './src/app.js'
import configDB from './src/configs/config.mongodb.js'

const server = app.listen(configDB.app.port, () => {
  console.log(`WSV ecommerce with ${configDB.app.port}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit server Express'))
})