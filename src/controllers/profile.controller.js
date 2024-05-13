'use strict'

import { OK } from "../core/success.response.js"
const profiles = [
  {
    name: 'CR7',
    age: 39
  },
  {
    name: 'MESSI',
    age: 37
  },
  {
    name: 'TUAN',
    age: 29
  },
]

class ProfileController {
  profiles = (req, res, next) => {
    return new OK({
      message: 'View all profiles',
      metadata: profiles
    }).send(res)
  }
  profile = (req, res, next) => {
    return new OK({
      message: 'view own profile',
      metadata: {
        name: 'TUAN',
        age: 29
      }
    }).send(res)
  }
}
export default new ProfileController()