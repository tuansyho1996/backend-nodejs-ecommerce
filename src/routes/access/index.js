'use strict'

import express from 'express'
import accessController from '../../controllers/access.controller.js'
import { asyncHandle } from '../../auth/checkAuth.js'

const router = express.Router()


//sign up
router.post('/shop/signup', asyncHandle(accessController.signUp))

export default router

