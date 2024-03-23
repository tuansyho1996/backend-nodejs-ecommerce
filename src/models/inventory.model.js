'use strict'

import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_productId: { type: Types.ObjectId, ref: 'Product' },
    inven_shopId: { type: Types.ObjectId, ref: 'Shop' },
    inven_stock: { type: Number, required: true },
    inven_reservation: { type: Array, default: [] }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }

);

//Export the model
export default model(DOCUMENT_NAME, inventorySchema);