'use strict'

import { model, Schema } from "mongoose"

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

const roleSchema = new Schema({
  rol_name: { type: String, default: 'user', enum: ['admin', 'shop', 'user'] },
  rol_slug: { type: String, required: true },
  rol_status: { type: String, default: 'active', enum: ['active', 'pending', 'block'] },
  rol_description: { type: String, default: '' },
  rol_grants: [
    {
      resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
      actions: [{ type: String, required: true }],
      attributes: { type: String, default: '*' }
    }
  ]
},
  {
    timestamps: true,
    collection: COLLECTION_NAME
  })

export default model(DOCUMENT_NAME, roleSchema)
