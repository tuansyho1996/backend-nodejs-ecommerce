'use strict'

import express from 'express'
import profileController from '../../controllers/profile.controller.js'
import grantAccess from '../../middleware/rbac.js'

const router = express.Router()


//admin
router.get('/viewAny', grantAccess('readAny', 'profile'), profileController.profiles)
//shop
router.get('/viewOwn', grantAccess('readOwn', 'profile'), profileController.profile)



export default router

