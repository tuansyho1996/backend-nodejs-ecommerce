'use strict'

import AccessService from "../services/access.service.js";
import { OK, CREATED } from "../core/success.response.js";

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    return new OK({
      message: 'Get token success',
      metadata: await AccessService.handleRefreshTokenV2({ user: req.decodeUser, keyStore: req.keyStore, refreshToken: req.refreshToken })
    }).send(res)
  }
  logout = async (req, res, next) => {
    return new OK({
      message: 'Lotout success',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }
  login = async (req, res, next) => {
    return new OK({
      message: 'Login success',
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

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