'use strcit'

import cloudinary from "../configs/cloudinary.config.js"

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
}

export default UploadService