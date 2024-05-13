'use strict'
import { AuthFailureError } from '../core/error.response.js'
import rbac from './role.middleware.js'


const grantAccess = (action, resource) => {
  return (req, res, next) => {
    try {
      const role_name = req.query.role
      const permission = rbac.can(role_name)[action](resource)
      if (!permission.granted) {
        throw new AuthFailureError('You dont have enough permissions...')
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
export default grantAccess