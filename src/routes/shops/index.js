'use strict'

import express from "express"
import { asyncHandle } from "../../auth/checkAuth.js"
import shopsController from "../../controllers/shops.controller.js"
import { authenticationV2 } from "../../auth/authUntils.js"
import { uploadDisk, uploadMemory } from "../../configs/multer.config.js"

const router = express.Router()

// router.use(asyncHandle(authenticationV2))

router.get('/list-all-shops', asyncHandle(shopsController.getAllShops))
router.get('/getshop', asyncHandle(shopsController.getShop))
router.post('/import-many-shops', asyncHandle(shopsController.importManyShops))
router.post('/create', uploadMemory.single('file'), asyncHandle(shopsController.createNewShop))
router.post('/change-avatar', uploadMemory.single('file'), asyncHandle(shopsController.changeAvatar))
router.post('/edit-information', asyncHandle(shopsController.editInformation))

export default router
