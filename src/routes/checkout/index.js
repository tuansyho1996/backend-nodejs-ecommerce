'use strict'

import express from 'express'
import { asyncHandle } from '../../auth/checkAuth.js'
import checkoutController from '../../controllers/checkout.controller.js'
const router = express.Router()


//get list product cart by userId
router.post('/review', asyncHandle(checkoutController.checkoutReview))


export default router

