'use strict'
import { product, electronic, clothing, } from "../product.model.js"
import { unGetSelectData, getSelectData, convertToObjectIdMongodb } from "../../utils/index.js"

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
  const products = await product.find(query).
    populate('product_shop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
  return products
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
const findAllProducts = async ({ filter, sort, limit, page, select }) => {
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
    .select(unGetSelectData(['__v']))
    .lean()
    .exec()
}
const updateProductById = async ({ id, bodyUpdate, model, isNew = true }) => {
  console.log('update product body', bodyUpdate)
  return await model.findByIdAndUpdate(id, bodyUpdate, { new: isNew })
}
const findProductById = async (id) => {
  return await product.findById(convertToObjectIdMongodb(id))
}
const checkProductService = async (products) => {
  return await Promise.all(products.map(async (product) => {
    const foundProduct = await findProductById(product.productId)
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}
export {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  findAllProducts,
  findOneProduct,
  updateProductById,
  findProductById,
  checkProductService
}