'use strict'

import { CREATED, OK } from "../core/success.response.js"
import rbacService from "../services/rbac.service.js"

class RbacController {
  createRole = async (req, res, next) => {
    return new CREATED({
      message: 'Create role successfully!',
      metadata: await rbacService.createRole(req.body)
    }).send(res)
  }
  roleList = async (req, res, next) => {
    return new OK({
      message: 'Get list role successfully!',
      metadata: await rbacService.roleList()
    }).send(res)
  }
  createResource = async (req, res, next) => {
    return new CREATED({
      message: 'Create resource successfully!',
      metadata: await rbacService.createResource(req.body)
    }).send(res)
  }
  resourceList = async (req, res, next) => {
    return new OK({
      message: 'Get list resource successfully!',
      metadata: await rbacService.resourceList()
    }).send(res)
  }
}
export default new RbacController()