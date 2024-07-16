'use strict'

import express from "express"
import { asyncHandle } from "../../auth/checkAuth.js"
import shopsController from "../../controllers/shops.controller.js"
import { uploadDisk, uploadMemory } from "../../configs/multer.config.js"

const router = express.Router()

router.get('/list-all-shops', asyncHandle(shopsController.getAllShops))
router.post('/create', uploadMemory.single('file'), asyncHandle(shopsController.createNewShop))

export default router
