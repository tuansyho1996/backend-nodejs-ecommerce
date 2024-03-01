
import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect.js"
import configDB from "../configs/config.mongodb.js"

const connectString = `mongodb://${configDB.db.host}:${configDB.db.port}/shop-clothing`;

class Database {
  constructor() {
    this.connect()
  }
  //connect
  connect(type = 'mongodb') {

    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose.connect(connectString).then(() => {
      console.log(`Connect mongodb success ${configDB.db.name}`, countConnect())
    })
      .catch(err => console.log('Error connect!', err))
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}
const instanceMongodb = Database.getInstance()

export default instanceMongodb