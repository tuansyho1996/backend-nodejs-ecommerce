'use strict'

import keytokenModel from '../models/keytoken.model.js'

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const token = keytokenModel.create({
        user: userId,
        publicKey,
        privateKey
      })

      return token ? token.publicKey : null
    } catch (error) {
      return error
    }
  }
}

export default KeyTokenService