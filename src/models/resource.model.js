'use strict'

import { model, Schema } from "mongoose"

const DOCUMENT_NAME = 'Resource'
const COLLECTION = 'Resources'

const resourceSchema = new Schema({
  src_name: { type: String, require: true },
  src_slug: { type: String, require: true },
  src_description: { type: String, default: '' }
}, {
  timestamps: true,
  collection: COLLECTION
})

export default model(DOCUMENT_NAME, resourceSchema)