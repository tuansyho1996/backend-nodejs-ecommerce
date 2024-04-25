'use strict'
import process from 'process'
import { v2 } from 'cloudinary'
import 'dotenv/config.js'

const cloudinary = v2

cloudinary.config({
  cloud_name: 'ecommerce2024',
  api_key: '554542315435766',
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export default cloudinary

