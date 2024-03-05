import shopModel from '../models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import KeyTokenService from './keyToken.service.js'
import { authenticationV2, createTokenPair } from '../auth/authUntils.js'
import { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } from '../core/error.response.js'
import { findByEmail } from './shop.service.js'
import getInfoData from '../utils/index.js'
import { userInfo } from 'node:os'
import JWT from 'jsonwebtoken'

const RoleShop = {
  SHOP: 'SHOP',
  WIRTER: 'WIRTER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}


class AccessService {
  static handleRefreshTokenV2 = async ({ user, keyStore, refreshToken }) => {
    //check refresh token used
    const { userId, email } = user
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeByUserId(userId)
      throw new ForbiddenError('Something wrong happen !! pls relogin')
    }

    // have refresh token in refresh token used
    if (refreshToken !== keyStore.refreshToken) {
      throw new AuthFailureError('Invalid request refresh token')
    }
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new AuthFailureError('Shop not register')
    }
    //create new access token and refresh token
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
    console.log(tokens)
    //update token
    await KeyTokenService.updateByUserId({ userId, oldRefreshToken: refreshToken, newRefreshToken: tokens.refreshToken })
    return {
      user,
      tokens
    }
  }

  /*
    1.check email dbs
    2.match password
    3.create private key,public key and save
    4.generate tokens
    5.get data and return login
  */
  static logout = async (keyToken) => {
    return await KeyTokenService.removeKeyById(keyToken._id)
  }

  static login = async ({ email, password, refreshToken = null }) => {
    //check email dbs
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Error: Not Found Email')
    }
    // match password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new AuthFailureError('Error: Authentication error')
    }
    // create private key,public key and save
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')
    const { _id } = foundShop
    // generate tokens
    const tokens = await createTokenPair(
      { userId: _id, email },
      publicKey,
      privateKey
    )
    await KeyTokenService.createKeyToken({
      userId: _id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
      code: 200,
      shop: getInfoData({ filed: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

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

      const keyStore = await KeyTokenService.createKeyToken({
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
          shop: getInfoData({ filed: ['_id', 'name', 'email'], object: newShop }),
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