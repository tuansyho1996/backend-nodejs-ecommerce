'use strict'

import keytokenModel from '../models/keytoken.model.js'

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const token = keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })
      // return token ? token.publicKey : null

      const filter = { user: userId }, update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }, option = { upsert: true, new: true }
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, option)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }


  }
}

export default KeyTokenService