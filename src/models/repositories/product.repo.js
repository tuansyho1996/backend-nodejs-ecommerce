'use strict'
import { query } from "express"
import { product, electronic, clothing, } from "../product.model.js"
import { UnGetSelectData, getSelectData } from "../../utils/index.js"

const findAllDraftForShop = async (query, limit, skip) => {
  return await product.find(query).
    populate('product_shop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
const findAllPublishForShop = async (query, limit, skip) => {
  return await product.find(query).
    populate('product_shop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
const publishProductByShop = async (product_shop, product_id) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id
  })
  if (!foundShop) return null
  const { modifiedCount } = await product.updateMany({ _id: product_id }, { isDraft: false, isPublished: true })
  return modifiedCount
}
const unPublishProductByShop = async (product_shop, product_id) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id
  })
  if (!foundShop) return null
  const { modifiedCount } = await product.updateMany({ _id: product_id }, { isPublished: false })
  return modifiedCount
}
// query all product for shop
const findAllProduct = async ({ filter, sort, limit, page, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec()
}
const findOneProduct = async (_id) => {
  return await product.find({ _id })
    .select(UnGetSelectData(['__v']))
    .lean()
    .exec()
}
export {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  findAllProduct,
  findOneProduct
}