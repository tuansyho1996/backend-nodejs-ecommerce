'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import inventoryController from '../../controllers/inventory.controller.js'
import { authenticationV2 } from '../../auth/authUntils.js'
const router = express.Router()

router.use(asyncHandle(authenticationV2))
router.post('/add-stock', asyncHandle(inventoryController.addStockToInventory))

export default router