'use strict'

import JWT from 'jsonwebtoken'
import { AuthFailureError, NotFoundError } from '../core/error.response.js'
import KeyTokenService from '../services/keyToken.service.js'
import { Schema } from 'mongoose'
const HEADER = {
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })
    console.log('check access token', accessToken)
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.error('error verify::', error)
      } else {
        console.log('decode verify::', decode)
      }
    })
    return {
      accessToken, refreshToken
    }

  } catch (error) {
    return error.message
  }
}
const authenticationV2 = async (req, res, next) => {
  /*
  1.Check userId missing
  2.check user in dbs
  3.Get refresh token 
  4.Verify token
  5.Check keyStore with this userId
  6. ok all => return next
  */
  //  1.
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw new AuthFailureError('Invalid request not have userId')
  }
  // 2.
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundError('Not Found userId in key dbs')
  }
  // 3.
  const refreshToken = req.headers[HEADER.AUTHORIZATION]
  if (!refreshToken) {
    throw new AuthFailureError('Invalid request')
  }
  // 4.

  try {
    const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
    if (decodeUser.userId !== userId) {
      throw new AuthFailureError('Invalid userId')
    }
    req.keyStore = keyStore
    req.decodeUser = decodeUser
    req.refreshToken = refreshToken
    return next()
  } catch (error) {
    throw error
  }

}

// const authentication = async (req, res, next) => {
//   /*
//   1.Check userId missing
//   2.check user in dbs
//   3.Get access token 
//   4.Verify token
//   5.Check keyStore with this userId
//   6. ok all => return next
//   */
//   //  1.
//   const userId = req.headers[HEADER.CLIENT_ID]
//   if (!userId) {
//     throw new AuthFailureError('Invalid request not have userId')
//   }
//   // 2.
//   const keyStore = await KeyTokenService.findByUserId(userId)
//   if (!keyStore) {
//     throw new NotFoundError('Not Found userId in key dbs')
//   }
//   // 3.
//   const accessToken = req.headers[HEADER.AUTHORIZATION]
//   if (!accessToken) {
//     throw new AuthFailureError('Invalid request')
//   }
//   // 4.
//   console.log('check decode', accessToken, keyStore.publicKey)

//   try {
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
//     if (decodeUser.userId !== userId) {
//       throw new AuthFailureError('Invalid userId')
//     }
//     console.log('ok decode')
//     req.keyStore = keyStore
//     return next()
//   } catch (error) {
//     return error
//   }

// }
export {
  createTokenPair,
  // authentication,
  authenticationV2
}