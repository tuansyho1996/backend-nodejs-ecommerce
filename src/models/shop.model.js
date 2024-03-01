import mongoose from "mongoose";
import { Schema } from "mongoose";

const COLLECTION_NAME = 'Shops'
const DOCUMENT_NAME = 'Shop'



// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false
    },
    roles: {
      type: Array,
      default: []
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, shopSchema);