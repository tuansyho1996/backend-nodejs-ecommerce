'use strict'

import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: 'fixed_amount' },
    discount_value: { type: Number, require: true },
    discount_code: { type: String, require: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_uses: { type: Number, require: true },
    discount_uses_count: { type: Number, default: 0 },
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_max_value: { type: Number, require: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: false },
    discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }

);

//Export the model
export default model(DOCUMENT_NAME, discountSchema);