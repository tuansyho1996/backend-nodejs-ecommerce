'use strict'

import { asyncHandle } from "../../auth/checkAuth.js"

import express from 'express'
import notificationController from "../../controllers/notification.controller.js"
import { authenticationV2 } from "../../auth/authUntils.js"
const router = express.Router()

router.use(asyncHandle(authenticationV2))
router.get('', asyncHandle(notificationController.listNotiByUser))

export default router