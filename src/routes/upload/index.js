'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import uploadController from '../../controllers/upload.controller.js'
import { authenticationV2 } from '../../auth/authUntils.js'
import { uploadDisk, uploadMemory } from '../../configs/multer.config.js'
const router = express.Router()

router.post('/product', asyncHandle(uploadController.uploadImageFromUrl))
router.post('/product/image-local', uploadDisk.single('file'), asyncHandle(uploadController.uploadImageLocal))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandle(uploadController.uploadMultiple))
router.post('/product/upload-local-s3', uploadMemory.single('file'), asyncHandle(uploadController.uploadImageFromLocalS3))

export default router