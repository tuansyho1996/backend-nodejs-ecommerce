'use strict'
import { BadRequestError } from "../core/error.response.js"
import shopModel from "../models/shop.model.js"
import crypto from 'node:crypto'
import { createTokenPair } from "../auth/authUntils.js"
import KeyTokenService from "./keyToken.service.js"
import { getInfoData } from "../utils/index.js"
import bcrypt from 'bcrypt'
import { PutObjectCommand, s3, GetObjectCommand } from "../configs/awsS3.config.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import 'dotenv/config.js'


const findByEmail = async ({ email, select = {
  email: 1, name: 1, password: 1, status: 1, roles: 1
} }) => {
  return await shopModel.findOne({ email }).select(select).lean()
}

const findShopById = async ({ _id, select = { email: 1, name: 1, status: 1, roles: 1 } }) => {
  return await shopModel.findOne({ _id }).select(select).lean()
}

const getAllShops = async () => {
  let shops = await shopModel.find().select({ name: 1, email: 1, logo: 1 })
  // shops = await Promise.all(
  //   shops.map(async (shop) => {
  //     const commandObject = new GetObjectCommand({
  //       Bucket: process.env.AWS_BUCKET_NAME,
  //       Key: shop.logo,
  //     })
  //     shop.logo = await getSignedUrl(s3, commandObject, { expiresIn: 3600 })
  //     return shop
  //   })
  // )
  return shops
}

const createNewShop = async (data) => {

  const { email, name, password, logo } = data
  const isShop = await findByEmail({ email })

  if (isShop) {
    throw new BadRequestError('Email already exists, please select another email')
  }
  const randomName = () => crypto.randomBytes(16).toString('hex')
  const imageName = randomName()
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName || 'unknow',
    Body: logo.buffer,
    ContentType: 'image/jpeg'
  })
  const result = await s3.send(command)

  const objectCommand = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName
  })

  const hashPassword = await bcrypt.hash(password, 10)
  const newShop = await shopModel.create({ name, email, password: hashPassword, logo: imageName })

  if (newShop) {
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')
    const tokens = await createTokenPair({ userId: newShop._id, email: data.email }, publicKey, privateKey)
    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken
    })
    if (!keyStore) {
      throw new BadRequestError('Error: Key store error')
    }
    return {
      shop: getInfoData({ filed: ['_id', 'name', 'email'], object: newShop }),
      tokens
    }
  }
  return {
    code: 200,
    metadata: null
  }
}
const getShop = async (_id) => {
  const shop = findShopById({ _id })
  if (!shop) {
    throw new BadRequestError(`Shop doesn't exist`)
  }
  return shop
}
const importManyShops = async (data) => {
  const password = '123456'
  const hashPassword = await bcrypt.hash(password, 10)
  data.map((item, index) => {
    item.email = `${item.email}${index}`
    item.password = hashPassword
    return item
  })
  console.log(data)
  const res = await shopModel.insertMany(data)
  return {
    message: 'call success'
  }
}
export {
  findByEmail,
  getAllShops,
  createNewShop,
  getShop,
  importManyShops
}