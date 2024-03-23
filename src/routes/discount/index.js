'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import { authenticationV2 } from '../../auth/authUntils.js'
import discountController from '../../controllers/discount.controller.js'
const router = express.Router()



// authentication
router.use(asyncHandle(authenticationV2))
//get discount for shop
router.get('/shop/:shopId', asyncHandle(discountController.getAllDiscountCodesByShopSelect))

//create distcount
router.post('/create', asyncHandle(discountController.createDiscount))
//update discount
router.patch('/update/:discountId', asyncHandle(discountController.updateDiscount))




export default router

