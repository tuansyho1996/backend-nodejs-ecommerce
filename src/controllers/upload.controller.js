'use strict'

import { BadRequestError } from "../core/error.response.js";
import { OK, CREATED } from "../core/success.response.js";
import uploadService from "../services/upload.service.js";
import { s3 } from "../configs/awsS3.config.js";

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    return new OK({
      message: 'Image uploaded successfully',
      metadata: await uploadService.uploadImageFromUrl()
    }).send(res)
  }
  uploadImageLocal = async (req, res, next) => {
    if (!req.file) {
      throw new BadRequestError('Request upload invalid')
    }
    return new OK({
      message: 'Image uploaded from local successfully',
      metadata: await uploadService.uploadImageLocal({
        path: req.file.path
      })
    }).send(res)
  }
  uploadMultiple = async (req, res, next) => {
    if (!req.files.length) {
      throw new BadRequestError('Request upload invalid')
    }
    return new OK({
      message: 'Image uploaded from local successfully',
      metadata: await uploadService.uploadMultiple({
        files: req.files
      })
    }).send(res)
  }
  uploadImageFromLocalS3 = async (req, res, next) => {
    if (!req.file) {
      throw new BadRequestError('Request upload invalid')
    }
    return new OK({
      message: 'Image uploaded from local s3 successfully',
      metadata: await uploadService.uploadImageFromLocalS3({ file: req.file })
    }).send(res)
  }

}

export default new UploadController()