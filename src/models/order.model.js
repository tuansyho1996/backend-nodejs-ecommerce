'use strict'

import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    /*
    {
      totalPrice,
      PriceApllyDiscount,
      feeShip
    }
    */
    order_shipping: { type: Object, default: {} },
    /*
    {
      street,
      state,
      city,
      country
    }
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },

  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }

);

//Export the model
export default model(DOCUMENT_NAME, orderSchema);