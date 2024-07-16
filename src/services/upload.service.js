'use strcit'

import cloudinary from "../configs/cloudinary.config.js"
import { s3, PutObjectCommand, GetObjectCommand } from "../configs/awsS3.config.js"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"
import 'dotenv/config.js'
import crypto from 'crypto'

class UploadService {
  static async uploadImageFromUrl() {
    const pathUrl = 'https://i.pinimg.com/236x/68/a8/90/68a890e071199d4c690f6abed9ff61cb.jpg'
    const folderName = 'product/shopId', fileName = 'test'
    const result = await cloudinary.uploader.upload(pathUrl, {
      public_id: fileName,
      folder: folderName
    })
    return result
  }
  static async uploadImageLocal({
    path,
    folderName = 'product/shopId'
  }) {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })
    return ({
      image_url: result.secure_url,
    })
  }
  static async uploadMultiple({
    files,
    folderName = 'product/shopId'
  }) {
    const resultArray = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: `thumb-${i}`,
        folder: folderName
      })
      resultArray.push({
        image_url: result.secure_url
      })
    }
    return resultArray
  }
  static async uploadImageFromLocalS3({
    file,
  }) {
    const cloudfrontDistributionDomain = 'https://d2jfx0w9sp915a.cloudfront.net'
    const randomName = () => crypto.randomBytes(16).toString('hex')
    const imageName = randomName()
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName || 'unknow',
      Body: file.buffer,
      ContentType: 'image/jpeg' //that is what you need
    })
    const result = await s3.send(command)
    // const getObjectCommand = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // })
    // const urlImage = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 })
    // console.log('key::', process.env.AWS_CLOUDFRONT_KEY)
    // const url = getSignedUrl({
    //   url: `${cloudfrontDistributionDomain}/${imageName}`,
    //   keyPairId: process.env.AWS_CLOUDFRONT_KEY,
    //   dateLessThan: '2024-10-10',
    //   privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY_ID,
    // })
    return ({
      url,
      result
    })
  }
}

export default UploadService