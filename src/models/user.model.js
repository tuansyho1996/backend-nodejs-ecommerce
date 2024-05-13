'use strict'

import { model, Schema } from "mongoose"

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const usersSchema = new Schema({
  usr_id: { type: Number, require: true },
  usr_name: { type: String, default: '' },
  usr_slug: { type: String, require: true },
  usr_password: { type: String, default: '' },
  usr_salf: { type: String, default: '' },
  usr_email: { type: String, require: true },
  usr_phone: { type: String, default: '' },
  usr_sex: { type: String, default: '' },
  usr_avatar: { type: String, default: '' },
  usr_date_of_birth: { type: Date, default: null },
  usr_role: { type: Schema.Types.ObjectId, ref: 'Role' },
  usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

export default model(DOCUMENT_NAME, usersSchema)
