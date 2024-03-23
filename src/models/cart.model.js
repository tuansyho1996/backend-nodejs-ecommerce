import mongoose from "mongoose";

const DOCUMENT_NAME = 'Cart'
const COLLECTION = 'Carts'

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String, require: true,
      enum: ['active', 'completed', 'failed', 'pedding'],
      default: 'active',
    },
    cart_products: { type: Array, require: true, default: [], },
    /*
    {
      product_id,
      price,
      quantity,
      shopId
    }
    */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: String, require: true }
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
export default mongoose.model(DOCUMENT_NAME, cartSchema);