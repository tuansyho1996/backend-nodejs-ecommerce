'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import { authenticationV2 } from '../../auth/authUntils.js'
import productController from '../../controllers/product.controller.js'

const router = express.Router()

// authentication
router.use(asyncHandle(authenticationV2))
//create product
router.post('/create', asyncHandle(productController.createProduct))



export default router

