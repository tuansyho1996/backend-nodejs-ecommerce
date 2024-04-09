'use strict'
import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'Comment'
const COLLECTION = 'Comments'

// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema(
  {
    comment_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    comment_isDelete: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, commentSchema);