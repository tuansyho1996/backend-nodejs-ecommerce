
import mongoose from "mongoose"
import os from "os"
import process from "process"

const _SECONDS = 5000

//check number of connection
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections: ${numConnection}`)
}

//check overload

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum number of connections based on number osf cores
    const maxConnection = numCores * 5
    console.log(`Number cores : ${numCores}`)
    console.log(`Active connection: ${numConnection}`);
    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`)
    if (numConnection > maxConnection) {
      console.log(`Connection overload detected`)
    }
  }, _SECONDS)

}

export {
  countConnect,
  checkOverload
}


