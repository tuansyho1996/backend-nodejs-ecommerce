'use strict'

import express from 'express'
import rbacController from '../../controllers/rbac.controller.js'

const router = express.Router()


router.post('/role', rbacController.createRole)
router.get('/list-role', rbacController.roleList)
router.post('/resource', rbacController.createResource)
router.get('/list-resource', rbacController.resourceList)



export default router

