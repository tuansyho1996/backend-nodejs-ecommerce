'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import { authenticationV2 } from '../../auth/authUntils.js'
import productController from '../../controllers/product.controller.js'

const router = express.Router()

//get all product
router.get('/get-all-product', asyncHandle(productController.findAllProduct))
//get one product
router.get('/get-one-product/:id', asyncHandle(productController.findOneProduct))

// authentication
router.use(asyncHandle(authenticationV2))
//create product
router.post('/create', asyncHandle(productController.createProduct))

//GET QUERY
//get all draft product
router.get('/get-all-draft-shop', asyncHandle(productController.findAllDraftForShop))
//get all publish product for shop
router.get('/get-all-publish-shop', asyncHandle(productController.findAllPublishForShop))
//publish one product
router.get('/publish-product-by-shop/:id', asyncHandle(productController.publishProductByShop))
//unPublish one product
router.get('/unpublish-product-by-shop/:id', asyncHandle(productController.unPublishProductByShop))


//PATCH
//update product by id
router.patch('/update-product/:productId', asyncHandle(productController.updateProduct))



export default router

