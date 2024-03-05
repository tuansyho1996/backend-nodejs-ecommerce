'use strict'

import keytokenModel from '../models/keytoken.model.js'
import { Types } from 'mongoose'

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {

    const filter = { user: userId }, update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }, option = { upsert: true, new: true }
    const token = await keytokenModel.findOneAndUpdate(filter, update, option)
    return token ? token.publicKey : null

  }
  static findByUserId = async (userId) => {
    const token = await keytokenModel.findOne({ user: userId }).lean()
    return token
  }
  static removeKeyById = async (_id) => {
    return await keytokenModel.deleteOne({ _id })
  }
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
  }
  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken })
  }
  static removeByUserId = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId })
  }
  static updateByUserId = async ({ userId, oldRefreshToken, newRefreshToken }) => {
    return await keytokenModel.findOneAndUpdate(
      { user: userId },
      {
        $set: { refreshToken: newRefreshToken },
        $addToSet: { refreshTokenUsed: oldRefreshToken }
      }
    )
  }
}

export default KeyTokenService