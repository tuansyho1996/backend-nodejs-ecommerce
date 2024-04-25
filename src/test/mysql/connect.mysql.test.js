import mysql from 'mysql2'

//create connection to pool server
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'rootpass',
  database: 'ecommerce'
})

const batchSize = 10 //adjust batch size
const totalSize = 1000 // adjust total size

let currentId = 1
console.time('::TIMES::')
const insertBatch = () => {

  const values = []
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `Name ${currentId}`
    const age = currentId
    const address = `Address ${currentId}`
    values.push([currentId, name, age, address])
    currentId++
  }
  if (!values.length) {
    console.timeEnd('::TIMES::')

    pool.end(err => {
      if (err) {
        console.log('error occurred while running batch')
      }
      else {
        console.log('connection pool closed successfully')
      }
    })
    return;
  }
  console.log('values', values)
  const sql = `INSERT INTO user(id,username,age,address) VALUES ?`
  pool.query(sql, [values], (err, result) => {
    if (err) throw err
    console.log(`Insert ${result.affectedRows} records`)
    insertBatch()
  })
}

insertBatch()

// pool.query('SELECT * from user', (err, results) => {
//   if (err) throw err

//   console.log('query result', results)
//   //close pool connection
//   pool.end(err => {
//     if (err) throw err
//     console.log('connection closed:')
//   })
// })