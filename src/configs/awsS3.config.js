import { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";
import 'dotenv/config.js'

const configS3 = {
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY
  }
}
const s3 = new S3Client(configS3)
export {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand
}