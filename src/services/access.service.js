import shopModel from '../models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import KeyTokenService from './keyToken.service.js'
import { createTokenPair } from '../auth/authUntils.js'
import { BadRequestError, ConflictRequstError } from '../core/error.response.js'

const RoleShop = {
  SHOP: 'SHOP',
  WIRTER: 'WIRTER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {

    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Error: Shop already register')
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })
    if (newShop) {
      //create private key and public key
      const publicKey = crypto.randomBytes(64).toString('hex')
      const privateKey = crypto.randomBytes(64).toString('hex')

      const keyStore = KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })
      if (!keyStore) {
        throw new BadRequestError('Error: Key Store Error')
      }
      // create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
      return {
        code: 201,
        metadata: {
          shop: newShop,
          tokens
        }
      }
    }
    return {
      code: 200,
      metadata: null
    }

  }
}
export default AccessService