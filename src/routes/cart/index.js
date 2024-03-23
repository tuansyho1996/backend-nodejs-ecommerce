'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import cartController from '../../controllers/cart.controller.js'
const router = express.Router()


//get list product cart by userId
router.get('/', asyncHandle(cartController.getListProductCartByUserId))
//add to cart 
router.post('/', asyncHandle(cartController.addToCart))
//update cart
router.patch('/update', asyncHandle(cartController.updateProductCart))
//delete item cart
router.delete('/delete', asyncHandle(cartController.deleteProductCart))






export default router

