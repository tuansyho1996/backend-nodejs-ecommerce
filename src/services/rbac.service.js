'use strict'

import { BadRequestError } from "../core/error.response.js"
import resourceModel from "../models/resource.model.js"
import roleModel from "../models/role.model.js"

class rbac {
  static async createResource(data) {
    try {
      const { name, slug, description } = data
      const isResource = await resourceModel.findOne({ where: { src_slug: slug } })
      if (isResource) {
        throw new BadRequestError('Resource already exists')
      }
      const newResource = await resourceModel.create({
        src_name: name,
        src_slug: slug,
        src_description: description
      })
      return newResource
    } catch (error) {
      return error
    }

  }
  static async resourceList(
    user_id = 0,
    limit = 30,
    offset = 0,
    search = ''
  ) {
    try {
      const resourceList = await resourceModel.aggregate([
        {
          $project: {
            _id: 0,
            name: '$src_name',
            slug: '$src_slug',
            description: '$src_description',
            resource_id: '$_id',
            createAt: 1
          }
        }
      ])
      return resourceList
    } catch (error) {
      return []
    }
  }
  static async createRole(data) {
    try {
      const { name, slug, description, grants } = data
      const isRole = await roleModel.findOne({ where: { rol_slug: slug } })
      if (isRole) {
        throw new BadRequestError('Role already exists')
      }
      const newRole = await roleModel.create({
        rol_name: name,
        rol_slug: slug,
        rol_description: description,
        rol_grants: grants
      })
      return newRole
    } catch (error) {
      return error
    }
  }
  static async roleList() {
    try {
      // const roleList = await roleModel.find()
      const roleList = await roleModel.aggregate([
        {
          $unwind: '$rol_grants'
        },
        {
          $lookup: {
            from: 'Resources',
            localField: 'rol_grants.resource',
            foreignField: '_id',
            as: 'resource'
          }
        },
        {
          $unwind: '$resource'
        },
        {
          $project: {
            role: '$rol_name',
            resource: '$resource.src_name',
            action: '$rol_grants.actions',
            attributes: '$rol_grants.attributes'
          }
        },
        {
          $unwind: '$action'
        }
      ])
      return roleList
    } catch (error) {

    }
  }
}
export default rbac