'use strict'
import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'Notification'
const COLLECTION = 'Notifications'

//ORDER-001:order successfuly
//ORDER-002:order failed
//PROMOTION-001: new promotion
//SHOP-001: NEW product

// Declare the Schema of the Mongo model
const notificationSchema = new mongoose.Schema(
  {
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], require: true },
    noti_senderId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    noti_receivedId: { type: Number, require: true },
    noti_content: { type: String, require: true },
    noti_option: { type: Object, default: {} }
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
export default mongoose.model(DOCUMENT_NAME, notificationSchema);