'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import uploadController from '../../controllers/upload.controller.js'
import { authenticationV2 } from '../../auth/authUntils.js'
import { uploadDisk } from '../../configs/multer.config.js'
const router = express.Router()

router.post('/product', asyncHandle(uploadController.uploadImageFromUrl))
router.use('/product/image-local', uploadDisk.single('file'), asyncHandle(uploadController.uploadImageLocal))

export default router