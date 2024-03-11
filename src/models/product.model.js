'use strick'

import mongoose from "mongoose";
import { Schema } from "mongoose";
import slugify from "slugify";

const COLLECTION_NAME = 'Products'
const DOCUMENT_NAME = 'Product'
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      //4.3333= 4.3
      set: (val) => Math.round(val * 10) / 10
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
);
// Document middleware: runs before save() and create() ...

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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