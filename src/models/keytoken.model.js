'use strict'

//!dbmg
import mongoose from "mongoose";
import { Schema } from "mongoose";

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop',
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: Array,
            default: [],
        },

    },
    {
        collection: COLLECTION_NAME,
        timestamp: true
    }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, keyTokenSchema);