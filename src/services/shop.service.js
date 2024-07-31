'use strict'
import { BadRequestError } from "../core/error.response.js"
import shopModel from "../models/shop.model.js"
import crypto from 'node:crypto'
import { createTokenPair } from "../auth/authUntils.js"
import KeyTokenService from "./keyToken.service.js"
import { getInfoData, unGetSelectData } from "../utils/index.js"
import bcrypt from 'bcrypt'
import { PutObjectCommand, s3, GetObjectCommand } from "../configs/awsS3.config.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import 'dotenv/config.js'


const findByEmail = async ({ email }) => {
  return await shopModel.findOne({ email }).lean()
}

const findShopById = async ({ _id }) => {
  console.log(_id, typeof _id)
  return await shopModel.findOne({ _id }).select(unGetSelectData(['password']))
}

const getAllShops = async () => {
  let shops = await shopModel.find().select(unGetSelectData(['password'])).lean()
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

  const shop = await findShopById({ _id })
  if (!shop) {
    throw new BadRequestError(`Shop doesn't exist`)
  }
  const commandObject = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: shop.logo
  })
  const urlLogo = await getSignedUrl(s3, commandObject, { expiresIn: 3600 })
  shop.logo = urlLogo
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
const changeAvatar = async ({ userId, logo }) => {
  const shop = await findShopById({ _id: userId })
  if (!shop) {
    throw new BadRequestError('User does not exist')
  }
  const randomName = crypto.randomBytes(16).toString('hex')
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: randomName || 'unknow',
    Body: logo.buffer,
    ContentType: 'image/jpeg',
  })
  const urlLogo = await s3.send(command)
  shop.logo = randomName
  await shop.save()
  return shop
}
const editInformation = async (data) => {
  const shop = await findShopById({ _id: data._id })
  if (!shop) {
    throw new BadRequestError('Shop is not invalid')
  }
  data.map
  const res = await shopModel.findOneAndUpdate({ _id: data._id }, { $set: data }, { upsert: true, new: true })
  console.log(res)
  return res
}
export {
  findByEmail,
  getAllShops,
  createNewShop,
  getShop,
  importManyShops,
  changeAvatar,
  editInformation
}