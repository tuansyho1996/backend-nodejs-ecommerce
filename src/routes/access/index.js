'use strict'

import express from 'express'
import accessController from '../../controllers/access.controller.js'
import { asyncHandle } from '../../auth/checkAuth.js'
import { authenticationV2 } from '../../auth/authUntils.js'

const router = express.Router()


//sign up
router.post('/shop/signup', asyncHandle(accessController.signUp))
//login
router.post('/shop/login', asyncHandle(accessController.login))
// authentication
router.use(asyncHandle(authenticationV2))
//logout
router.post('/shop/logout', asyncHandle(accessController.logout))
// refresh token
router.post('/shop/refresh-token', asyncHandle(accessController.handleRefreshToken))


export default router

