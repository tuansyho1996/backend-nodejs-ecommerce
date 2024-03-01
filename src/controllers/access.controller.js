'use strict'

import AccessService from "../services/access.service.js";
import { OK, CREATED } from "../core/success.response.js";

class AccessController {
  signUp = async (req, res, next) => {
    return new CREATED({
      message: 'Register OK!',
      metadata: await AccessService.signUp(req.body),
      option: {
        limit: 10
      }
    }).send(res)
  }
  // signUp = async (req, res, next) => {
  //   return res.status(201).json(await AccessService.signUp(req.body))
  // }
}


export default new AccessController()