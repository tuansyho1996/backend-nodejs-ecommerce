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
    const data = await AccessService.login(req.body)
    console.log('check id shop', data.shop._id)
    res.cookie('refreshToken', data.tokens.accessToken, { httpOnly: true, expires: new Date(Date.now() + 260000000) })
    res.cookie('userId', data.shop._id, { httpOnly: true, expires: new Date(Date.now() + 260000000) })
    return new OK({
      message: 'Login success',
      metadata: data
    }).send(res)
  }

  signUp = async (req, res, next) => {
    return new CREATED({
      message: 'Register OK!',
      metadata: await AccessService.signUp(req.body),
    }).send(res)
  }
  // signUp = async (req, res, next) => {
  //   return res.status(201).json(await AccessService.signUp(req.body))
  // }
}


export default new AccessController()