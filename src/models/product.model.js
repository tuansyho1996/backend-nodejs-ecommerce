'use strick'

import mongoose from "mongoose";
import { Schema } from "mongoose";

const COLLECTION_NAME = 'Products'
const DOCUMENT_NAME = 'Product'
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
);

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String
  },
  {
    collection: 'clothes',
    timestamps: true
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufactures: { type: String, required: true },
    model: String,
    color: String
  },
  {
    collection: 'electronics',
    timestamps: true
  }
);

//Export the model

const product = mongoose.model(DOCUMENT_NAME, productSchema)
const clothing = mongoose.model('Clothing', clothingSchema)
const electronic = mongoose.model('Electronic', electronicSchema)
export {
  product,
  clothing,
  electronic
}